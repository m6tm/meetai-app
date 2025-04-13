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
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            error: 'userId is required',
            data: null,
            code: 400
        }, {
            status: 400,
        });
    }

    const prisma = getPrisma();

    return prisma.guestMeeting.findMany({
        where: {
            guest_id: Number(userId),
        },
        include: {
            meeting: true,
            guest: true,
        },
    }).then((meetings) => {
        return NextResponse.json({
            error: null,
            data: meetings,
            code: 200
        }, {
            status: 200,
        });
    }).catch((error) => {
        return NextResponse.json({
            error: error.message,
            data: null,
            code: 500
        }, {
            status: 500,
        });
    });
}