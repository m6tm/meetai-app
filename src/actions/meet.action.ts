/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use server';

import { getPrisma } from '@ai/adapters/db';
import { getSession } from '@ai/lib/session';
import { generateMeetCode, makeRequest, serializeData } from '@ai/lib/utils';
import { defaultStateAction } from '@ai/types/definitions';
import { GuestMeeting } from '@prisma/client';
import { z } from 'zod';
import { MeetRole } from '@ai/enums/meet-panel';
import {
    AccessToken,
    EgressClient,
    EncodedFileOutput,
    EncodedFileType,
    EncodedOutputs,
    EncodingOptionsPreset,
    GCPUpload,
    RoomCompositeOptions,
    RoomServiceClient,
    SegmentedFileOutput,
    StreamOutput,
    TrackSource,
} from 'livekit-server-sdk';
import cred from '@ai/meetai-41ada.json';
import { DEFAULT_AVATAR } from '@ai/utils/constants';
import { TMeetRole, TParticipantMetadata } from '@ai/types/data';
import { faker } from '@faker-js/faker';

export type TCredentials = {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
};

export type CreateInvitationResponse = {
    message: string;
    meetCode?: string;
    status: 'ok' | 'error';
};

const createInvitationSchema = z.object({
    start_date: z.string().optional(),
    invited_emails: z.array(z.string().email()).optional(),
    subject: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createInvitation(state: defaultStateAction, form: FormData): Promise<CreateInvitationResponse> {
    if (form.get('state') === 'reset') {
        return {
            message: '',
            meetCode: undefined,
            status: 'error',
        };
    }

    const parsed = createInvitationSchema.safeParse(Object.fromEntries(form.entries()));

    if (!parsed.success) {
        console.error('Invalid form data', parsed.error);
        return {
            message: parsed.error.issues[0].message,
            meetCode: undefined,
            status: 'error',
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { start_date, invited_emails, subject } = parsed.data;

    const session = await getSession('session');
    let meetCode = generateMeetCode();
    if (!session)
        return {
            message: 'Invitation created successfully',
            meetCode: meetCode,
            status: 'ok',
        };

    meetCode = generateMeetCode({
        participants: invited_emails ?? [],
        mode: 'private',
        moderator: session.userId,
    });

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
        where: {
            email: session.userId,
        },
    });

    const meeting = await prisma.meeting.create({
        data: {
            code: meetCode,
            startDate: start_date ? new Date(start_date) : undefined,
            subject: subject,
        },
    });

    await prisma.guestMeeting.create({
        data: {
            meeting_id: meeting.id,
            role: 'moderator',
            updatedAt: new Date(),
            user_id: user!.id,
        },
    });

    await Promise.all(
        (invited_emails ?? []).map(async (guestEmail) => {
            const guest = await prisma.guest.upsert({
                where: { email: guestEmail },
                create: { email: guestEmail },
                update: {},
            });

            await prisma.guestMeeting.create({
                data: {
                    meeting_id: meeting.id,
                    role: 'guest',
                    updatedAt: new Date(),
                    user_id: guest.id,
                },
            });
        }),
    );

    return {
        message: 'Invitation created successfully',
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
            data: null,
        };
    }
    const { code, participant_identity } = passed.data;

    const svc = new RoomServiceClient(apiHost!, apiKey, apiSecret);

    try {
        await svc.removeParticipant(code, participant_identity);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return {
            error: 'Failed to remove participant',
            data: null,
            code: 500,
        };
    }

    return {
        error: null,
        data: null,
        code: 200,
    };
}

export async function getMyMeetings() {
    return await makeRequest<GuestMeeting[] | null>('/api/meet/my-meetings', undefined, 'GET', {
        'Content-type': 'application/json',
        Accept: 'application/json',
    });
}

const saveInstantMeetingValidator = z.object({
    code: z.string(),
    email: z.string().email({ message: 'Invalid email address' }).optional(),
});

export async function saveInstantMeeting(form: FormData) {
    const passed = saveInstantMeetingValidator.safeParse(Object.fromEntries(form.entries()));
    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null,
        };
    }
    const { code, email } = passed.data;

    const session = await getSession('session');
    if (!session) {
        return {
            error: 'User not authenticated',
            code: 401,
            data: null,
        };
    }

    const prisma = getPrisma();

    const user = await prisma.user.findUnique({
        where: {
            email: email ? email : session.userId,
        },
    });

    const meeting = await prisma.meeting.create({
        data: {
            code: code,
            startDate: new Date(),
        },
    });

    const guestMeeting = await prisma.guestMeeting.create({
        data: {
            meeting_id: meeting.id,
            role: 'moderator',
            updatedAt: new Date(),
            user_id: user!.id,
        },
    });

    return {
        error: null,
        data: guestMeeting,
        code: 200,
    };
}

const generateTokenValidator = z.object({
    room_name: z.string(),
    participant_name: z.string(),
});

export async function generateToken(form: FormData) {
    const validated = generateTokenValidator.safeParse(Object.fromEntries(form.entries()));
    if (!validated.success) {
        return {
            error: validated.error.issues[0].message,
            code: 400,
            data: null,
        };
    }

    const { room_name, participant_name } = validated.data;
    const session = await getSession('session');
    let role: TMeetRole = 'guest';
    let avatar = DEFAULT_AVATAR;

    if (session) {
        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
            where: {
                email: session.userId,
            },
        });

        if (user) {
            const meetRole = await prisma.guestMeeting.findFirst({
                where: {
                    OR: [
                        {
                            user: {
                                email: user.email,
                            },
                        },
                        {
                            guest: {
                                email: user.email,
                            },
                        },
                    ],
                },
                select: {
                    role: true,
                    user: {
                        select: {
                            avatar: true,
                        },
                    },
                },
            });

            if (meetRole) role = meetRole.role;
            avatar = user.avatar;
        }
    }

    const metadata = serializeData<TParticipantMetadata>({
        role,
        joined: 'no',
        pinned: 'no',
        upHand: 'no',
        canMessage: 'yes',
        avatar,
    });
    const apiKey = process.env.LIVEKIT_KEY;
    const apiSecret = process.env.LIVEKIT_SECRET;

    const token = new AccessToken(apiKey, apiSecret, {
        identity: faker.string.uuid(),
        name: participant_name as string,
        attributes: {
            metadata: metadata,
        },
    });

    token.addGrant({
        roomJoin: true,
        room: room_name as string,
        roomAdmin: role === 'admin' || role === 'moderator',
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
        canPublishSources: [
            TrackSource.CAMERA,
            TrackSource.MICROPHONE,
            TrackSource.SCREEN_SHARE,
            TrackSource.SCREEN_SHARE_AUDIO,
        ],
        canUpdateOwnMetadata: true,
    });

    const jwt = await token.toJwt();

    return {
        error: null,
        code: 200,
        data: { token: jwt },
    };
}

const startMeetRecorderValidator = z.object({
    roomName: z.string(),
});

export async function startRecoding(formData: FormData) {
    const passed = startMeetRecorderValidator.safeParse(Object.fromEntries(formData.entries()));
    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null,
        };
    }

    const { roomName } = passed.data;
    const apiKey = process.env.LIVEKIT_KEY;
    const apiSecret = process.env.LIVEKIT_SECRET;
    const apiHost = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;
    const credentials: TCredentials = cred;
    const egressClient = new EgressClient(apiHost!, apiKey, apiSecret);
    const outputs: EncodedOutputs | EncodedFileOutput | StreamOutput | SegmentedFileOutput = {
        file: new EncodedFileOutput({
            filepath: `recordings/${roomName}-${Date.now()}.mp4`,
            fileType: EncodedFileType.MP4,
            output: {
                case: 'gcp',
                value: new GCPUpload({
                    credentials: JSON.stringify(credentials),
                    bucket: 'meetai_bucket',
                }),
            },
        }),
    };
    const options: RoomCompositeOptions = {
        encodingOptions: EncodingOptionsPreset.H264_1080P_30,
        audioOnly: true,
    };

    try {
        const { egressId } = await egressClient.startRoomCompositeEgress(roomName, outputs, options);
        return {
            error: null,
            code: 200,
            data: { egressId },
        };
    } catch (error) {
        return {
            error: (error as Error).message,
            code: 500,
            data: null,
        };
    }
}

const stopMeetRecorderValidator = z.object({
    roomName: z.string(),
    egressId: z.string(),
});

export async function stopRecoding(formData: FormData) {
    const passed = stopMeetRecorderValidator.safeParse(Object.fromEntries(formData.entries()));
    if (!passed.success) {
        return {
            error: passed.error.issues[0].message,
            code: 400,
            data: null,
        };
    }

    const { roomName, egressId } = passed.data;
    const apiKey = process.env.LIVEKIT_KEY;
    const apiSecret = process.env.LIVEKIT_SECRET;
    const apiHost = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;
    const egressClient = new EgressClient(apiHost!, apiKey, apiSecret);

    try {
        const list = await egressClient.listEgress({ roomName, egressId });
        if (list && list.length > 0) {
            const _egressId = list[0].egressId;
            const egressInfo = await egressClient.stopEgress(_egressId);
            return {
                error: null,
                code: 200,
                data: {
                    egressId: egressInfo.egressId,
                    filePaths: egressInfo.fileResults.map((file) => ({
                        filename: file.filename,
                        filepath: file.location,
                    })),
                },
            };
        } else {
            return {
                error: 'Aucun enregistrement en cours trouvé pour cette salle.',
                code: 404,
                data: null,
            };
        }
    } catch (error) {
        return {
            error: (error as Error).message,
            code: 500,
            data: null,
        };
    }
}

export async function listeRecording() {
    try {
        const apiKey = process.env.LIVEKIT_KEY;
        const apiSecret = process.env.LIVEKIT_SECRET;
        const apiHost = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;
        const egressClient = new EgressClient(apiHost!, apiKey, apiSecret);

        const recordings = await egressClient.listEgress();

        // Convert complex objects to plain objects
        const plainRecordings = recordings.map((recording) => ({
            egressId: recording.egressId,
            roomId: recording.roomId,
            roomName: recording.roomName,
            status: recording.status,
            fileResults: recording.fileResults.map((file) => ({
                filename: file.filename,
                filepath: file.location,
            })),
        }));

        return {
            error: null,
            code: 200,
            data: plainRecordings,
        };
    } catch (error) {
        console.error('Failed to list recordings:', error);
        return {
            error: (error as Error).message,
            code: 500,
            data: null,
        };
    }
}
