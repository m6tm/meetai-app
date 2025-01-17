/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { Plan, Subscription, User } from "@prisma/client"

type CustomSubscription = Subscription & {
    plan: Plan
}

type CustomUser = User & {
    subscription: CustomSubscription
}

export type UserResponse = {
    data: CustomUser | null
}