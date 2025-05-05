/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { saveInstantMeeting } from '@ai/actions/meet.action';
import { useRouter } from '@ai/i18n/routing';
import { generateMeetCode } from '@ai/lib/utils';
import { useUserStore } from '@ai/stores/user.store';

export function useMeet() {
    const { user } = useUserStore();
    const router = useRouter();

    const createInstantMeeting = async (
        moderator_email?: string,
        invited_emails: string[] = [],
        private_mode: boolean = false,
    ) => {
        const meetCode = generateMeetCode({
            participants: invited_emails,
            mode: private_mode ? 'private' : 'public',
            moderator: moderator_email,
        });

        if (user) {
            const form = new FormData();
            form.append('code', meetCode);
            if (user && user.email) form.append('email', user.email);
            const response = await saveInstantMeeting(form);
            console.log(response);
        }

        router.push(`/meet/${meetCode}`);
    };

    return {
        createInstantMeeting,
    };
}
