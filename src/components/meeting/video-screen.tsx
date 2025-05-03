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
import { cn, deserializeData, shortDisplayUserName } from '@ai/lib/utils';
import React, { useEffect } from 'react';
import { Button } from '@ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Avatar,
    AvatarFallback,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AvatarImage,
} from '@ui/avatar';
import '@styles/video-screen.css';
import 'swiper/css';
import { Hand, MicOff, MoreVertical, Pin, Monitor } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import {
    useLocalParticipant,
    useRemoteParticipants,
    useRoomInfo,
    VideoTrack,
    AudioTrack,
} from '@livekit/components-react';
import { RemoteParticipant, Track } from 'livekit-client';
import { TParticipantMetadata } from '@ai/types/data';
import { useParticipantAttributeMetadata } from '@ai/hooks/useParticipantAttribute';
import { removeParticipantPost } from '@ai/actions/meet.action';

export default function VideoScreen({ className }: { className?: string }) {
    const mainVideoScreenRef = React.useRef<HTMLDivElement>(null);
    const roomInfo = useRoomInfo();
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const [participantsPinned, setParticipantsPinned] = React.useState<Record<string, boolean>>({});
    const { metadata } = useParticipantAttributeMetadata(localParticipant);
    const [activeScreenShares, setActiveScreenShares] = React.useState<
        Array<{
            participant: RemoteParticipant | null;
            isLocal: boolean;
            sid: string;
        }>
    >([]);

    function fullScreen() {
        if (!mainVideoScreenRef.current) return;
        mainVideoScreenRef.current.requestFullscreen({
            navigationUI: 'auto',
        });
    }

    function getPinnedParticipant() {
        const pinnedParticipant = Object.keys(participantsPinned).find((key) => participantsPinned[key]);
        return remoteParticipants.find((user) => user.sid === pinnedParticipant);
    }

    function togglePin(participantSid: string) {
        setParticipantsPinned((prev) => {
            const isCurrentlyPinned = prev[participantSid];
            // Reset all pins and only set the selected one if it wasn't already pinned
            const newPinned: Record<string, boolean> = {};
            Object.keys(prev).forEach((sid) => {
                newPinned[sid] = false;
            });
            if (!isCurrentlyPinned) {
                newPinned[participantSid] = true;
            }
            return newPinned;
        });
    }

    function isPinned(participantSid: string) {
        return !!participantsPinned[participantSid];
    }

    function hasPinnedParticipants() {
        return Object.keys(participantsPinned).some((key) => participantsPinned[key]);
    }

    async function rejectRemoteParticipant(participant: RemoteParticipant) {
        if (!metadata) return;
        const role = metadata.role;
        const code = roomInfo.name;
        const participantIdentity = participant.identity;
        const formData = new FormData();
        formData.append('code', code);
        formData.append('role', role);
        formData.append('participant_identity', participantIdentity);
        await removeParticipantPost(formData);
    }

    // Check for screen shares among local and remote participants
    useEffect(() => {
        const newActiveScreenShares = [];

        // Check if local participant is sharing screen
        if (localParticipant && localParticipant.isScreenShareEnabled) {
            newActiveScreenShares.push({
                participant: null,
                isLocal: true,
                sid: `local-${localParticipant.sid}`,
            });
        }

        // Check all remote participants who are sharing screens
        remoteParticipants.forEach((user) => {
            if (user.isScreenShareEnabled) {
                newActiveScreenShares.push({
                    participant: user,
                    isLocal: false,
                    sid: user.sid,
                });
            }
        });

        // Update state with all active screen shares
        setActiveScreenShares(newActiveScreenShares);
    }, [localParticipant, remoteParticipants]);

    useEffect(() => {
        const pinnedParticipants: Record<string, boolean> = {};
        remoteParticipants.forEach((user) => {
            pinnedParticipants[user.sid] = false;
        });

        const hasChanges = Object.keys(pinnedParticipants).length !== Object.keys(participantsPinned).length;
        if (hasChanges) setParticipantsPinned(pinnedParticipants);
    }, [participantsPinned, remoteParticipants]);

    const pinnedParticipant = getPinnedParticipant();

    return (
        <div className="w-full h-full relative z-0">
            {
                <div className="main-screen">
                    <div
                        ref={mainVideoScreenRef}
                        className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full bg-slate-600"
                    >
                        <Avatar className="size-36 flex justify-center items-center uppercase bg-muted">
                            {metadata && <AvatarImage src={metadata.avatar} alt={`Logo de ${localParticipant.name}`} />}
                            <AvatarFallback className="uppercase">
                                {shortDisplayUserName(localParticipant.name ?? 'Anonyme')}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* <Button variant="ghost" className="more-btn size-10 rounded-full">
                                    <MoreVertical />
                                </Button> */}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="cursor-pointer">
                                            <Pin />
                                            Epingler à l&apos;écran
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    Pour moi uniquement
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    Pour tous les participants
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem className="cursor-pointer">
                                        Retirer de la réunion
                                        <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer" onClick={fullScreen}>
                                        Mettre en plein écran
                                        <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {!hasPinnedParticipants() && localParticipant && localParticipant.isCameraEnabled && (
                        <VideoTrack
                            trackRef={{
                                participant: localParticipant,
                                source: Track.Source.Camera,
                                publication: localParticipant.getTrackPublication(Track.Source.Camera)!,
                            }}
                            className="w-full h-full absolute object-cover"
                        />
                    )}
                    {hasPinnedParticipants() && pinnedParticipant && pinnedParticipant.isCameraEnabled && (
                        <VideoTrack
                            trackRef={{
                                participant: pinnedParticipant,
                                source: Track.Source.Camera,
                                publication: pinnedParticipant.getTrackPublication(Track.Source.Camera)!,
                            }}
                            className="w-full h-full absolute object-cover"
                        />
                    )}
                </div>
            }
            <div className="other-screen">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={4}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                    className="h-full"
                >
                    {/* Screen Share Displays */}
                    {activeScreenShares.map((screenShare) => (
                        <SwiperSlide
                            key={`screen-share-${screenShare.sid}`}
                            className="screen-child relative screen-share-slide bg-black"
                        >
                            <div className="absolute top-2 right-2 flex items-center space-x-2 text-white z-20">
                                <Monitor />
                                <span className="text-xs">
                                    {screenShare.isLocal
                                        ? 'Votre écran'
                                        : `Écran de ${screenShare.participant?.name ?? 'Anonyme'}`}
                                </span>
                            </div>

                            {screenShare.isLocal ? (
                                <VideoTrack
                                    trackRef={{
                                        participant: localParticipant,
                                        source: Track.Source.ScreenShare,
                                        publication: localParticipant.getTrackPublication(Track.Source.ScreenShare)!,
                                    }}
                                    className="w-full h-full z-10 object-cover absolute"
                                />
                            ) : (
                                <VideoTrack
                                    trackRef={{
                                        participant: screenShare.participant!,
                                        source: Track.Source.ScreenShare,
                                        publication: screenShare.participant!.getTrackPublication(
                                            Track.Source.ScreenShare,
                                        )!,
                                    }}
                                    className="w-full h-full z-10 object-cover absolute"
                                />
                            )}

                            {screenShare.isLocal ? null : (
                                <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="more-btn size-10 rounded-full hover:bg-slate-600/30 text-white"
                                            >
                                                <MoreVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => togglePin(screenShare.sid)}
                                                >
                                                    {isPinned(screenShare.sid)
                                                        ? "Retirer de l'écran"
                                                        : "Epingler à l'écran"}
                                                </DropdownMenuItem>
                                                {metadata &&
                                                    (metadata.role === 'moderator' || metadata.role === 'admin') &&
                                                    screenShare.participant && (
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                rejectRemoteParticipant(screenShare.participant!)
                                                            }
                                                        >
                                                            Retirer de la réunion
                                                            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                    )}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}

                    {/* Remote Participants */}
                    {remoteParticipants
                        .filter((user) => {
                            const metadata = deserializeData<TParticipantMetadata>(user.attributes.metadata);
                            if (metadata && metadata.joined === 'yes') return true;
                            return false;
                        })
                        .sort((a, b) => {
                            const metadataA = deserializeData<TParticipantMetadata>(a.attributes.metadata);
                            const metadataB = deserializeData<TParticipantMetadata>(b.attributes.metadata);
                            // Sort raised hands first
                            if (metadataA?.upHand === 'yes' && metadataB?.upHand !== 'yes') return -1;
                            if (metadataA?.upHand !== 'yes' && metadataB?.upHand === 'yes') return 1;
                            return 0;
                        })
                        .map((user) => {
                            const userMetadata = deserializeData<TParticipantMetadata>(user.attributes.metadata);
                            return (
                                <SwiperSlide key={user.sid} className="screen-child relative">
                                    <div className="absolute top-2 right-2 flex items-center space-x-2 text-white z-20">
                                        {isPinned(user.sid) && <Pin />}
                                        {!user.isMicrophoneEnabled && <MicOff />}
                                        {userMetadata && userMetadata.upHand === 'yes' && <Hand />}
                                        {user.isScreenShareEnabled && <Monitor />}
                                    </div>
                                    <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full">
                                        <Avatar className="size-24">
                                            {userMetadata && (
                                                <AvatarImage
                                                    src={userMetadata.avatar}
                                                    alt={`Logo de ${localParticipant.name}`}
                                                />
                                            )}
                                            <AvatarFallback className="uppercase">
                                                {shortDisplayUserName(user.name ?? 'Anonyme')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="more-btn size-10 rounded-full hover:bg-slate-600/30 text-white"
                                                >
                                                    <MoreVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => togglePin(user.sid)}
                                                    >
                                                        {isPinned(user.sid)
                                                            ? "Retirer de l'écran"
                                                            : "Epingler à l'écran"}
                                                    </DropdownMenuItem>
                                                    {metadata &&
                                                        (metadata.role === 'moderator' ||
                                                            metadata.role === 'admin') && (
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => rejectRemoteParticipant(user)}
                                                            >
                                                                Retirer de la réunion
                                                                <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                                            </DropdownMenuItem>
                                                        )}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    {user && user.isCameraEnabled && (
                                        <VideoTrack
                                            trackRef={{
                                                participant: user,
                                                source: Track.Source.Camera,
                                                publication: user.getTrackPublication(Track.Source.Camera)!,
                                            }}
                                            className={cn('w-full h-full z-10 object-cover absolute', className)}
                                        />
                                    )}
                                    {user && user.isMicrophoneEnabled && (
                                        <AudioTrack
                                            trackRef={{
                                                participant: user,
                                                source: Track.Source.Microphone,
                                                publication: user.getTrackPublication(Track.Source.Microphone)!,
                                            }}
                                            className="hidden"
                                        />
                                    )}
                                </SwiperSlide>
                            );
                        })}
                </Swiper>
            </div>
        </div>
    );
}
