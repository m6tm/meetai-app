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
import ControlPanel from "@ai/components/meeting/control-panel";
import MeetDataFirst from "@ai/components/meeting/meet-data-first";
import MeetDataInfo from "@ai/components/meeting/meet-data-info";
import Participant from "@ai/components/meeting/participant";
import MeetMessage from "@ai/components/meeting/meet-message";
import VideoScreen from "@ai/components/meeting/video-screen";

export default async function Meeting({ params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code
    
    return (
        <div className="flex flex-col h-screen w-full bg-neutral-800 relative select-none">
            <VideoScreen />
            <ControlPanel />
            <MeetDataFirst {...{ code }} />
            <MeetDataInfo {...{ code }} />
            <Participant />
            <MeetMessage />
        </div>
    )
}
