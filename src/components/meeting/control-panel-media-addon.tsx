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
import { MEDIA_CONTROL_TYPE } from "@ai/enums/meet-panel";
import React from "react";
import { Button } from "@ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@ui/dropdown-menu"
import '@styles/control-panel.css'
import { useMeetPanelStore } from "@ai/app/stores/meet.stote";
import { useMediaDeviceSelect } from "@livekit/components-react";

export default function ControlPanelMediaAddon() {
    const { mediaControl } = useMeetPanelStore();
    const {
        activeDeviceId: activeVideoId,
        devices: videoDevices,
        setActiveMediaDevice: setActiveVideo,
    } = useMediaDeviceSelect({ kind: 'videoinput' });

    const {
        activeDeviceId: activeAudioId,
        devices: audioDevices,
        setActiveMediaDevice: setActiveAudio,
    } = useMediaDeviceSelect({ kind: 'audioinput' });

    return mediaControl !== MEDIA_CONTROL_TYPE.NONE && <>
        {
            mediaControl === MEDIA_CONTROL_TYPE.VIDEO && (
                <div className="control-panel">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="control-panel-btn">
                                {videoDevices.find(d => d.deviceId === activeVideoId)?.label || 'Select video source'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                            <DropdownMenuGroup>
                                {videoDevices.map((device) => (
                                    <DropdownMenuItem 
                                        key={device.deviceId}
                                        className="cursor-pointer text-white"
                                        onClick={() => setActiveVideo(device.deviceId)}
                                    >
                                        {device.label || `Video source ${device.deviceId}`}
                                    </DropdownMenuItem>
                                ))}
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
                            <Button variant="outline" className="control-panel-btn">
                                {audioDevices.find(d => d.deviceId === activeAudioId)?.label || 'Select audio source'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                            <DropdownMenuGroup>
                                {audioDevices.map((device) => (
                                    <DropdownMenuItem 
                                        key={device.deviceId}
                                        className="cursor-pointer text-white"
                                        onClick={() => setActiveAudio(device.deviceId)}
                                    >
                                        {device.label || `Audio source ${device.deviceId}`}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    </>
}