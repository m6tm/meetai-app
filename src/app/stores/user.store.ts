/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { create } from "zustand"
import { User } from "firebase/auth"

export type UserStore = {
    user: User | null
    setUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user })
}))