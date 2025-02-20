/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { IParticipant } from "@ai/interfaces/core.worker.interface";


export function selectRandomUserToPin(participants: IParticipant[]): IParticipant | undefined {
    if (participants.length === 0) return undefined
    return participants[Math.floor(Math.random() * participants.length)]
}

export const generateRandomUserName = (): string => 'user-' + Math.random().toString(36).substring(7)