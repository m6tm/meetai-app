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
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@ai/types/definitions';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
    try {
        // Vérifiez que la session existe et qu'elle n'est pas vide
        if (!session || session.trim() === '') {
            console.log('Session is empty or undefined');
            return null;
        }

        // Vérifiez que la clé secrète existe
        if (!secretKey || secretKey.trim() === '') {
            console.log('Session secret key is not defined');
            return null;
        }

        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify session', error);
        // Retournez explicitement null en cas d'erreur
        return null;
    }
}

export async function createSession(userId: string, session_name: string = 'session', path: string = '/') {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    const cookieStore = await cookies();

    cookieStore.set(session_name, session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path,
    });
}

export async function updateSession(session_name: string, new_value: string, path: string = '/') {
    session_name = !session_name ? 'session' : session_name;
    const session = (await cookies()).get(session_name)?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set(session_name, session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path,
    });
}

export async function deleteSession(session_name: string = 'session') {
    const cookieStore = await cookies();
    cookieStore.delete(session_name);
}

type Session = {
    userId: string;
    expiresAt: string;
};

export async function getSession(session_name: string = 'session'): Promise<Session | null> {
    try {
        const session = (await cookies()).get(session_name)?.value;

        // Vérifiez que le cookie existe
        if (!session) {
            console.log(`Cookie ${session_name} not found`);
            return null;
        }

        const data = await decrypt(session);

        // Vérifiez que le déchiffrement a réussi
        if (!data) {
            console.log('Failed to decrypt session data');
            return null;
        }

        const { userId, expiresAt } = data as Session;

        // Vérifiez que les données nécessaires sont présentes
        if (!userId || !expiresAt) {
            console.log('Session data is missing required fields');
            return null;
        }

        // Vérifiez que la session n'a pas expiré
        if (new Date(expiresAt) < new Date()) {
            console.log('Session has expired');
            return null;
        }

        return { userId, expiresAt };
    } catch (error) {
        console.error('Error in getSession:', error);
        return null;
    }
}
