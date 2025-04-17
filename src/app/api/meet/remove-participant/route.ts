/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { TMeetRole } from "@ai/types/data";
import { RoomServiceClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.LIVEKIT_KEY;
const apiSecret = process.env.LIVEKIT_SECRET;
const apiHost = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const room_code = formData.get('room_code') as string | null;
    const participant_identity = formData.get('participant_identity') as string | null;
    const role = formData.get('role') as string | null;

    if (!room_code || !participant_identity || !role) {
        return NextResponse.json({
            error: 'Missing required fields. Please provide room code, participant identity and role.',
            data: null,
            code: 400
        }, {
            status: 400
        })
    }

    const isAdmin = (role as TMeetRole) === 'admin' || (role as TMeetRole) === 'moderator';
    if (!isAdmin) {
        return NextResponse.json({
            error: 'You are not authorized to remove participants',
            data: null,
            code: 403
        }, {
            status: 403
        })
    }

    const svc = new RoomServiceClient(
        apiHost!,
        apiKey,
        apiSecret
    )

    try {
        await svc.removeParticipant(room_code, participant_identity);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to remove participant',
            data: null,
            code: 500
        }, {
            status: 500
        });
    }

    return new Response(JSON.stringify({
        error: null,
        data: null,
        code: 200
    }))
}
