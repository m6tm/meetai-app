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
import { getSession } from '@ai/lib/session';

export async function getMyMeets() {
    const prisma = getPrisma();
    const session = await getSession();
    if (!session) return [];

    const myMeets = await prisma.meeting.findMany({
        where: {
            guestMeetings: {
                some: {
                    user: {
                        email: session.userId,
                    },
                },
            },
        },
        select: {
            code: true,
            subject: true,
            createdAt: true,
        },
    });
    console.log('my meets', myMeets);
    const meets = [
        {
            id: 'meet-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            link: 'https://aimeet.app/m/abc123',
            participants: 8,
        },
        {
            id: 'meet-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            link: 'https://aimeet.app/m/def456',
            participants: 5,
        },
        {
            id: 'meet-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            link: 'https://aimeet.app/m/ghi789',
            participants: 6,
        },
        {
            id: 'meet-4',
            title: 'Entretien candidat',
            date: '10 mai, 11:00',
            link: 'https://aimeet.app/m/jkl012',
            participants: 3,
        },
        {
            id: 'meet-5',
            title: 'Formation nouvelle plateforme',
            date: '8 mai, 09:30',
            link: 'https://aimeet.app/m/mno345',
            participants: 12,
        },
    ];

    return meets;
}
