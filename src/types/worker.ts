/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */


export type MeetConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'error'

export type TMeetParticipant = {
    id: string
    name: string
    avatar: string
    email: string
    pinned: boolean
    audio: {
        muted: boolean
        volume: number
    }
    video: {
        muted: boolean
        volume: number
    }
}

export type TMeetParticipants = Array<TMeetParticipant>