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

import type React from 'react';

import { Link } from '@ai/i18n/routing';
import { Bell, Plus, Search, User } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@ai/components/ui/dropdown-menu';
import { Input } from '@ai/components/ui/input';
import { useDashboardSidebar } from './sidebar-provider';
import { useContext } from 'react';
import AppContext from '@ai/context';

export function DashboardHeader() {
    const { toggle } = useDashboardSidebar();
    const { logOut } = useContext(AppContext);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 w-full">
            <Button variant="outline" size="icon" className="md:hidden" onClick={toggle}>
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex-1 md:flex-initial">
                <form className="hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Rechercher..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline-flex">Nouvelle réunion</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                3
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Nouvelle transcription disponible</DropdownMenuItem>
                        <DropdownMenuItem>Enregistrement terminé</DropdownMenuItem>
                        <DropdownMenuItem>Réunion planifiée dans 15 minutes</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <User className="h-4 w-4" />
                            <span className="sr-only">Profil</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">Paramètres</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/subscription">Abonnement</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logOut}>Déconnexion</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}
