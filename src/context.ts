/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use client'

import { createContext } from "react";
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@enums/meet-panel";
// import Worker from "@ai/worker/worker";
import { TAppContext } from "./types/context";
import { EventEmitter } from "events";

const AppContext = createContext<TAppContext>({
    meetPanel: MEET_PANEL_TYPE.NONE,
    setMeetPanel: () => { },
    autoriseMessage: true,
    setAutoriseMessage: () => { },
    mediaControl: MEDIA_CONTROL_TYPE.NONE,
    setMediaControl: () => { },
    event: new EventEmitter(),
    user: null,
    googleSignIn: async () => { },
    githubSignIn: async () => { },
    logOut: async () => { },
})

export default AppContext
