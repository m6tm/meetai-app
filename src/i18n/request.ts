/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
