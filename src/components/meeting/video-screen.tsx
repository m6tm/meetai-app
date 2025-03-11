/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
"use client";
import { cn, shortUserName } from "@ai/lib/utils";
import React, { useEffect } from "react";
import { Button } from '@ui/button'
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@ui/avatar"
import '@styles/video-screen.css'
import 'swiper/css';
import { MoreVertical, Pin } from "lucide-react";
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
} from "@ui/dropdown-menu"
import { IParticipant } from "@ai/interfaces/core.worker.interface";
import { useMeetParticipantStore } from "@ai/stores/meet.store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const USERS = [
    {
        id: 1,
        name: 'Michael Smith',
        avatar: 'https://i.pravatar.cc/150?img=1',
        isHost: false,
    },
    {
        id: 2,
        name: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        isHost: true,
    },
    {
        id: 3,
        name: 'David Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        isHost: false,
    },
]

export default function VideoScreen({ className }: { className?: string; }) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const { participants } = useMeetParticipantStore()
    const mainVideoScreenRef = React.useRef<HTMLDivElement>(null);
    const [activeUser, setActiveUser] = React.useState<IParticipant | undefined>(undefined);

    function fullScreen() {
        if (!mainVideoScreenRef.current) return
        mainVideoScreenRef.current.requestFullscreen({
            navigationUI: 'auto',
        });
    }

    useEffect(() => {
        participants.forEach((participant: IParticipant) => {
            if (participant.pinned) {
                setActiveUser(participant)
            }
        })
    }, [participants])

    return (
        <div className="w-full h-full relative z-0">
            {
                activeUser && (
                    <div className="main-screen">
                        <div ref={mainVideoScreenRef} className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full bg-slate-600">
                            <Avatar className="size-36">
                                <AvatarImage src={activeUser.avatar} alt={`Logo de ${activeUser.name}`} />
                                <AvatarFallback className="uppercase">{ shortUserName(activeUser.name) }</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="more-btn size-10 rounded-full">
                                    <MoreVertical />
                                </Button>
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
                                                    <DropdownMenuItem className="cursor-pointer">Pour moi uniquement</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">Pour tous les participants</DropdownMenuItem>
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
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={cn(className, 'w-full h-full z-0 object-cover bg-slate-600')}
                        />
                    </div>
                )
            }
            <div className="other-screen">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={4}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                    className="h-full"
                >
                    {
                        participants.filter((user) => !user.isHost).map((user) => (
                            <SwiperSlide key={user.id} className="screen-child">
                                <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full">
                                    <Avatar className="size-24">
                                        <AvatarImage src={user.avatar} alt={`Logo de ${user.name}`} />
                                        <AvatarFallback className="uppercase">{ shortUserName(user.name) }</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute top-0 left-0 z-20 flex items-center justify-center w-full h-full">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="more-btn size-10 rounded-full hover:bg-slate-600/30 text-white">
                                                <MoreVertical />
                                            </Button>
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
                                                            <DropdownMenuItem className="cursor-pointer">Pour moi uniquement</DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer">Pour tous les participants</DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    Retirer de la réunion
                                                    <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <video
                                    autoPlay
                                    playsInline
                                    className={cn(className, 'w-full h-full z-10 object-cover absolute')}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    );
}