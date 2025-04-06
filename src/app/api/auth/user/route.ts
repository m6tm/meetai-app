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

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email')?.toString();

    if (!email) {
        return NextResponse.json({
            error: 'Email is required',
            data: null,
            code: 400
        }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                subscription: {
                    include: {
                        plan: true
                    }
                }
            }
        });

        return NextResponse.json({
            error: null,
            data: user,
            code: 200
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({
            error: 'Internal server error',
            data: null,
            code: 500
        }, { status: 500 });
    }
}