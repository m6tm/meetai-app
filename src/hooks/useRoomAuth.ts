/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
import { generateToken } from '@ai/actions/meet.action';
import { useCallback, useState } from 'react';

export const useRoomToken = () => {
    const [token, setToken] = useState<string | null>(null);

    const fetchToken = useCallback(async (room_name: string, participant_name: string) => {
        const formData = new FormData();
        formData.append('room_name', room_name);
        formData.append('participant_name', participant_name);
        const response = await generateToken(formData);
        if (response.data) setToken(response.data.token);
    }, []);

    return { token, fetchToken };
};
