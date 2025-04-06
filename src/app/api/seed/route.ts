/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { Decimal } from '@prisma/client/runtime/library';
import { NextResponse } from 'next/server';
import { TypePlan } from '@prisma/client';
import { getPrisma } from '@ai/adapters/db';

export async function POST() {
    const prisma = getPrisma();
    const has_test_user = (await prisma.user.findFirst()) !== null
    if (has_test_user) return NextResponse.json({
        error: 'The seed has already been run',
        data: null,
        code: 400
    })

    const plans = [
        {
            name: 'Basic',
            price: new Decimal(0),
            type: TypePlan.BASIC
        },
        {
            name: 'Most popular',
            price: new Decimal(49.99),
            type: TypePlan.SILVER
        },
        {
            name: 'Recommended',
            price: new Decimal(99.99),
            type: TypePlan.GOLDEN
        },
    ]

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { name: plan.name },
            update: {
                price: plan.price,
                type: plan.type
            },
            create: {
                name: plan.name,
                price: plan.price,
                type: plan.type
            }
        })
    }

    const user = await prisma.user.upsert({
        where: { email: 'test@test.com' },
        update: {},
        create: {
            name: 'Test User',
            email: 'test@test.com'
        }
    })

    const basicPlan = await prisma.plan.findUnique({
        where: { name: 'Basic' }
    })

    if (basicPlan) {
        await prisma.subscription.create({
            data: {
                user_id: user.id,
                plan_id: basicPlan.id,
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            }
        })
    }

    return NextResponse.json({
        error: null,
        data: 'Seed completed',
        code: 200
    });
}

export async function GET() {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({
        include: {
            subscription: {
                include: {
                    plan: true
                }
            }
        }
    })
    const plans = await prisma.plan.findMany()
    return NextResponse.json({
        error: null,
        data: { users, plans },
        code: 200
    });
}