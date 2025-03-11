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
import { db } from "@ai/db"
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel"
import { IParticipant } from "@ai/interfaces/core.worker.interface"
import { sleep } from "@ai/lib/utils"
import { useMeetParticipantStore, useMeetStore } from "@ai/stores/meet.store"
import { useUserStore } from "@ai/stores/user.store"
import Worker from "@ai/worker/worker"
import { RemoteParticipant, TrackPublication } from "livekit-client"
import { useCallback, useEffect, useState } from "react"

function BeginMeet({ code }: { code: string }) {
    const [started, setStarted] = useState<boolean>(false)
    const [workerSetted, setWorkerSetted] = useState<boolean>(false)
    const { event, worker, setWorker, setMeetPanel, setAutoriseMessage, setMediaControl } = useMeetStore()
    const { setParticipants, setParitipantMediaState, participants } = useMeetParticipantStore()
    const { user } = useUserStore()

    const handleWorkerEvent = useCallback(() => {
        event.on('met à jour la liste des participants', (participants: IParticipant[]) => {
            setParticipants(participants)
        })

        event.on('je suis connecté à la salle', async () => {
            const preferences = await db.preferences.orderBy('id').first()
            let audio_muted = false,
                video_muted = false;
    
            if (preferences) {
                audio_muted = preferences.audio
                video_muted = preferences.video
            } else {
                db.preferences.add({
                    audio: false,
                    video: false
                })
            }
            
            if (!worker) return

            const response = await worker.setMyLocalDevice(audio_muted, video_muted)
            if (!worker.room) return
            const localParticipant = worker.room.localParticipant;
            setParitipantMediaState(
                localParticipant.sid,
                'both',
                response.audioToggled ? audio_muted : undefined,
                response.videoToggled ? video_muted : undefined
            )
        })
        
        event.on('un participant a activé une piste audio/video', (participant: RemoteParticipant, track: TrackPublication) => {
            const _participant = participants.find((_participant) => _participant.id === participant.sid)
            if (!_participant) return
            const trackType: 'audio' | 'video' = track.kind === 'audio' ? 'audio' : 'video'
            if (trackType === 'audio') setParitipantMediaState(_participant.id, trackType, true, undefined)
            if (trackType === 'video') setParitipantMediaState(_participant.id, trackType, undefined, true)
        })
        
        event.on('un participant a désactivé une piste audio/video', (participant: RemoteParticipant, track: TrackPublication) => {
            const _participant = participants.find((_participant) => _participant.id === participant.sid)
            if (!_participant) return
            const trackType: 'audio' | 'video' = track.kind === 'audio' ? 'audio' : 'video'
            if (trackType === 'audio') setParitipantMediaState(_participant.id, trackType, false, undefined)
            if (trackType === 'video') setParitipantMediaState(_participant.id, trackType, undefined, false)
        })

        event.on('déconnexion en cours', () => {
            setWorker(null)
            setParticipants([])
            setMeetPanel(MEET_PANEL_TYPE.NONE)
            setAutoriseMessage(false)
            setMediaControl(MEDIA_CONTROL_TYPE.NONE)
            setStarted(false)
            console.log('quitte !!!');
        })
    }, [event, participants, setAutoriseMessage, setMediaControl, setMeetPanel, setParitipantMediaState, setParticipants, setWorker, worker]);

    useEffect(() => {
        async function init() {
            setWorkerSetted(true)
            await sleep(1000 * 3); // Attendre que l'objet "user" soit initialisé si l'utilisateur est connecté
            if (!started && worker) {
                worker.init()
                setStarted(true)
                handleWorkerEvent()
            }
            if (!workerSetted && (!started && !worker)) {
                setWorker(new Worker(event, code, user))
            }
        }
        init()
    }, [code, event, handleWorkerEvent, setWorker, started, user, worker, workerSetted])

    return (
        <div className=""></div>
    )
}

export default BeginMeet