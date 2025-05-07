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
import { getSession } from './lib/session';
import { cookies } from 'next/headers';

export default async function middleware(request: NextRequest) {
    const session = await getSession();
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);
    const pathname = request.nextUrl.pathname;
    const currentLocale = (await cookies()).get('NEXT_LOCALE')?.value;

    if (!currentLocale) {
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
