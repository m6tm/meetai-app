/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { deleteSession } from "@ai/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
    await deleteSession('session')
    return NextResponse.json({
        error: null,
        data: null,
        code: 200
    });
}