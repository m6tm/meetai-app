/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use client'
import { getSession, updateSession } from "@ai/lib/session";

export async function useLocale() {
    const locale = await getLocale();
    return [ locale, setLocale ];
}

async function getLocale() {
    const locale = (await getSession('locale')) ?? 'en';
    return locale as 'en' | 'fr';
}

async function setLocale(locale: 'en' | 'fr') {
    await updateSession('locale', locale);
}
