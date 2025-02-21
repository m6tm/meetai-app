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
import React, { useContext } from "react";
import { Button } from "@ui/button"
import { ChevronDown, ChevronUp, Hand, Info, MessageSquare, Mic, MonitorUp, PhoneOff, Users, Video } from "lucide-react";
import { TAppContext } from "@ai/types/context";
import AppContext from "@ai/context";
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { cn } from "@ai/lib/utils";
import ControlPanelMediaAddon from "./control-panel-media-addon";
import { useRouter } from "@ai/i18n/routing";

export default function ControlPanel() {
    const { setMeetPanel, meetPanel, mediaControl, setMediaControl, worker, setWorker } = useContext<TAppContext>(AppContext)
    const router = useRouter()

    async function handleLeave() {
        console.log(worker.room)
        if (!worker) return
        await worker.disconnect()
        setWorker(null)
        router.push('/')
    }

    return (
        <div className="control-bar z-10 relative">
            <ControlPanelMediaAddon />
            <div className="text-white">
                <span>20:30</span>&nbsp;|&nbsp;
                <span>09/05/2023</span>
            </div>
            <div className="flex space-x-4">
                <div className="media-control">
                    <Button
                        className="bg-transparent hover:bg-transparent"
                        onClick={() => mediaControl !== MEDIA_CONTROL_TYPE.AUDIO ? setMediaControl(MEDIA_CONTROL_TYPE.AUDIO) : setMediaControl(MEDIA_CONTROL_TYPE.NONE)}>
                        {
                            mediaControl === MEDIA_CONTROL_TYPE.AUDIO ? (
                                <ChevronDown />
                            ) : (
                                <ChevronUp />
                            )
                        }
                    </Button>
                    <Button>
                        <Mic />
                    </Button>
                </div>
                <div className="media-control">
                    <Button
                        className="bg-transparent hover:bg-transparent"
                        onClick={() => mediaControl !== MEDIA_CONTROL_TYPE.VIDEO ? setMediaControl(MEDIA_CONTROL_TYPE.VIDEO) : setMediaControl(MEDIA_CONTROL_TYPE.NONE)}>
                        {
                            mediaControl === MEDIA_CONTROL_TYPE.VIDEO ? (
                                <ChevronDown />
                            ) : (
                                <ChevronUp />
                            )
                        }
                    </Button>
                    <Button>
                        <Video />
                    </Button>
                </div>
                <Button className="other-control-primary">
                    <MonitorUp />
                </Button>
                <Button className="other-control-primary">
                    <Hand />
                </Button>
                <Button className="other-control-secondary" onClick={handleLeave}>
                    <PhoneOff />
                </Button>
            </div>
            <div className="flex space-x-4">
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.INFOS ? ' active' : ''}`)}
                    onClick={() => setMeetPanel(MEET_PANEL_TYPE.INFOS)}>
                    <Info />
                </Button>
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.USERS ? ' active' : ''}`)}
                    onClick={() => setMeetPanel(MEET_PANEL_TYPE.USERS)}>
                    <div className="badge">1</div>
                    <Users />
                </Button>
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.MESSAGES ? ' active' : ''}`)}
                    onClick={() => setMeetPanel(MEET_PANEL_TYPE.MESSAGES)}>
                    <div className="badge">3</div>
                    <MessageSquare />
                </Button>
            </div>
        </div>
    )
}