/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from "react";
import '@styles/meet.css'
import BeginMeet from "@ai/components/meeting/begin-meet";

export default async function Meeting({ params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code
    
    return (
        <BeginMeet code={code} />
    )
}
