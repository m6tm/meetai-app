/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
import { NextResponse, type NextRequest } from "next/server";
import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { TParticipantMetadata, TMeetRole } from "@ai/types/data";
import { serializeData } from "@ai/lib/utils";
import { getPrisma } from "@ai/adapters/db";
import { getSession } from "@ai/lib/session";

const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error('LIVEKIT_KEY and LIVEKIT_SECRET must be set in environment variables');
}

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const session = await getSession('session');
    const room_name = formData.get('room_name')
    const participant_name = formData.get('participant_name')
    let role: TMeetRole = "guest"
    let avatar = "https://picsum.photos/id/11/100/100";

    if (!room_name || !participant_name) {
        return NextResponse.json({
            error: 'room_name or participant_name are required',
            data: null,
            code: 400
        }, {
            status: 400
        })
    }

    if (session) {
        const prisma = getPrisma()
        const user = await prisma.user.findUnique({
            where: {
                email: session.userId
            }
        })

        if (user) {
            const meetRole = await prisma.guestMeeting.findFirst({
                where: {
                    OR: [
                        {
                            user: {
                                email: user.email
                            }
                        },
                        {
                            guest: {
                                email: user.email
                            }
                        }
                    ]
                },
                select: {
                    role: true,
                    user: {
                        select: {
                            avatar: true,
                        }
                    }
                }
            })

            if (meetRole) role = meetRole.role
            avatar = user.avatar
        }
    }

    const metadata = serializeData<TParticipantMetadata>({
        role,
        joined: 'no',
        pinned: 'no',
        upHand: 'no',
        avatar,
    });

    const token = new AccessToken(apiKey, apiSecret, {
        identity: participant_name as string,
        name: participant_name as string,
        attributes: {
            metadata: metadata,
        },
    });

    token.addGrant({
        roomJoin: true,
        room: room_name as string,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
        canPublishSources: [TrackSource.CAMERA, TrackSource.MICROPHONE, TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO],
        canUpdateOwnMetadata: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
        error: null,
        data: { token: jwt },
        code: 200
    })
}