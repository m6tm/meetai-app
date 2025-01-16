/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from 'react';
import LayoutComponent from '@ai/components/layout';
import '@styles/animations.css';
import MeetingSideBar from '@ai/components/meeting-sidebar';
import Meeting from '@ai/components/meeting';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';

export async function generateMetadata() {
    return {
        title: 'Meet ai LLC - Visioconference',
        description: 'Meet ai LLC - Appels vidéo et visioconferences pour tous',
    };
}

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
];

export default async function Home() {
    const prisma = new PrismaClient()
    const basic = await prisma.user.findMany()
    console.log(basic, plans);
    
    return (
        <LayoutComponent>
            <div className="lg:flex">
                <MeetingSideBar />
                <Meeting />
            </div>
        </LayoutComponent>
    );
}
