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

import React, { useContext } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@ui/dropdown-menu"
  import { cn } from "@lib/utils"
import { Button, buttonVariants } from '@ui/button'
import { Input } from '@ui/input'
import { Link as ILink, Plus, Video } from 'lucide-react'
import ScheduleMeetingDialog from './meeting/schedule-meeting-dialog'
import { useRouter } from '@ai/i18n/routing'
import AppContext from '@ai/context'

export default function Meeting() {
    const router = useRouter()
    const [input, setInput] = React.useState("");
    const newSheduleRef = React.useRef<HTMLButtonElement>(null);
    const origin: string = process.env.NEXT_PUBLIC_URL_ORIGIN as never
    const {user} = useContext(AppContext)

    function changeLinkInput(e: React.ChangeEvent<HTMLInputElement>) {
        const link = e.target.value;
        setInput(link);
    }

    const opendialog = () => newSheduleRef.current?.click()

    function getLinkCode() {
        const regex = new RegExp(`^(${origin})`)
        if (!regex.test(input)) return input
        const code = input.replace(`${origin}/join/`, '').trim()
        return code
    }
    
    function handleJoin() {
        if (!user) return router.push('/auth')
        const code_link = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        router.push(`/meet/${code_link}`)
    }
    
    return (
        <div className="flex flex-col h-full w-full">
            <h2 className='font-extrabold text-[2.5em] mx-auto mt-10 text-center'>Appels video et <br /> visioconferences pour tous</h2>
            <h3 className='text-[1.4em] mx-auto mt-6 text-center'>Communiquez, ellaborez et célébrez les bons moments <br /> où que vous soyez avec MeetAI</h3>

            <div className="flex justify-center space-x-4 my-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary"><Video />Nouvelle réunion</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup className='space-y-1'>
                            <DropdownMenuItem className='cursor-pointer' onClick={opendialog}>
                                <ILink />
                                Créer une réunion pour une date ultérieure
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={handleJoin}>
                                <Plus />
                                Démarrer une réunion instantanée
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ScheduleMeetingDialog ref={newSheduleRef} />
                <Input type="url" value={input} onChange={changeLinkInput} placeholder="Saisir un code ou un lien" className="max-w-sm" />
                <Button
                    className={cn(`${buttonVariants({ variant: "secondary" })} ${input.length <= 0 && 'pointer-events-none select-none bg-secondary/50'}`)}
                    onClick={() => user ? router.push(`/meet/${getLinkCode()}`) : router.push('/auth')}>Participer</Button>
            </div>
        </div>
    )
}