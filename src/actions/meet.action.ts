/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
"use server";

import { getPrisma } from "@ai/adapters/db";
import { makeRequest } from "@ai/lib/utils";
import { defaultStateAction } from "@ai/types/definitions";
import { GuestMeeting } from "@prisma/client";
import { User } from "firebase/auth";

export async function saveInvitation(code: string, guests: string[], moderator: string, date?: Date) {
    const formData = new FormData();
    formData.append('code', code);
    formData.append('guests', JSON.stringify(guests));
    formData.append('moderator', moderator);
    if (date) formData.append('start_date', date.toISOString());

    const response = await makeRequest<null>('/api/meet/new', formData, 'POST');
    return response;
}

export type CreateInvitationResponse = {
    message: string;
    meetCode?: string;
    status: 'ok' | 'error';
};

export async function createInvitation(state: defaultStateAction, form: FormData): Promise<CreateInvitationResponse> {
    if (form.get('state') === 'reset') {
        console.log('Resetting state');
        return {
            message: "",
            meetCode: undefined,
            status: 'error'
        }
    }

    const prisma = getPrisma()
    const users = await prisma.user.count()
    console.log("users", users);

    return {
        message: "Invitation created successfully",
        status: 'ok',
        meetCode: "123456",
    };
}

export async function getMyMeetings(user: User) {
    const formData = new FormData();
    formData.append('userId', user.uid);

    const response = await makeRequest<GuestMeeting[] | null>('/api/meet/my-meetings', formData, 'GET');
    return response;
}
