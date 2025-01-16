/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { PrismaClient, TypePlan } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const plans = [
        {
            id: 1,
            name: 'Basic',
            price: new Decimal(0),
            type: "BASIC"
        },
        {
            id: 1,
            name: 'Most popular',
            price: new Decimal(49.99),
            type: "SILVER"
        },
        {
            id: 1,
            name: 'Recommended',
            price: new Decimal(99.99),
            type: "GOLDEN"
        },
    ]
    const basic = await prisma.plan.upsert({
        where: {
            name: 'Basic'
        },
        update: {},
        create: {
            name: 'Basic',
            price: 0,
            type: TypePlan.BASIC
        }
    })
    console.log({ basic })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })