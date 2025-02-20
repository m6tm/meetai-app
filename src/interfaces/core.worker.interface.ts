/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { type Socket } from 'socket.io-client'
import { type EventEmitter } from 'events'

export interface IParticipantAudio {
    muted: boolean
    volume: number
}

export interface IParticipantVideo {
    muted: boolean
    volume: number
}

export interface IParticipant {
    id: string
    name: string | undefined
    avatar: string | undefined
    email: string
    pinned: boolean
    isSelf: boolean;
    isHost: boolean;
    audio: IParticipantAudio
    video: IParticipantVideo
}

export interface IAudioSources {
    microphone: Array<MediaStreamTrack> | undefined
    speaker: Array<MediaStreamTrack> | undefined
}

export interface IAudioCurrentSource {
    microphone: MediaStreamTrack | undefined
    speaker: MediaStreamTrack | undefined
}

export interface IAudioMuted {
    microphone: boolean
    speaker: boolean
}

export interface IAudioVolume {
    microphone: number
    speaker: number
}

export interface IAudio {
    sources: IAudioSources
    currentSource: IAudioCurrentSource
    muted: IAudioMuted
    volume: IAudioVolume
}

export interface IVideoSources {
    camera: Array<MediaStreamTrack> | undefined
}

export interface IVideoCurrentSource {
    camera: MediaStreamTrack | undefined
}

export interface IVideo {
    sources: IVideoSources
    currentSource: IVideoCurrentSource
    muted: boolean
    volume: number
}

export interface ICoreWorker {
    socket: Socket | undefined
    audio: IAudio
    video: IVideo
    _participants: Array<IParticipant>
    event: EventEmitter
    connect: () => Promise<Socket | Socket.DisconnectReason | Error>
    /**
     * Une fonction pour activer les inputs audio et vidéo
     */
    requestMediaStream: () => Promise<MediaStream | undefined>
    /**
     * Une fonction pour se connecter à une salle de discussion avec livekit
     */
    connectToRoom: () => Promise<void>
}