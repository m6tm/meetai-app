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
import { useContext } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";


export default function UserProfileAvatar() {
    const { user, logOut } = useContext(AppContext)
    
    const handleLogout = async () => {
        try {
            await logOut()
            
        } catch (error) {
            console.error(error);
        }
    }

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
                    <DropdownMenuItem className="cursor-pointer">
                        Your plan (free)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}