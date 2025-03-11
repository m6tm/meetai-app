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
import React from "react";
import { Button } from "@ui/button"
import { ChevronDown, ChevronUp, Hand, Info, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, Users, Video, VideoOff } from "lucide-react";
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { cn } from "@ai/lib/utils";
import ControlPanelMediaAddon from "./control-panel-media-addon";
import { useMeetParticipantStore, useMeetStore } from "@ai/stores/meet.store";
import { db } from "@ai/db";
import { useRouter } from "@ai/i18n/routing";

export default function ControlPanel() {
    const { setMeetPanel, meetPanel, mediaControl, setMediaControl, refreshSources, worker } = useMeetStore()
    const { participants, setParitipantMediaState } = useMeetParticipantStore()
    const localParticipant = participants.find((participant) => participant.isSelf)!
    const router = useRouter()

    const handleAudioToggleButton = () => {
        if (mediaControl !== MEDIA_CONTROL_TYPE.AUDIO) {
            setMediaControl(MEDIA_CONTROL_TYPE.AUDIO)
        } else {
            setMediaControl(MEDIA_CONTROL_TYPE.NONE)
        }
        refreshSources()
    }

    const handleVideoToggleButton = () => {
        if (mediaControl !== MEDIA_CONTROL_TYPE.VIDEO) {
            setMediaControl(MEDIA_CONTROL_TYPE.VIDEO)
        } else {
            setMediaControl(MEDIA_CONTROL_TYPE.NONE)
        }
        refreshSources()
    }

    const handleAudioMuteButton = async () => {
        const participant = participants.find((participant) => participant.isSelf)
        if (!participant || !worker) return
        const audioToggled = await worker.setMyAudioLocalDevice(!participant.audio.muted)
        const preferences = await db.preferences.orderBy('id').first()
        if (audioToggled && preferences) {
            preferences.audio = !participant.audio.muted
            db.preferences.update(preferences.id, preferences)
        }
        setParitipantMediaState(participant.id, 'audio', audioToggled ? !participant.audio.muted : undefined, undefined)
    }

    const handleVideoMuteButton = async () => {
        const participant = participants.find((participant) => participant.isSelf)
        if (!participant || !worker) return
        const videoToggled = await worker.setMyVideoLocalDevice(!participant.video.muted)
        const preferences = await db.preferences.orderBy('id').first()
        if (videoToggled && preferences) {
            preferences.video = !participant.video.muted
            await db.preferences.update(preferences.id, preferences)
            setParitipantMediaState(participant.id, 'video', undefined, !participant.video.muted)
        }
    }

    const handleLogoutButton = async () => {
        if (worker) await worker.disconnect();
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
                        onClick={handleAudioToggleButton}>
                        {
                            mediaControl === MEDIA_CONTROL_TYPE.AUDIO ? (
                                <ChevronDown />
                            ) : (
                                <ChevronUp />
                            )
                        }
                    </Button>
                    <Button onClick={handleAudioMuteButton} className={cn((localParticipant && !localParticipant.audio.muted) && 'muted')}>
                        {
                            (localParticipant && !localParticipant.audio.muted) ? (
                                <MicOff />
                            ) : (
                                <Mic />
                            )
                        }
                    </Button>
                </div>
                <div className="media-control">
                    <Button
                        className="bg-transparent hover:bg-transparent"
                        onClick={handleVideoToggleButton}>
                        {
                            mediaControl === MEDIA_CONTROL_TYPE.VIDEO ? (
                                <ChevronDown />
                            ) : (
                                <ChevronUp />
                            )
                        }
                    </Button>
                    <Button onClick={handleVideoMuteButton} className={cn((localParticipant && !localParticipant.video.muted) && 'muted')}>
                        {
                            (localParticipant && !localParticipant.video.muted) ? (
                                <VideoOff />
                            ) : (
                                <Video />
                            )
                        }
                    </Button>
                </div>
                <Button className="other-control-primary">
                    <MonitorUp />
                </Button>
                <Button className="other-control-primary">
                    <Hand />
                </Button>
                <Button className="other-control-secondary" onClick={handleLogoutButton}>
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