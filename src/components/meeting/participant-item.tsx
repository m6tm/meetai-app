/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import { Button } from '@ui/button';
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
import { EllipsisVertical, Pin } from 'lucide-react';
import { LocalParticipant, RemoteParticipant } from 'livekit-client';
import { useParticipantAttributeMetadata } from '@ai/hooks/useParticipantAttribute';
import { shortDisplayUserName } from '@ai/lib/utils';
import { removeParticipantPost } from '@ai/actions/meet.action';
import { useRoomInfo } from '@livekit/components-react';

type ParticipantItemProps = {
    participant: LocalParticipant | RemoteParticipant;
    localParticipant: LocalParticipant;
};

export default function ParticipantItem({ participant, localParticipant }: ParticipantItemProps) {
    const isLocalParticipant = participant.isLocal;
    const { metadata } = useParticipantAttributeMetadata(participant);
    const { metadata: localMetadata } = useParticipantAttributeMetadata(localParticipant);
    const room = useRoomInfo();
    const isAdmin = metadata?.role === 'admin' || metadata?.role === 'moderator';
    const isLocalAdmin = localMetadata?.role === 'admin' || localMetadata?.role === 'moderator';
    let adminRole = '';
    if (isAdmin && metadata?.role === 'admin') adminRole = 'Organisateur de la réunion';
    if (isAdmin && metadata?.role === 'moderator') adminRole = 'Modérateur de la réunion';

    async function rejectRemoteParticipant(participant: RemoteParticipant) {
        if (!metadata) return;
        const role = metadata.role;
        const code = room.name;
        const participantIdentity = participant.identity;
        const formData = new FormData();
        formData.append('code', code);
        formData.append('role', role);
        formData.append('participant_identity', participantIdentity);
        await removeParticipantPost(formData);
    }

    return (
        <li className="flex items-center justify-between">
            <div className="flex items-center justify-start space-x-2">
                <Avatar className="size-11">
                    {metadata && <AvatarImage src={metadata.avatar} alt={`Logo de ${participant.name}`} />}
                    <AvatarFallback>{shortDisplayUserName(participant.name ?? 'Anonyme')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="capitalize font-bold">
                        {participant.name} {isLocalParticipant && '(Vous)'}
                    </span>
                    {isAdmin ? <span>{adminRole}</span> : <span>Participant de la réunion</span>}
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
                                        <DropdownMenuItem className="cursor-pointer">
                                            Pour moi uniquement
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Pour tous les participants
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            {!isLocalParticipant && isLocalAdmin && !isAdmin && (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => rejectRemoteParticipant(participant as RemoteParticipant)}
                                >
                                    Retirer le la réunion
                                    <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
}
