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
import { getSession } from "@ai/lib/session";
import { generateMeetCode, makeRequest } from "@ai/lib/utils";
import { defaultStateAction } from "@ai/types/definitions";
import { GuestMeeting } from "@prisma/client";
import { z } from "zod"

export type CreateInvitationResponse = {
    message: string;
    meetCode?: string;
    status: 'ok' | 'error';
};

const createInvitationSchema = z.object({
    start_date: z.string().optional(),
    invited_emails: z.array(z.string().email()).optional()
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createInvitation(state: defaultStateAction, form: FormData): Promise<CreateInvitationResponse> {
    if (form.get('state') === 'reset') {
        return {
            message: "",
            meetCode: undefined,
            status: 'error'
        }
    }

    const parsed = createInvitationSchema.safeParse({
        start_date: form.get('start_date'),
        invited_emails: form.getAll('invited_emails'),
    });

    if (!parsed.success) {
        console.error("Invalid form data", parsed.error);
        return {
            message: parsed.error.issues[0].message,
            meetCode: undefined,
            status: 'error'
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { start_date, invited_emails } = parsed.data;

    const session = await getSession('session')
    let meetCode = generateMeetCode()
    if (!session) return {
        message: "Invitation created successfully",
        meetCode: meetCode,
        status: 'ok',
    }

    meetCode = generateMeetCode({
        participants: invited_emails ?? [],
        mode: 'private',
        moderator: session.userId,
    })

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
        where: {
            email: session.userId
        }
    })

    const meeting = await prisma.meeting.create({
        data: {
            code: meetCode,
            startDate: start_date ? new Date(start_date) : undefined,
        }
    })

    await prisma.guestMeeting.create({
        data: {
            meeting_id: meeting.id,
            role: "moderator",
            updatedAt: new Date(),
            user_id: user!.id
        }
    })

    await Promise.all(
        (invited_emails ?? []).map(async (guestEmail) => {
            const guest = await prisma.guest.upsert({
                where: { email: guestEmail },
                create: { email: guestEmail },
                update: {}
            });

            await prisma.guestMeeting.create({
                data: {
                    meeting_id: meeting.id,
                    role: 'guest',
                    updatedAt: new Date(),
                    user_id: guest.id
                }
            });
        })
    )

    return {
        message: "Invitation created successfully",
        meetCode: meetCode,
        status: 'ok',
    };
}

export async function getMyMeetings() {
    return await makeRequest<GuestMeeting[] | null>('/api/meet/my-meetings', undefined, 'GET', {
        "Content-type": "application/json",
        "Accept": "application/json",
    });
}
