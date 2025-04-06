/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { makeRequest } from "@ai/lib/utils";
import { UserResponse } from "@ai/types/requests/user.request";

export function getUser(email: string) {
    const form = new FormData()
    form.append('email', email)
    return makeRequest<UserResponse>('/api/auth/user', form, 'GET')
}
