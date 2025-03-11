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
import { useMeetStore } from "@ai/stores/meet.store";

export default function ControlPanelMediaAddon() {
    const { mediaControl, videoSources, audioSources } = useMeetStore()

    return mediaControl !== MEDIA_CONTROL_TYPE.NONE && <>
        {
            mediaControl === MEDIA_CONTROL_TYPE.VIDEO && (
                <div className="control-panel">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="control-panel-btn">Source video 2</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                            <DropdownMenuGroup>
                                {
                                    videoSources.map((source, index) => (
                                        <DropdownMenuItem key={index} className="cursor-pointer text-white">
                                            {
                                                source.deviceId === 'default' ? `Default (${source.groupId.slice(0, 5)})` : source.label
                                            }
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
                        <Button variant="outline" className="control-panel-btn">Source audio 1</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white/30 backdrop-blur-sm border-white/30">
                        <DropdownMenuGroup>
                            {
                                audioSources.map((source, index) => (
                                    <DropdownMenuItem key={index} className="cursor-pointer text-white">
                                        {
                                            source.deviceId === 'default' ? `Default (${source.groupId.slice(0, 5)})` : source.label
                                        }
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