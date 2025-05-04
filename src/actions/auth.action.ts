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
import { createSession, deleteSession, getSession } from '@ai/lib/session';
import { DEFAULT_AVATAR } from '@ai/utils/constants';
import { faker } from '@faker-js/faker';
import { TypePlan } from '@prisma/client';
import { z } from 'zod';

export async function signOutNow() {
    await deleteSession('session');
    return {
        error: null,
        data: null,
        code: 200,
    };
}

const signInValidator = z.object({
    email: z
        .string({
            required_error: "L'email est requis",
        })
        .email({
            message: "Le format de l'email est incorrect",
        }),
    name: z
        .string({
            invalid_type_error: 'Le nom doit être une chaîne de caractères',
        })
        .optional(),
    avatar: z
        .string({
            invalid_type_error: "L'avatar doit être une chaîne de caractères",
        })
        .optional(),
});

export async function newSignin(formData: FormData) {
    const passed = await signInValidator.safeParse(Object.fromEntries(formData.entries()));

    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null,
        };
    }
    const { email, name, avatar } = passed.data;

    const prisma = getPrisma();
    const user_exist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (user_exist) {
        await createSession(user_exist.email, 'session');
        return {
            error: 'User already exists',
            data: null,
            code: 200,
        };
    }

    try {
        let basicPlan = await prisma.plan.findFirst({
            where: { type: TypePlan.BASIC },
        });

        if (!basicPlan)
            basicPlan = await prisma.plan.create({
                data: {
                    name: 'Basic',
                    price: 0,
                    type: TypePlan.BASIC,
                },
            });

        const user = await prisma.user.create({
            data: {
                email,
                name,
                avatar: avatar ?? DEFAULT_AVATAR,
                nickname: faker.person.middleName(),
                subscription: {
                    create: {
                        plan: {
                            connect: {
                                id: basicPlan.id,
                            },
                        },
                    },
                },
            },
        });
        await createSession(user.email, 'session', '/');

        return {
            error: null,
            data: user,
            code: 200,
        };
    } catch (error) {
        return {
            error: 'Something went wrong' + ' ' + (error as Error).message,
            data: null,
            code: 500,
        };
    }
}
