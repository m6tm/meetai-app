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

import { SidebarProvider } from '@ai/components/dashboard/sidebar-provider';
import { DashboardSidebar } from '@ai/components/dashboard/sidebar';
import { DashboardHeader } from '@ai/components/dashboard/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <DashboardSidebar />
                <div className="flex flex-col flex-1 w-full">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6 bg-muted/40 w-full">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
