/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { db } from '@ai/db';
import { RequestMethod } from '@ai/types/requests/other.type';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initializeLanguage() {
    const _locale = await db.locale.count();
    if (_locale === 0) {
        await db.locale.add({ locale: 'en' });
    }
    return { language_setted: _locale === 0 }
}

export async function getLanguage() {
    const _locale = await db.locale.orderBy('id').last();
    return _locale
}

export async function makeRequest<TResponse>(uri: string, form: FormData | undefined = undefined, method: RequestMethod = 'GET', header?: HeadersInit): Promise<TResponse> {
    let response = {
        error: null,
        data: null
    }

    let _uri = uri
    let options: RequestInit | undefined = {
        headers: header
    }

    if (method === 'GET') {
        const data: { [key: string]: string } = {}
        if (form)
            for (const [key, value] of form.entries()) {
                data[key] = value.toString()
            }
        _uri += '?' + new URLSearchParams(data)
    } else {
        options = {
            method,
            body: form
        }
    }

    try {
        // console.log(uri, form, method, header);
        response = await fetch(_uri, options)
            .then(response => response.json())
            .catch((error) => {
                return {
                    error,
                    data: null
                }
            })
    } catch (error) {
        response = {
            error: error as never,
            data: null
        }
    }

    return response as TResponse
}

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
