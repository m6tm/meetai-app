/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { prisma } from "@ai/adapters/db"
import { TypePlan } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    const form = await req.formData()
    const email = form.get('email')?.toString()
    const name = form.get('name')?.toString() ?? ''

    if (typeof email !== 'string') {
        return NextResponse.json({
            error: 'The email is required'
        }, {
            status: 400
        })
    }

    const user_exist = (await prisma.user.findUnique({
        where: {
            email
        }
    })) !== null

    if (user_exist) {
        return NextResponse.json({
            error: 'User already exist',
            data: null,
        }, {
            status: 400
        })
    }

    try {
        let basicPlan = await prisma.plan.findFirst({
            where: { type: TypePlan.BASIC }
        })

        if (!basicPlan) basicPlan = await prisma.plan.create({
            data: {
                name: "Basic",
                price: 0,
                type: TypePlan.BASIC
            }
        })

        await prisma.user.create({
            data: {
                email,
                name,
                subscription: {
                    create: {
                        plan: {
                            connect: {
                                id: basicPlan.id
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            error: null,
            data: null,
        })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({
            error: 'Something went wrong',
            data: null,
        }, {
            status: 500
        })
    }
}