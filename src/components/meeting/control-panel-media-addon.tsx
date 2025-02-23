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
import AppContext from "@ai/context/context";
import { MEDIA_CONTROL_TYPE } from "@ai/enums/meet-panel";
import React, { useEffect } from "react";
import { Button } from "@ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu"
import '@styles/control-panel.css'

const fakeAudioMediaDeviceInfo: MediaDeviceInfo = {
    deviceId: 'device-id',
    groupId: 'group-id',
    kind: 'audioinput',
    label: 'Not defined',
    toJSON: () => ({})
}

const fakeVideoMediaDeviceInfo: MediaDeviceInfo = {
    deviceId: 'device-id',
    groupId: 'group-id',
    kind: 'videoinput',
    label: 'Not defined',
    toJSON: () => ({})
}

export default function ControlPanelMediaAddon() {
    const { mediaControl, worker } = React.useContext(AppContext)
    const [videoSources, setVideoSources] = React.useState<MediaDeviceInfo[]>([])
    const [audioSources, setAudioSources] = React.useState<MediaDeviceInfo[]>([])
    const [videoSource, setVideoSource] = React.useState<MediaDeviceInfo>(fakeVideoMediaDeviceInfo)
    const [audioSource, setAudioSource] = React.useState<MediaDeviceInfo>(fakeAudioMediaDeviceInfo)

    useEffect(() => {
        async function init() {
            if (!worker) return
            const videos = await worker.getAvailableCameras()
            const audios = await worker.getAvailableAudioInput()
            const activeDevices = {
                audio: audios.find(device => device.deviceId === 'default') ?? fakeAudioMediaDeviceInfo,
                video: videos.find(device => device.deviceId === 'default') ?? fakeVideoMediaDeviceInfo,
            }

            setVideoSources(videos)
            setAudioSources(audios)
            setAudioSource(activeDevices.audio!)
            setVideoSource(activeDevices.video!)
        }
        init()
    }, [worker]);
    
    return mediaControl !== MEDIA_CONTROL_TYPE.NONE && <>
        {
            mediaControl === MEDIA_CONTROL_TYPE.VIDEO && (
                <div className="control-panel">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="control-panel-btn">{ videoSource.label }</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                            <DropdownMenuGroup>
                                {
                                    videoSources.map((video, key) => (
                                        <DropdownMenuItem key={key} className="cursor-pointer text-white">
                                            {video.label}
                                        </DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
        {
            mediaControl === MEDIA_CONTROL_TYPE.AUDIO && (
                <div className="control-panel">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="control-panel-btn">{ audioSource.label }</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                        <DropdownMenuGroup>
                            {
                                audioSources.map((audio, key) => (
                                    <DropdownMenuItem key={key} className="cursor-pointer text-white">
                                        {audio.label}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            )
        }
    </>
}