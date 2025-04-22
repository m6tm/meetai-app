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
import { UserPlus, X } from 'lucide-react';
import { MEET_PANEL_TYPE } from '@ai/enums/meet-panel';
import { Input } from '@ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui/accordion';
import ParticipantItem from './participant-item';
import { useMeetPanelStore } from '@ai/app/stores/meet.stote';
import { useLocalParticipant, useRemoteParticipants } from '@livekit/components-react';

export default function Participant() {
    const { setMeetPanel, meetPanel } = useMeetPanelStore();
    const { localParticipant } = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();
    const participants = [localParticipant, ...remoteParticipants];

    return (
        meetPanel === MEET_PANEL_TYPE.USERS && (
            <div className="absolute z-10 bg-white w-[350px] rounded-lg space-y-4 bottom-24 right-4 p-5 full-height">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl">Participants</h3>
                    <Button
                        className="size-10 rounded-full"
                        variant={'ghost'}
                        onClick={() => setMeetPanel(MEET_PANEL_TYPE.NONE)}
                    >
                        <X />
                    </Button>
                </div>
                <Button variant={'secondary'}>
                    <UserPlus />
                    &nbsp; Ajouter des participants
                </Button>
                <Input type="email" className="w-full" placeholder="Rechercher une personne par son email" />
                <div className="">
                    <h4 className="uppercase text-sm font-bold">Dans la reunion</h4>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="decoration-none">
                                Participants
                                <span className="size-7 bg-secondary flex items-center justify-center rounded-full">
                                    {participants.length}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-4 flex flex-col">
                                    {participants.map((participant, i) => (
                                        <ParticipantItem key={i} {...{ participant, localParticipant }} />
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        )
    );
}
