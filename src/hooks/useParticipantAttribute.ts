/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
"use client";

import { deserializeData, serializeData } from "@ai/lib/utils";
import { TParticipantMetadata } from "@ai/types/data";
import { useParticipantAttribute } from "@livekit/components-react";
import { LocalParticipant, Participant } from "livekit-client";
import { useCallback } from "react";

export const useParticipantAttributeMetadata = (participant: Participant): { metadata: TParticipantMetadata | undefined; setMetadata: (metadata: TParticipantMetadata) => void; } => {
    const userMetadata: string | undefined = useParticipantAttribute('metadata', { participant });

    const setMetadata = useCallback(async (metadata: TParticipantMetadata) => {
        if (!(participant instanceof LocalParticipant)) return
        try {
            await participant.setAttributes({ metadata: serializeData(metadata) })
        } catch (error) {
            console.error('Failed to update participant metadata:', error);
        }
    }, [participant]);

    const metadata = userMetadata ? deserializeData<TParticipantMetadata>(userMetadata) : undefined

    return { metadata, setMetadata };
}