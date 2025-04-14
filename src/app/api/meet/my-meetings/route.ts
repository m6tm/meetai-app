/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { getPrisma } from "@ai/adapters/db";
import { getSession } from "@ai/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession('session');
    if (!session) {
        return NextResponse.json({
            error: 'Unauthorized',
            data: null,
            code: 401
        }, {
            status: 401
        });
    }

    const { userId: email } = session;
    const prisma = getPrisma();
    const meetings = await prisma.guestMeeting.findMany({
        where: {
            OR: [
                {
                    guest: {
                        email: email
                    }
                },
                {
                    user: {
                        email: email
                    }
                }
            ]
        },
        include: {
            guest: true,
            user: true,
            meeting: true,
        }
    });

    return NextResponse.json({
        error: null,
        data: meetings,
        code: 200
    })
}