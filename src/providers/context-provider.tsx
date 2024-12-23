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
import AppContext from "@ai/context";
import { TAppContext } from "@ai/types/context";
import { MEET_PANEL_TYPE } from "@ai/enums/meet-panel";

export default function ContextProvider({ children }: { children: React.ReactNode; }) {
    const [meetPanel, setMeetPanel] = React.useState<MEET_PANEL_TYPE>(MEET_PANEL_TYPE.NONE);

    const context: TAppContext = {
        meetPanel,
        setMeetPanel,
    }
    
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}