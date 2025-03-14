/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel"
import { create } from "zustand"

export type MeetPanelStore = {
    meetPanel: MEET_PANEL_TYPE
    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => void
    autoriseMessage: boolean
    setAutoriseMessage: (autoriseMessage: boolean) => void
    mediaControl: MEDIA_CONTROL_TYPE
    setMediaControl: (mediaControl: MEDIA_CONTROL_TYPE) => void
}

export const useMeetPanelStore = create<MeetPanelStore>((set) => ({
    meetPanel: MEET_PANEL_TYPE.NONE,
    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => set({ meetPanel }),
    autoriseMessage: true,
    setAutoriseMessage: (autoriseMessage: boolean) => set({ autoriseMessage }),
    mediaControl: MEDIA_CONTROL_TYPE.NONE,
    setMediaControl: (mediaControl: MEDIA_CONTROL_TYPE) => set({ mediaControl }),
}))