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
import { MeetRole } from "@ai/enums/meet-panel";
import { RoomServiceClient } from "livekit-server-sdk";

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

const removeParticipantValidator = z.object({
    code: z.string(),
    role: z.enum([MeetRole.ADMIN, MeetRole.MODERATOR]),
    participant_identity: z.string(),
});

export async function removeParticipantPost(form: FormData) {
    const apiKey = process.env.LIVEKIT_KEY;
    const apiSecret = process.env.LIVEKIT_SECRET;
    const apiHost = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;

    const passed = removeParticipantValidator.safeParse({
        code: form.get('code'),
        role: form.get('role'),
        participant_identity: form.get('participant_identity'),
    });
    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null
        }
    }
    const { code, participant_identity } = passed.data;

    const svc = new RoomServiceClient(
        apiHost!,
        apiKey,
        apiSecret
    );

    try {
        await svc.removeParticipant(code, participant_identity);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            error: 'Failed to remove participant',
            data: null,
            code: 500
        };
    }

    return {
        error: null,
        data: null,
        code: 200
    }
}

export async function getMyMeetings() {
    return await makeRequest<GuestMeeting[] | null>('/api/meet/my-meetings', undefined, 'GET', {
        "Content-type": "application/json",
        "Accept": "application/json",
    });
}

const saveInstantMeetingValidator = z.object({
    code: z.string(),
});

export async function saveInstantMeeting(form: FormData) {
    const passed = saveInstantMeetingValidator.safeParse({
        code: form.get('code'),
    });
    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null
        }
    }
    const { code } = passed.data;

    const session = await getSession('session')
    if (!session) {
        return {
            error: 'User not authenticated',
            code: 401,
            data: null
        }
    }

    const prisma = getPrisma()

    const user = await prisma.user.findUnique({
        where: {
            email: session.userId
        }
    });

    const meeting = await prisma.meeting.create({
        data: {
            code: code,
            startDate: new Date(),
        }
    });

    const guestMeeting = await prisma.guestMeeting.create({
        data: {
            meeting_id: meeting.id,
            role: "moderator",
            updatedAt: new Date(),
            user_id: user!.id,
        }
    });

    return {
        error: null,
        data: guestMeeting,
        code: 200
    };
}
