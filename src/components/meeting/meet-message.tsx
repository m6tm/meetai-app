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
import { Button } from '@ui/button'
import { Label } from '@ui/label'
import { Textarea } from '@ui/textarea'
import { SendHorizonal, X } from "lucide-react";
import { TAppContext } from "@ai/types/context";
import AppContext from "@ai/context";
import { MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { Switch } from "@ui/switch"
import '@styles/messages.css'
import { cn } from "@ai/lib/utils";

export default function MeetMessage() {
    const {
        setMeetPanel,
        meetPanel,
        autoriseMessage,
        setAutoriseMessage,
    } = React.useContext<TAppContext>(AppContext);
    // const [message, setMessage] = React.useState<string>('')
    const [textareaHeight, setTextareaHeight] = React.useState<number>(30)

    let previousHeight = 30
    function onInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key !== 'Enter' && e.key !== 'Backspace') return
        const target = e.currentTarget
        const currentHeight = target.scrollHeight
        previousHeight = parseInt(target.style.height)
        
        target.style.height = '30px'
        if (currentHeight > previousHeight) {
            const newHeight = Math.max(30, currentHeight)
            setTextareaHeight(newHeight)
        }
    }
    
    return meetPanel === MEET_PANEL_TYPE.MESSAGES && (
        <div className="absolute bg-white w-[350px] flex flex-col rounded-lg space-y-4 bottom-24 right-4 p-5 full-height">
            <div className="flex items-center justify-between">
                <h3 className="text-xl">Messages dans la réunion</h3>
                <Button className="size-10 rounded-full" variant={'ghost'} onClick={() => setMeetPanel(MEET_PANEL_TYPE.NONE)}>
                    <X />
                </Button>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="autorise-message">
                    Autoriser tous les participants à envoyer des messages
                </Label>
                <Switch
                    id="autorise-message"
                    checked={autoriseMessage}
                    onCheckedChange={() => setAutoriseMessage(!autoriseMessage)} />
            </div>
            <div className="messages">
                <div className="message-section"></div>
                <div className={cn("input-section", `h-[${textareaHeight}px]`)}>
                    <Textarea
                        rows={1} 
                        className="resize-none" 
                        onKeyUp={onInput}
                        style={{ height: `${textareaHeight}px` }} 
                    />
                    <Button variant={'ghost'} className="size-10 rounded-full">
                        <SendHorizonal />
                    </Button>
                </div>
            </div>
        </div>
    )
}