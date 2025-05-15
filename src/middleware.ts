/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { TSession } from './lib/session';
import { cookies } from 'next/headers';

export default async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    const session = await getSession(sessionCookie?.value ?? '');
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);
    const pathname = request.nextUrl.pathname;
    const _cookies = await cookies();
    const currentLocale = _cookies.get('NEXT_LOCALE')?.value;

    if (!currentLocale) {
        _cookies.set('NEXT_LOCALE', routing.defaultLocale);
        return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
    }
    const isDashboard = pathname.startsWith(`/${currentLocale}/dashboard`);

    if (!session && isDashboard) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
}

export const config = {
    // matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
    matcher: ['/', '/(fr|en)/:path*'],
};

async function parseJWTPayload(token: string): Promise<TSession | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

async function getSession(token: string): Promise<TSession | null> {
    try {
        const payload = await parseJWTPayload(token);
        if (!payload) return null;

        return payload;
    } catch {
        return null;
    }
}
