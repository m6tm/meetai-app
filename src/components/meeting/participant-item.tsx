/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@ui/avatar"
import { Button } from '@ui/button'
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
import { EllipsisVertical, Pin } from "lucide-react";

export default function ParticipantItem({ id, name, avatar, isAdmin }: { id: number, name: string, avatar: string, isAdmin: boolean }) {
    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center justify-start space-x-2">
                <Avatar className="size-11">
                    <AvatarImage src={avatar} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="capitalize font-bold">{name} {id === 1 ? '(Vous)' : ''}</span>
                    {
                        isAdmin ? (
                            <span>Organisateur de la réunion</span>
                        ) : (
                            <span>Participant de la réunion</span>
                        )
                    }
                </div>
            </div>
            <div className="">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="size-10 rounded-full">
                            <EllipsisVertical />
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
                            {
                                id !== 1 && (
                                    <DropdownMenuItem className="cursor-pointer">
                                        Retirer le la réunion
                                        <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    )
}