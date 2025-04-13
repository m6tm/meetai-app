/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { cache } from "react";
import { Resend } from 'resend'

export const getMail = cache(() => {
    const resent = new Resend(process.env.RESEND_API_KEY);
    return resent;
})
