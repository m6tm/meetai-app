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
import { NextResponse } from 'next/server';
import { getSession } from './lib/session';

export default createMiddleware(routing);

export async function middleware(request: Request) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api')) {
        const session = await getSession('session');
        if (!session) {
            return NextResponse.json({
                error: 'Unauthorized',
                data: null,
                code: 401
            }, {
                status: 401
            });
        }
        return NextResponse.next();
    }

    // Add your custom logic here
    // For example, you can check for authentication or other conditions

    return NextResponse.next();
}

export const config = {
    // matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
    matcher: ['/', '/(fr|en)/:path*'],
};
