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

export default createMiddleware(routing);

export async function middleware() {
    return NextResponse.next();
}

export const config = {
    // matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
    matcher: ['/', '/(fr|en)/:path*'],
};
