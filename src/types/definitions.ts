/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import type { JWTPayload } from "jose";

export type SessionPayload = JWTPayload

export type LanguageType = 'en' | 'fr'

export type defaultStateAction = {
    message?: string
}

export type LinkMetadata<T> = {
    participants: string[]
    mode: 'public' | 'private'
} & T
