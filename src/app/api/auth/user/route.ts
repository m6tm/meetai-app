/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { prisma } from "@ai/adapters/db";
import { UserResponse } from "@ai/types/requests/user.request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<UserResponse>> {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email')?.toString();

    if (!email) {
        return NextResponse.json({ data: null }, { status: 400 });
    }

    try {
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

        return NextResponse.json({ data: user as never });

    } catch (error) {
        console.error("Error fetching user:", error); // Log the error for debugging
        return NextResponse.json({ data: null }, { status: 500 });
    }
}