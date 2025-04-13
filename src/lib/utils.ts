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
import { TParticipantMetadata } from '@ai/types/data';
import { RequestMethod, UniversalResponse } from '@ai/types/requests/other.type';
import { clsx, type ClassValue } from 'clsx';
import { Participant } from 'livekit-client';
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

export async function makeRequest<TResponse>(uri: string, form: FormData | undefined = undefined, method: RequestMethod = 'GET', header?: HeadersInit): Promise<UniversalResponse<TResponse>> {

    let _uri = uri
    const mode = process.env.NEXT_PUBLIC_APP_MODE
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dev_options: RequestInit = mode && mode === 'development' ? {
        mode: 'cors',
        credentials: 'include',
    } : {}
    let options: RequestInit | undefined = {
        // ...dev_options,
        headers: header,
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
        const fetchResponse = await fetch(_uri, options)
        const jsonResponse = await fetchResponse.json()
        return {
            error: null,
            data: null,
            ...jsonResponse,
            code: fetchResponse.status,
        }
    } catch (error) {
        console.error('Request:', error)
        return {
            error: (error as Error).message,
            code: 500,
            data: null
        }
    }
}

export const randomUserName = () => `user-${Math.floor(Math.random() * 1000000)}`;

export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const shortDisplayUserName = (name: string) => {
    const nameArr = name.split(/[ _-]/)
    if (nameArr.length > 1) {
        return nameArr[0][0] + nameArr[1][0]
    }
    return nameArr[0][0]
}

const SECRET_BKEY = 'NWjsfWojyzBd1MrHql+AseAnSPyehaQC/hhv3VPxRu8=';

export const serializeData = <T>(data: T) => {
    const serializedData = JSON.stringify(data);
    const encodedData = btoa(serializedData + SECRET_BKEY);
    return encodedData;
}

export const deserializeData = <T>(data: string) => {
    const decodedData = atob(data);
    const cleanedData = decodedData.replace(SECRET_BKEY, '');
    const parsedData = JSON.parse(cleanedData);
    return parsedData as T;
}

export const getParticipantMetadata = (participant: Participant): TParticipantMetadata | undefined => {
    const metadata = participant.metadata;
    if (!metadata) return undefined;

    try {
        const parsedMetadata = deserializeData<TParticipantMetadata>(metadata);
        return parsedMetadata;
    } catch (error) {
        console.error('Error parsing metadata:', error);
        return undefined;
    }
}

export function generateMeetCode<T>(customData?: T): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (customData) return serializeData({ code, customData });
    return serializeData({ code, customData: undefined });
}
