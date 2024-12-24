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
import { SendHorizonal, X } from "lucide-react";
import { TAppContext } from "@ai/types/context";
import AppContext from "@ai/context";
import { MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { Switch } from "@ui/switch"
import '@styles/messages.css'
import { cn } from "@ai/lib/utils";
import TextareaAutosize from 'react-textarea-autosize';

const MESSAGES = [
    {
        id: 1,
        message: "Bonjour tout le monde!",
        date: new Date(),
        author: "Alice Martin",
        isAuthor: false,
    },
    {
        id: 2,
        message: "Salut Alice, comment vas-tu?",
        date: new Date(),
        author: "Thomas Dubois",
        isAuthor: true,
    },
    {
        id: 3,
        message: "Je me joins à la discussion",
        date: new Date(),
        author: "Marie Lambert",
        isAuthor: false,
    },
    {
        id: 4,
        message: "Bienvenue Marie!",
        date: new Date(),
        author: "Sophie Bernard",
        isAuthor: false,
    },
    {
        id: 5,
        message: "Bonjour à tous!",
        date: new Date(),
        author: "Alice Martin",
        isAuthor: false,
    },
    {
        id: 6,
        message: "Salut à tous!",
        date: new Date(),
        author: "Thomas Dubois",
        isAuthor: true,
    },
    {
        id: 7,
        message: "Je me joins à la discussion",
        date: new Date(),
        author: "Marie Lambert",
        isAuthor: false,
    },
    {
        id: 8,
        message: "Bienvenue Marie!",
        date: new Date(),
        author: "Sophie Bernard",
        isAuthor: false,
    },
    {
        id: 9,
        message: "Bonjour à tous!",
        date: new Date(),
        author: "Alice Martin",
        isAuthor: false,
    }
]

export default function MeetMessage() {
    const {
        setMeetPanel,
        meetPanel,
        autoriseMessage,
        setAutoriseMessage,
    } = React.useContext<TAppContext>(AppContext);
    // const [message, setMessage] = React.useState<string>('')
    
    return meetPanel === MEET_PANEL_TYPE.MESSAGES && (
        <div className="absolute z-10 bg-white w-[350px] flex flex-col rounded-lg space-y-4 bottom-24 right-4 p-5 full-height">
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
                <div className="message-section">
                    <ul>
                        {
                            MESSAGES.map((message) => (
                                <li key={message.id} className={cn("flex flex-col mb-4", message.isAuthor ? 'items-end' : 'items-start')}>
                                    <div className={cn("max-w-[80%] rounded-lg px-4 py-2", 
                                        message.isAuthor ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-300')}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{message.author}</span>
                                            <span className="text-xs opacity-70">{message.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="text-sm">{message.message}</div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={cn("input-section")}>
                    <TextareaAutosize className="w-full" placeholder="Votre message ..." />
                    <Button variant={'ghost'} className="size-10 rounded-full">
                        <SendHorizonal />
                    </Button>
                </div>
            </div>
        </div>
    )
}