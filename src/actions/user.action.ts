/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use server';

import { getPrisma } from '@ai/adapters/db';
import { getSession } from '@ai/lib/session';

export async function getUserInfo() {
    const session = await getSession();
    const prisma = getPrisma();

    if (!session) {
        // Gérer le cas où l'utilisateur n'est pas connecté
        return null;
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.userId,
        },
    });

    if (!user) {
        // Gérer le cas où l'utilisateur n'est pas trouvé dans la base de données
        return null;
    }

    // Retourner les informations de l'utilisateur (vous pouvez ajuster les champs retournés)
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        language: undefined,
        // ... autres champs pertinents
    };
}
