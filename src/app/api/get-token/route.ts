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
import { AccessToken } from 'livekit-server-sdk';

const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const room_name = formData.get('room_name')
    const participant_name = formData.get('participant_name')

    if (!room_name || !participant_name) {
        return NextResponse.json({
            message: 'room_name or participant_name are required',
            data: null
        }, {
            status: 400
        })
    }

    const token = new AccessToken(apiKey, apiSecret, {
        identity: participant_name as string,
    });

    token.addGrant({
        roomJoin: true,
        room: room_name as string,
        canPublish: true,
        canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
        message: 'success',
        data: {
            token: jwt
        }
    })
}