/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import LanguageSwitcher from "@ai/components/LanguageSwitcher";
import { Button } from "@ai/components/ui/button";
import { ThemeToggle } from "@ai/components/theme-toggle";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ai/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ai/components/ui/avatar";
import { useContext, useEffect, useState } from "react";
import { signIn } from "@ai/actions/auth.action";
import { useRouter } from "@ai/i18n/routing";
import AppContext from "@ai/context";
import { useUserStore } from "@ai/app/stores/user.store";

export default function Header() {
    const { user, responded } = useUserStore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [meetingCode, setMeetingCode] = useState<string>("");
    const { googleSignIn, logOut } = useContext(AppContext)
    const router = useRouter()
    
        const handleGoogleSignIn = async () => {
            try {
                await googleSignIn()
            } catch (error) {
                console.error(error);
            }
        }
        
        const handleLogout = async () => {
            try {
                await logOut()
                
            } catch (error) {
                console.error(error);
            }
        }
    
        useEffect(() => {
            // Generate a unique meeting code when the component mounts
            setMeetingCode("anycode");
            async function checkUser() {
                await signIn(user?.email, user?.displayName)
                router.push('/')
            }
            if (user) checkUser()
        }, [router, setMeetingCode, user]);

    return (
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 md:p-8">
            {/* Header Section */}
            <h1 className="text-[2rem] font-bold font-fleur-sans">
                <span>Meet AI</span>
            </h1>
            <nav className="flex items-center space-x-4">
                <Button variant="ghost">Pricing</Button>
                <LanguageSwitcher />
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent outline-none focus:outline-none">
                            {user && responded ? (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.photoURL || "https://picsum.photos/id/11/100/100"} alt={user.displayName || "User Avatar"} />
                                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || 'CN'}</AvatarFallback>
                                </Avatar>
                            ) : (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://picsum.photos/id/11/100/100" alt="User Avatar" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {user ? (
                            <>
                                <DropdownMenuItem disabled>
                                    {user.displayName}
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    Pricing Tier: Free
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                    Log out
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuItem className="cursor-pointer" onClick={handleGoogleSignIn}>
                                Sign In
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </div>
    )
}
