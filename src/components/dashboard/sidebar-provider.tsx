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

import * as React from 'react';
import { usePathname } from 'next/navigation';

type DashboardSidebarContextType = {
    isOpen: boolean;
    toggle: () => void;
    isMobile: boolean;
};

export const DashboardSidebarContext = React.createContext<DashboardSidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);
    const pathname = usePathname();

    // Fermer le sidebar sur les appareils mobiles lors du changement de page
    React.useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [pathname, isMobile]);

    // Détecter les appareils mobiles
    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <DashboardSidebarContext.Provider value={{ isOpen, toggle, isMobile }}>
            {children}
        </DashboardSidebarContext.Provider>
    );
}

export function useDashboardSidebar() {
    const context = React.useContext(DashboardSidebarContext);
    if (!context) {
        throw new Error("useDashboardSidebar doit être utilisé à l'intérieur d'un SidebarProvider");
    }
    return context;
}
