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
import { cn } from "@ai/lib/utils";
import React from "react";
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
        isHost: false,
    },
    {
        id: 3,
        name: 'David Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        isHost: true,
    },
    {
        id: 4,
        name: 'Sarah Brown',
        avatar: 'https://i.pravatar.cc/150?img=4',
        isHost: false,
    },
    {
        id: 5,
        name: 'James Anderson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isHost: false,
    },
    {
        id: 6,
        name: 'Olivia Taylor',
        avatar: 'https://i.pravatar.cc/150?img=6',
        isHost: false,
    },
    {
        id: 7,
        name: 'William Davis',
        avatar: 'https://i.pravatar.cc/150?img=7',
        isHost: false,
    }
]

export default function VideoScreen({ className }: { className?: string; }) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const user = USERS.find(user => user.isHost);

    return (
        <div className="w-full h-full relative z-0">
            {
                user && (
                    <div className="main-screen">
                        <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full">
                            <Avatar className="size-36">
                                <AvatarImage src={user.avatar} alt={`Logo de ${user.name}`} />
                                <AvatarFallback className="uppercase">{ user.name.slice(0, 2) }</AvatarFallback>
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
                                        <DropdownMenuItem className="cursor-pointer">
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
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    className="h-full"
                >
                    {
                        USERS.filter((user) => !user.isHost).map((user) => (
                            <SwiperSlide key={user.id} className="screen-child">
                                <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full">
                                    <Avatar className="size-24">
                                        <AvatarImage src={user.avatar} alt={`Logo de ${user.name}`} />
                                        <AvatarFallback className="uppercase">{ user.name.slice(0, 2) }</AvatarFallback>
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