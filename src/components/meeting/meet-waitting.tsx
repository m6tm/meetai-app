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
import { useUserStore } from '@ai/app/stores/user.store';
import { useLocalParticipant, useRemoteParticipants, useRoomContext, VideoTrack } from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@ai/components/ui/button';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { db } from '@ai/db';
import { useRouter } from '@ai/i18n/routing';
import { TParticipantMetadata } from '@ai/types/data';
import { useParticipantAttributeMetadata } from '@ai/hooks/useParticipantAttribute';
import { deserializeData } from '@ai/lib/utils';

type WaitPageProps = {
    setReady: (ready: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function WaitPage({ setReady }: WaitPageProps) {
    const { user } = useUserStore();
    const router = useRouter();
    const { state } = useRoomContext();
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const isCameraOn = localParticipant.isCameraEnabled;
    const isMicOn = localParticipant.isMicrophoneEnabled;
    const [participantName, setParticipantName] = React.useState<string>('');
    const { metadata, setMetadata } = useParticipantAttributeMetadata(localParticipant);

    const initialize = useCallback(async () => {
        const preferences = await db.preferences.orderBy('id').first();
        let audio_enabled = true,
            video_enabled = true;

        if (preferences) {
            audio_enabled = preferences.audio;
            video_enabled = preferences.video;
        } else {
            await db.preferences.add({
                audio: true,
                video: true,
            });
        }

        try {
            await localParticipant.setCameraEnabled(video_enabled);
            await localParticipant.setMicrophoneEnabled(audio_enabled);
        } catch (error) {
            console.error('Failed to initialize media:', error);
            // Set to false if permissions fail
            await localParticipant.setCameraEnabled(false);
            await localParticipant.setMicrophoneEnabled(false);
        }
    }, [localParticipant]);

    useEffect(() => {
        if (state === ConnectionState.Connected) initialize();
    }, [initialize, state]);

    const handleMicrophoneToggled = async () => {
        localParticipant.setMicrophoneEnabled(!isMicOn);
        const preferences = await db.preferences.orderBy('id').first();
        await db.preferences.update(preferences!.id, { audio: !isMicOn });
    };

    const handleCameraToggled = async () => {
        localParticipant.setCameraEnabled(!isCameraOn);
        const preferences = await db.preferences.orderBy('id').first();
        await db.preferences.update(preferences!.id, { video: !isCameraOn });
    };

    const handleCancelCall = () => router.push('/');

    const handleParitipantNameChange = (name: string) => {
        setParticipantName(name);
    };

    const handleJoinMeeting = () => {
        if (((!user || !user.displayName) && participantName.length === 0) || !metadata) return;
        const _metadata: TParticipantMetadata = {
            ...metadata,
            joined: 'yes',
        };
        setMetadata(_metadata);
        if (participantName.length > 0) localParticipant.setName(participantName);
        setReady(true);
    };

    return (
        <div className="flex z-20 flex-col lg:flex-row items-center fixed top-0 left-0 justify-center h-full w-full p-4 bg-white">
            {/* Left Panel - Camera/Mic Settings */}
            <div className="w-full lg:w-1/2 p-6 mb-4 lg:mb-0 lg:mr-4">
                <div className="bg-white p-6">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                        {isCameraOn && (
                            <VideoTrack
                                trackRef={{
                                    participant: localParticipant,
                                    source: Track.Source.Camera,
                                    publication: localParticipant.getTrackPublication(Track.Source.Camera)!,
                                }}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="flex space-x-4 w-full absolute justify-center bottom-4">
                            <Button
                                onClick={handleCameraToggled}
                                className={`size-10 rounded-full flex items-center justify-center ${
                                    isCameraOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                                } text-white transition-colors`}
                            >
                                {isCameraOn ? <Video /> : <VideoOff />}
                            </Button>
                            <Button
                                onClick={handleMicrophoneToggled}
                                className={`size-10 rounded-full flex items-center justify-center ${
                                    isMicOn ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                                } text-white transition-colors`}
                            >
                                {isMicOn ? <Mic /> : <MicOff />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Name & Participants */}
            <div className="w-full lg:w-1/2 max-w-md p-6">
                <div className="bg-white p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <input
                            type="text"
                            disabled={!!user}
                            defaultValue={user?.displayName ?? participantName}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={(e) => handleParitipantNameChange(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Participants</h3>
                        <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2">
                            {remoteParticipants
                                .filter((participant) => {
                                    const userMetadata = deserializeData<TParticipantMetadata>(
                                        participant.attributes.metadata,
                                    );
                                    return userMetadata.joined === 'yes';
                                })
                                .map((participant) => (
                                    <div key={participant.sid} className="py-2 px-3 bg-white rounded mb-2">
                                        {participant.name}
                                    </div>
                                ))}
                            {remoteParticipants.length === 0 && <span>Not participant</span>}
                        </div>
                    </div>

                    <Button
                        onClick={handleJoinMeeting}
                        disabled={!user && participantName.length === 0}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                        Join Meeting
                    </Button>
                    <Button
                        onClick={handleCancelCall}
                        className="w-full mt-4 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors"
                    >
                        Cancel Call
                    </Button>
                </div>
            </div>
        </div>
    );
}
