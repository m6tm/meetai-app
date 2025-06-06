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
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@ui/button';
import {
    ChevronDown,
    ChevronUp,
    CircleStop,
    Hand,
    Info,
    Loader2,
    MessageSquare,
    Mic,
    MicOff,
    MonitorUp,
    PhoneOff,
    Play,
    Signal,
    SignalHigh,
    SignalLow,
    SignalMedium,
    SignalZero,
    Users,
    Video,
    VideoOff,
    MonitorOff,
} from 'lucide-react';
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from '@ai/enums/meet-panel';
import { cn, deserializeData } from '@ai/lib/utils';
import ControlPanelMediaAddon from './control-panel-media-addon';
import { useMeetPanelStore } from '@ai/stores/meet.stote';
import { format } from 'date-fns';
import {
    useChat,
    useConnectionQualityIndicator,
    useIsRecording,
    useLocalParticipant,
    useRemoteParticipants,
    useRoomContext,
    useRoomInfo,
} from '@livekit/components-react';
import { db } from '@ai/db';
import { useParticipantAttributeMetadata } from '@ai/hooks/useParticipantAttribute';
import { TParticipantMetadata } from '@ai/types/data';
import { ConnectionQuality, RoomEvent } from 'livekit-client';
import { useRouter } from '@ai/i18n/routing';
import { startRecoding, stopRecoding } from '@ai/actions/meet.action';

export default function ControlPanel() {
    const { setMeetPanel, meetPanel, mediaControl, setMediaControl } = useMeetPanelStore();
    const router = useRouter();
    const { chatMessages } = useChat();
    const room = useRoomContext();
    const currentDate = format(new Date(), 'dd/MM/yyyy');
    const hourRef = useRef<HTMLSpanElement | null>(null);
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const { metadata, setMetadata } = useParticipantAttributeMetadata(localParticipant);
    const { quality } = useConnectionQualityIndicator({ participant: localParticipant });
    const roomInfo = useRoomInfo();
    const [changingRecodingState, setChangingRecodingState] = useState(false);
    const [egressId, setEgressId] = useState<string | undefined>(undefined);
    const isRecording = useIsRecording(room);
    const [changingScreenShareState, setChangingScreenShareState] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            if (hourRef.current) {
                const now = new Date();
                hourRef.current.innerHTML = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            }
        };

        const intervalId = setInterval(updateTime, 1000);
        updateTime();

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (changingRecodingState && isRecording !== undefined) {
            setChangingRecodingState(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording]);

    room.on(RoomEvent.Disconnected, () => {
        quitMeet();
    });

    const quitMeet = () => router.push('/');

    const handleMediaControl = async (type: MEDIA_CONTROL_TYPE) => {
        if (type === MEDIA_CONTROL_TYPE.AUDIO) {
            const response = await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
            if (response) {
                const preferences = (await db.preferences.orderBy('id').first())!;
                preferences.audio = !response.isMuted;
                await db.preferences.put(preferences);
            }
        }
        if (type === MEDIA_CONTROL_TYPE.VIDEO) {
            const response = await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
            if (response) {
                const preferences = (await db.preferences.orderBy('id').first())!;
                preferences.video = !response.isMuted;
                await db.preferences.put(preferences);
            }
        }
    };

    const handleScreenShare = async () => {
        if (changingScreenShareState) return;

        setChangingScreenShareState(true);

        try {
            if (localParticipant.isScreenShareEnabled) {
                await localParticipant.setScreenShareEnabled(false);
            } else {
                await localParticipant.setScreenShareEnabled(true);
            }
        } catch (error) {
            console.error("Erreur lors du partage d'écran:", error);
        } finally {
            setChangingScreenShareState(false);
        }
    };

    const getNetworkQualityClass = () => {
        switch (quality) {
            case ConnectionQuality.Excellent:
                return {
                    name: 'excellent',
                    color: 'text-green-500',
                    icon: <Signal />,
                };
            case ConnectionQuality.Good:
                return {
                    name: 'good',
                    color: 'text-blue-500',
                    icon: <SignalHigh />,
                };
            case ConnectionQuality.Poor:
                return {
                    name: 'poor',
                    color: 'text-yellow-500',
                    icon: <SignalMedium />,
                };
            case ConnectionQuality.Lost:
                return {
                    name: 'lost',
                    color: 'text-red-500',
                    icon: <SignalLow />,
                };
            case ConnectionQuality.Unknown:
                return {
                    name: 'unknown',
                    color: 'text-gray-500',
                    icon: <SignalZero />,
                };
        }
    };

    const handUpDown = () => {
        if (!metadata) return;
        const newMetadata = {
            ...metadata,
            upHand: (metadata.upHand === 'yes' ? 'no' : 'yes') as TParticipantMetadata['upHand'],
        };

        setMetadata(newMetadata);
    };

    const handleRecordToggle = async () => {
        if (changingRecodingState) return;
        setChangingRecodingState(true);
        const is_recording = isRecording;
        const { name: roomName } = roomInfo;
        const form = new FormData();
        if (is_recording && egressId) {
            form.append('roomName', roomName);
            form.append('egressId', egressId);
            const response = await stopRecoding(form);
            if (response.code === 200) {
                setEgressId(undefined);
                console.log('stoper succès');
            }
            console.log('stoper le meet', response);
        }
        if (!is_recording) {
            form.append('roomName', roomName);
            form.append('egressId', 'roomName');
            const response = await startRecoding(form);
            if (response.code == 200 && response.data) {
                setEgressId(response.data.egressId);
                console.log('démarrage succès');
            }
            console.log('démarrer le meet', response);
        }

        if (is_recording !== isRecording) {
            setChangingRecodingState(false);
        }
    };

    return (
        <div className="control-bar z-10 relative">
            <ControlPanelMediaAddon />
            <div className="text-white flex items-center space-x-3">
                <span ref={hourRef}></span>
                <span>{currentDate}</span>
                <div className="flex items-center space-x-2">
                    <span>{getNetworkQualityClass().name}</span>
                    <span className={cn(getNetworkQualityClass().color)}>{getNetworkQualityClass().icon}</span>
                </div>
            </div>
            <div className="flex space-x-4 items-center">
                <div className="media-control">
                    <Button
                        className="bg-transparent hover:bg-transparent"
                        onClick={() =>
                            mediaControl !== MEDIA_CONTROL_TYPE.AUDIO
                                ? setMediaControl(MEDIA_CONTROL_TYPE.AUDIO)
                                : setMediaControl(MEDIA_CONTROL_TYPE.NONE)
                        }
                    >
                        {mediaControl === MEDIA_CONTROL_TYPE.AUDIO ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                    <Button
                        onClick={() => handleMediaControl(MEDIA_CONTROL_TYPE.AUDIO)}
                        className={cn({ muted: !localParticipant.isMicrophoneEnabled })}
                    >
                        {localParticipant.isMicrophoneEnabled ? <Mic /> : <MicOff />}
                    </Button>
                </div>
                <div className="media-control">
                    <Button
                        className="bg-transparent hover:bg-transparent"
                        onClick={() =>
                            mediaControl !== MEDIA_CONTROL_TYPE.VIDEO
                                ? setMediaControl(MEDIA_CONTROL_TYPE.VIDEO)
                                : setMediaControl(MEDIA_CONTROL_TYPE.NONE)
                        }
                    >
                        {mediaControl === MEDIA_CONTROL_TYPE.VIDEO ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                    <Button
                        onClick={() => handleMediaControl(MEDIA_CONTROL_TYPE.VIDEO)}
                        className={cn({ muted: !localParticipant.isCameraEnabled })}
                    >
                        {localParticipant.isCameraEnabled ? <Video /> : <VideoOff />}
                    </Button>
                </div>
                <Button
                    className={cn('other-control-primary', { '!bg-orange-600': localParticipant.isScreenShareEnabled })}
                    onClick={handleScreenShare}
                >
                    {localParticipant.isScreenShareEnabled ? <MonitorOff /> : <MonitorUp />}
                </Button>
                <Button
                    className={cn('other-control-primary', { '!bg-orange-600': metadata && metadata.upHand === 'yes' })}
                    onClick={handUpDown}
                >
                    <Hand />
                </Button>
                <Button
                    className={cn('other-control-primary flex items-center justify-center', {
                        '!bg-orange-600': isRecording,
                    })}
                    disabled={changingRecodingState}
                    onClick={handleRecordToggle}
                >
                    {isRecording && !changingRecodingState && <CircleStop />}
                    {!isRecording && !changingRecodingState && <Play />}
                    {changingRecodingState && <Loader2 className="h-4 w-4 animate-spin" />}
                </Button>
                <Button className="other-control-secondary" onClick={quitMeet}>
                    <PhoneOff />
                </Button>
            </div>
            <div className="flex space-x-4">
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.INFOS ? ' active' : ''}`)}
                    onClick={() =>
                        meetPanel === MEET_PANEL_TYPE.INFOS
                            ? setMeetPanel(MEET_PANEL_TYPE.NONE)
                            : setMeetPanel(MEET_PANEL_TYPE.INFOS)
                    }
                >
                    <Info />
                </Button>
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.USERS ? ' active' : ''}`)}
                    onClick={() =>
                        meetPanel === MEET_PANEL_TYPE.USERS
                            ? setMeetPanel(MEET_PANEL_TYPE.NONE)
                            : setMeetPanel(MEET_PANEL_TYPE.USERS)
                    }
                >
                    <div className="badge">
                        {
                            [localParticipant, ...remoteParticipants].filter((user) => {
                                const userMetadata = deserializeData<TParticipantMetadata>(user.attributes.metadata);
                                return userMetadata.joined === 'yes';
                            }).length
                        }
                    </div>
                    <Users />
                </Button>
                <Button
                    className={cn(`second-panel${meetPanel === MEET_PANEL_TYPE.MESSAGES ? ' active' : ''}`)}
                    onClick={() =>
                        meetPanel === MEET_PANEL_TYPE.MESSAGES
                            ? setMeetPanel(MEET_PANEL_TYPE.NONE)
                            : setMeetPanel(MEET_PANEL_TYPE.MESSAGES)
                    }
                >
                    {chatMessages.length > 0 && <div className="badge">{chatMessages.length}</div>}
                    <MessageSquare />
                </Button>
            </div>
        </div>
    );
}
