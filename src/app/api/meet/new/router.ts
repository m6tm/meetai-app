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
import { Role } from "@prisma/client"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const formData = await request.formData()
    const code = formData.get('code')
    const guests: string[] = JSON.parse(String(formData.get('guests') ?? '[]'))
    const moderator = formData.get('moderator')
    const startDate = formData.get('start_date')

    if (!code || !moderator) {
        return NextResponse.json({
            error: 'code and moderator are required',
            data: null,
            code: 400
        }, {
            status: 400,
        })
    }

    const prisma = getPrisma()

    // Create or find moderator
    const user = await prisma.user.findFirst({
        where: { email: moderator as string }
    })

    if (!user) {
        return NextResponse.json({
            error: 'moderator not found',
            data: null,
            code: 404
        }, {
            status: 404,
        })
    }

    // Create meeting
    const meeting = await prisma.meeting.create({
        data: {
            code: code as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
        }
    })

    await prisma.guestMeeting.create({
        data: {
            meeting_id: meeting.id,
            role: Role.moderator,
            updatedAt: new Date(),
            user_id: user.id
        }
    })

    // Create guests and their meeting associations
    for (const guestEmail of guests) {
        const guest = await prisma.guest.upsert({
            where: { email: guestEmail },
            create: { email: guestEmail },
            update: {}
        })

        await prisma.guestMeeting.create({
            data: {
                meeting_id: meeting.id,
                role: Role.guest,
                updatedAt: new Date(),
                guest_id: guest.id,
            }
        })
    }

    return NextResponse.json({
        error: null,
        data: null,
        code: 200
    })
}
