/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
"use client"
import ControlPanel from "@ai/components/meeting/control-panel";
import MeetDataFirst from "@ai/components/meeting/meet-data-first";
import MeetDataInfo from "@ai/components/meeting/meet-data-info";
import Participant from "@ai/components/meeting/participant";
import MeetMessage from "@ai/components/meeting/meet-message";
import VideoScreen from "@ai/components/meeting/video-screen";
import { LiveKitRoom } from '@livekit/components-react';
import { useRoomToken } from "@ai/hooks/useRoomAuth";
import { useUserStore } from "@ai/app/stores/user.store";
import { useEffect, useState } from "react";
import { randomUserName, sleep } from "@ai/lib/utils";
import WaitPage from "./meet-waitting";

const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL;

function BeginMeet({ code }: { code: string }) {
    const { token, fetchToken } = useRoomToken();
    const { user, responded } = useUserStore()
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        async function init() {
            await sleep(1000 * 3)
            if (user && user.displayName) fetchToken(code, user.displayName)
            if (!user || !user.displayName) fetchToken(code, randomUserName())
        }
        if (responded) init()
    }, [code, fetchToken, responded, user]);

    if (!token) {
        return <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-neutral-300 border-t-blue-500 animate-spin"></div>
            </div>
        </div>
    }

    return (
        <LiveKitRoom 
            serverUrl={serverUrl} 
            token={token} 
            connect={true}
        >
            <div className="flex flex-col h-screen w-full bg-neutral-800 relative select-none">
                {
                    !ready && (
                        <WaitPage setReady={setReady} />
                    )
                }
                <VideoScreen />
                <ControlPanel />
                <MeetDataFirst {...{ code }} />
                <MeetDataInfo {...{ code }} />
                <Participant />
                <MeetMessage />
            </div>
        </LiveKitRoom>
    )
}

export default BeginMeet