/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import AppContext from "@ai/context";
import { useContext, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Plan } from "@prisma/client";
import { getUser } from "@ai/actions/user.action";


export default function UserProfileAvatar() {
    const { user, logOut } = useContext(AppContext)
    const [plan, setPlan] = useState<Plan | null>(null)
    
    const handleLogout = async () => {
        try {
            await logOut()
            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function getPlan() {
            const { data } = await getUser(user?.email || '')
            if (data) setPlan(data.subscription.plan)
        }
        if (user) getPlan()
    }, [user])

    return user && (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-transparent border-none shadow-none">
                <Avatar className="cursor-pointer absolute top-3">
                {
                    user.photoURL ? 
                        <AvatarImage src={user.photoURL} alt="User avatar" /> :
                        <AvatarFallback className="uppercase">{user.displayName?.slice(0, 2)}</AvatarFallback>
                }
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    {
                        plan && (
                            <DropdownMenuItem className="cursor-pointer">
                                Your plan ({plan.name})
                            </DropdownMenuItem>
                        )
                    }
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}