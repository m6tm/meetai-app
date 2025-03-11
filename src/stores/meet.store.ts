/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { IParticipant } from "@ai/interfaces/core.worker.interface";
import Worker from "@ai/worker/worker";
import { EventEmitter } from "events";
import { create } from "zustand"


export type MeetStore = {
    meetPanel: MEET_PANEL_TYPE,
    autoriseMessage: boolean,
    mediaControl: MEDIA_CONTROL_TYPE,
    worker: Worker | null,
    event: EventEmitter,
    audioSources: Array<MediaDeviceInfo>,
    videoSources: Array<MediaDeviceInfo>,

    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => void,
    setAutoriseMessage: (autoriseMessage: boolean) => void,
    setMediaControl: (mediaControl: MEDIA_CONTROL_TYPE) => void,
    setWorker: (worker: Worker | null) => void,
    refreshSources: () => Promise<void>,
}
export const useMeetStore = create<MeetStore>((set) => ({
    meetPanel: MEET_PANEL_TYPE.NONE,
    autoriseMessage: false,
    mediaControl: MEDIA_CONTROL_TYPE.NONE,
    worker: null,
    event: new EventEmitter(),
    audioSources: [],
    videoSources: [],

    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => set({ meetPanel }),
    setAutoriseMessage: (autoriseMessage: boolean) => set({ autoriseMessage }),
    setMediaControl: (mediaControl: MEDIA_CONTROL_TYPE) => set({ mediaControl }),
    setWorker: (worker: Worker | null) => set({ worker }),
    refreshSources: async () => {
        const audioSources = await navigator.mediaDevices.enumerateDevices()
            .then((devices) => devices.filter((device) => device.kind === "audioinput"))
        const videoSources = await navigator.mediaDevices.enumerateDevices()
            .then((devices) => devices.filter((device) => device.kind === "videoinput"))

        set({ audioSources, videoSources })
    },
}))

export type MeetParticipantStore = {
    participants: Array<IParticipant>,

    setParticipants: (participants: Array<IParticipant>) => void,
    setParitipantMediaState: (participant_id: string, type: 'audio' | 'video' | 'both', audio?: boolean, video?: boolean) => void,
}

export const useMeetParticipantStore = create<MeetParticipantStore>((set) => ({
    participants: [],

    setParticipants: (participants: Array<IParticipant>) => set({ participants }),
    setParitipantMediaState: (participant_id: string, type: 'audio' | 'video' | 'both', audio?: boolean, video?: boolean) => {
        set((state) => {
            const participant = state.participants.find((participant) => participant.id === participant_id)
            if (!participant) return state

            switch (type) {
                case 'audio':
                    if (audio !== undefined) participant.audio.muted = audio
                    break
                case 'video':
                    if (video !== undefined) participant.video.muted = video
                    break
                case 'both':
                    if (audio !== undefined) participant.audio.muted = audio
                    if (video !== undefined) participant.video.muted = video
                    break
            }

            return { participants: state.participants.map(_participant => _participant.id === participant.id ? participant : _participant) }
        })
    },
}))