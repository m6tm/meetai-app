/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { getPrisma } from '@ai/adapters/db';
import { DEFAULT_AVATAR } from '@ai/utils/constants';
import { TypePlan } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { faker } from '@faker-js/faker';

const prisma = getPrisma();

async function main() {
    const plans = [
        {
            name: 'Basic',
            price: new Decimal(0),
            type: TypePlan.BASIC,
        },
        {
            name: 'Most popular',
            price: new Decimal(49.99),
            type: TypePlan.SILVER,
        },
        {
            name: 'Recommended',
            price: new Decimal(99.99),
            type: TypePlan.GOLDEN,
        },
    ];

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: {
                name: plan.name,
            },
            update: {
                price: plan.price,
                type: plan.type,
            },
            create: {
                name: plan.name,
                price: plan.price,
                type: plan.type,
            },
        });
    }

    const user = await prisma.user.upsert({
        where: {
            email: 'test@test.com',
        },
        update: {},
        create: {
            name: 'Test User',
            email: 'test@test.com',
            avatar: DEFAULT_AVATAR,
            nickname: faker.person.middleName(),
        },
    });

    const basicPlan = await prisma.plan.findUnique({
        where: {
            name: 'Basic',
        },
    });

    if (basicPlan) {
        await prisma.subscription.create({
            data: {
                user_id: user.id,
                plan_id: basicPlan.id,
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
        });
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
