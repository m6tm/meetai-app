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

const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error('LIVEKIT_KEY and LIVEKIT_SECRET must be set in environment variables');
}

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const room_name = formData.get('room_name')
    const participant_name = formData.get('participant_name')
    const role = formData.get('role')

    if (!room_name || !participant_name) {
        return NextResponse.json({
            error: 'room_name or participant_name are required',
            data: null,
            code: 400
        }, {
            status: 400
        })
    }

    const metadata = serializeData<TParticipantMetadata>({
        name: participant_name as string,
        role: role ? (role as TMeetRole) : 'participant' as TMeetRole,
        joined: false,
    });

    const token = new AccessToken(apiKey, apiSecret, {
        identity: participant_name as string,
        name: participant_name as string,
        metadata: metadata,
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