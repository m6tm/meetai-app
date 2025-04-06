/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { getPrisma } from "@ai/adapters/db"


export async function POST(request: Request) {
    const formData = await request.formData()
    const room_code = formData.get('code')
    const participant_email = formData.get('email')
    const startDate = formData.get('start_date')
    const endDate = formData.get('end_date')

    if (!room_code || !participant_email) {
        return new Response(JSON.stringify({
            error: 'room code and participant email are required',
            data: null,
            code: 400
        }), {
            status: 400,
        })
    }

    const prisma = getPrisma()
    const user = await prisma.user.findFirst({
        where: {
            email: participant_email as string,
        }
    })

    if (!user) {
        return new Response(JSON.stringify({
            error: 'user not found',
            data: null,
            code: 404
        }), {
            status: 404,
        })
    }

    const meeting = await prisma.meeting.create({
        data: {
            code: room_code as string,
            user_id: user.id,
            startDate: startDate ? new Date(startDate as string) : null,
            endDate: endDate ? new Date(endDate as string) : null,
            role: 'moderator',
        }
    })

    return new Response(JSON.stringify({
        error: null,
        data: meeting,
        code: 201
    }), {
        status: 201,
    })
}
