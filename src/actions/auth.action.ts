/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { makeRequest } from "@ai/lib/utils"
import { faker } from "@faker-js/faker"

export async function signIn(email?: string | null, displayName?: string | null) {
    if (!email) return null
    const form = new FormData()
    form.append('email', email)
    form.append('name', displayName ?? faker.person.firstName())
    return makeRequest('/api/auth/signin', form, 'POST')
}
