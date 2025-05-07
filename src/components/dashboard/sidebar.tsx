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

import { Link } from '@ai/i18n/routing';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Home, Menu, Mic, Settings, Video, X, CreditCard } from 'lucide-react';

import { cn } from '@ai/lib/utils';
import { Button } from '@ai/components/ui/button';
import { useDashboardSidebar } from './sidebar-provider';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider as ShadcnSidebarProvider,
} from '@ai/components/ui/sidebar';

export function DashboardSidebar() {
    const pathname = usePathname();
    const { isOpen, toggle, isMobile } = useDashboardSidebar();

    const routes = [
        {
            title: 'Tableau de bord',
            href: '/dashboard',
            icon: Home,
        },
        {
            title: 'Liens de réunions',
            href: '/dashboard/meets',
            icon: Calendar,
        },
        {
            title: 'Enregistrements',
            href: '/dashboard/recordings',
            icon: Video,
        },
        {
            title: 'Transcriptions',
            href: '/dashboard/transcriptions',
            icon: FileText,
        },
        {
            title: 'Abonnement',
            href: '/dashboard/subscription',
            icon: CreditCard,
        },
        {
            title: 'Paramètres',
            href: '/dashboard/settings',
            icon: Settings,
        },
    ];

    if (isMobile) {
        return (
            <>
                <Button variant="outline" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggle}>
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Ouvrir le menu</span>
                </Button>
                {isOpen && (
                    <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={toggle} />
                )}
                <div
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transition-transform duration-300 ease-in-out md:hidden',
                        isOpen ? 'translate-x-0' : '-translate-x-full',
                    )}
                >
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                            <Mic className="h-6 w-6" />
                            <span>AI Meet</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={toggle}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Fermer le menu</span>
                        </Button>
                    </div>
                    <div className="py-4">
                        <nav className="space-y-1 px-2">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                                        pathname === route.href
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                    onClick={isMobile ? toggle : undefined}
                                >
                                    <route.icon className="h-4 w-4" />
                                    {route.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </>
        );
    }

    return (
        <ShadcnSidebarProvider className="!w-auto">
            <Sidebar className="flex-shrink-0">
                <SidebarHeader className="border-b p-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Mic className="h-6 w-6" />
                        <span>AI Meet</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {routes.map((route) => (
                            <SidebarMenuItem key={route.href}>
                                <SidebarMenuButton asChild isActive={pathname === route.href}>
                                    <Link href={route.href}>
                                        <route.icon />
                                        <span>{route.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                    <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} AI Meet</div>
                </SidebarFooter>
            </Sidebar>
        </ShadcnSidebarProvider>
    );
}
