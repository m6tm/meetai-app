/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use client';

import React from 'react';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { SendHorizonal, X } from 'lucide-react';
import { MEET_PANEL_TYPE } from '@ai/enums/meet-panel';
import { Switch } from '@ui/switch';
import '@styles/messages.css';
import { cn } from '@ai/lib/utils';
import TextareaAutosize from 'react-textarea-autosize';
import { useMeetPanelStore } from '@ai/app/stores/meet.stote';
import { useChat, useLocalParticipant } from '@livekit/components-react';
import { LocalParticipant, RemoteParticipant } from 'livekit-client';

export default function MeetMessage() {
    const { setMeetPanel, meetPanel, autoriseMessage, setAutoriseMessage } = useMeetPanelStore();
    const { chatMessages, send, isSending } = useChat();
    const { localParticipant } = useLocalParticipant();
    const [message, setMessage] = React.useState<string>('');

    const handleSubmit = () => {
        const msg = message;
        if (msg.trim().length === 0) return;
        send(msg);
        setMessage('');
    };

    return (
        meetPanel === MEET_PANEL_TYPE.MESSAGES && (
            <div className="absolute z-10 bg-white w-[350px] flex flex-col rounded-lg space-y-4 bottom-24 right-4 p-5 full-height">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl">Messages dans la réunion</h3>
                    <Button
                        className="size-10 rounded-full"
                        variant={'ghost'}
                        onClick={() => setMeetPanel(MEET_PANEL_TYPE.NONE)}
                    >
                        <X />
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="autorise-message">Autoriser tous les participants à envoyer des messages</Label>
                    <Switch
                        id="autorise-message"
                        checked={autoriseMessage}
                        onCheckedChange={() => setAutoriseMessage(!autoriseMessage)}
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <div className="flex-grow message-section">
                        <ul>
                            {chatMessages.map((message) => (
                                <MessageItem
                                    key={message.timestamp}
                                    message={message.message}
                                    from={message.from}
                                    localParticipant={localParticipant}
                                    timestamp={message.timestamp}
                                />
                            ))}
                        </ul>
                    </div>
                    <div className="input-section mt-1">
                        <TextareaAutosize
                            className="w-full"
                            placeholder="Votre message ..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            variant={'ghost'}
                            disabled={isSending}
                            className="size-10 rounded-full"
                            onClick={handleSubmit}
                        >
                            <SendHorizonal />
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
}

type MessageItemProps = {
    message: string;
    from: RemoteParticipant | LocalParticipant;
    attachedFiles?: File;
    localParticipant: LocalParticipant;
    timestamp: number;
};

function MessageItem({ message, from, timestamp }: MessageItemProps) {
    const isAuthor = from.isLocal;
    const date = new Date(timestamp);
    return (
        <li key={timestamp} className={cn('flex flex-col mb-4', isAuthor ? 'items-end' : 'items-start')}>
            <div
                className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2',
                    isAuthor
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                        : 'bg-gradient-to-br from-gray-100 to-gray-300',
                )}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{from.name || from.identity}</span>
                    <span className="text-xs opacity-70">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div className="text-sm">{message}</div>
            </div>
        </li>
    );
}
