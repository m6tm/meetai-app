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
import { UserPlus, X } from "lucide-react";
import CopyElement from "@ai/components/meeting/_ui/copy-btn";

export default function MeetDataFirst({ code }: { code: string }) {
    const [closed, setClosed] = React.useState<boolean>(false)
    return !closed ? (
        <div className="absolute bg-white size-[350px] rounded-lg space-y-4 bottom-24 left-4 p-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl">Votre réunion est prête</h3>
                <Button className="size-10 rounded-full" variant={'ghost'} onClick={() => setClosed(true)}>
                    <X />
                </Button>
            </div>
            <Button variant={'secondary'}>
                <UserPlus />&nbsp;
                Ajouter des participants
            </Button>
            <p>Ou partagez ce lien avec les personnes que vous shouhaitez inviter à la réunion</p>
            <CopyElement {...{ code }} />
            <span>Vous êtes connecté entant que <code>adresse@exemple.com</code></span>
        </div>
    ) : (
        <div className=""></div>
    )
}