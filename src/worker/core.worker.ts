/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { db } from "@ai/db";
import { ICoreWorker, IParticipant } from "@ai/interfaces/core.worker.interface";
import { makeRequest, uuid } from "@ai/lib/utils";
import { MeetConnectionStatus, TMeetParticipants } from "@ai/types/worker";
import { io, type Socket } from "socket.io-client";
import { type EventEmitter } from "events";
import { GenerateMeetTokenResponse } from "@ai/types/requests/meet-token.request";
import { ConnectionState, RemoteParticipant, Room, RoomEvent } from 'livekit-client';
import { generateRandomUserName } from "@ai/lib/meet.lib";
import { User } from "@prisma/client";
import { AppMode } from "@ai/types/definitions";


export default class CoreWorker implements ICoreWorker {
    socket: Socket | undefined = undefined;
    status: MeetConnectionStatus = 'disconnected'
    audio = {
        muted: {
            microphone: true,
            speaker: false
        },
        volume: {
            microphone: 1,
            speaker: 1
        }
    }
    video = {
        muted: true,
        volume: 1
    }
    _participants: Array<IParticipant> = [];
    participants: TMeetParticipants = [];
    token: string = ''
    stream: MediaStream | undefined = undefined;
    call_id: string = ''
    event!: EventEmitter;
    retry = 0
    user: User | undefined = undefined
    ws_url: string = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL ?? ''
    room: Room | undefined = undefined
    mode: AppMode = process.env.NEXT_PUBLIC_APP_MODE as AppMode

    constructor(event: EventEmitter, user: User | undefined) {
        this.event = event
        this.user = user
    }

    connect = async (): Promise<Socket | Socket.DisconnectReason | Error> => {
        const client = io(process.env.NEXT_PUBLIC_URL_WEBSOCKET, {
            transports: ['polling', 'websocket', 'webtransport'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 15000
        })

        return new Promise((resolve, reject) => {
            client.on('connect', () => {
                this.socket = client
                this.status = 'connected'
                this.retry = 0
                resolve(client)
            })

            client.on('disconnect', (reason: Socket.DisconnectReason) => {
                this.status = 'disconnected'
                reject(reason)
            })

            client.on('connect_error', (error: Error) => {
                this.status = 'reconnecting'
                this.retry++
                if (this.retry === 11) {
                    this.status = 'error'
                }
                reject(error)
            })
        })
    }

    requestMediaStream = async (): Promise<MediaStream | undefined> => {
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
        this.call_id = uuid()

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                },
                video: video_muted ? false : {
                    facingMode: 'user',
                    width: { min: 640, ideal: 1280 },
                    height: { min: 480, ideal: 720 },
                    advanced: [
                        { width: 1920, height: 1280 },
                        { aspectRatio: 1.333 }
                    ]
                }
            })

            this.stream = stream
            if (audio_muted) {
                stream.getAudioTracks().forEach(track => track.enabled = false);
            }
            return stream
        } catch (error) {
            console.error(error)
            return undefined
        }
    }

    connectToRoom = async () => {
        if (this.token.length === 0) {
            const form = new FormData();
            const default_user = generateRandomUserName();
            form.append('room_name', this.call_id);

            if (this.user) {
                form.append('participant_name', this.user.name ?? default_user);
            } else {
                form.append('participant_name', default_user);
            }

            const response = await makeRequest<GenerateMeetTokenResponse>('/api/get-token', form, 'POST');

            if (!response.data) {
                throw new Error('Failed to generate token');
            }

            this.token = response.data.token;
        }
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

        this.room = new Room();

        this.room.on(RoomEvent.Connected, () => {
            this.status = 'connected'
            this.event.emit('je suis connecté à la salle')
        });

        await this.room.connect(this.ws_url, this.token, {
            autoSubscribe: true,
        });
        this._participants = this.getParticipants(this.room);

        this.room.localParticipant.enableCameraAndMicrophone()

        if (!audio_muted) {
            this.room.localParticipant.setMicrophoneEnabled(false);
        }
        if (!video_muted) {
            this.room.localParticipant.setCameraEnabled(false);
        }

        this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
            console.log('Track subscribed :', track.kind, publication.trackSid, participant.identity);
        });

        this.room.on(RoomEvent.ParticipantConnected, () => this.event.emit('un utilisateur viens de se connecter'));

        this.room.on(RoomEvent.Disconnected, async () => {
            this.status = 'disconnected'
            this.event.emit('je suis déconnecté de la salle')
        });

        this.room.on(RoomEvent.ParticipantDisconnected, () => this.event.emit('un utilisateur viens de se déconnecter'));
    }

    getParticipants = (room: Room): IParticipant[] => {
        // Obtenir la liste des participants déjà présents
        const _participants: IParticipant[] = [];
        Array.from(room.remoteParticipants.values()).forEach((participant: RemoteParticipant) => {
            const existingParticipant: IParticipant = {
                id: participant.sid,
                name: participant.identity,
                avatar: undefined,
                email: '',
                pinned: false,
                audio: {
                    muted: false,
                    volume: 1
                },
                video: {
                    muted: false,
                    volume: 1
                },
                isSelf: false,
                isHost: false,
            };
            _participants.push(existingParticipant);
        });

        // Ajouter l'utilisateur actuel comme participant
        const selfParticipant: IParticipant = {
            id: room.localParticipant.sid,
            name: this.user?.name ?? generateRandomUserName(),
            avatar: undefined,
            email: this.user?.email ?? '',
            pinned: false,
            audio: {
                muted: false,
                volume: 1
            },
            video: {
                muted: false,
                volume: 1
            },
            isSelf: true,
            isHost: false,
        };
        _participants.push(selfParticipant);

        return _participants;
    }

    getAvailableCameras = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const virtualCameras = devices.filter(device => device.kind === 'videoinput' && device.deviceId !== 'default' && (device.label.includes('OBS') || device.label.includes('Virtual')));
        const cameras = devices.filter(device => device.kind === 'videoinput' && (!device.label.includes('OBS') && !device.label.includes('Virtual')));

        if (this.mode === 'development') return virtualCameras
        return cameras
    }

    getAvailableAudioInput = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphone = devices.filter(device => device.kind === 'audioinput' && (!device.label.includes('OBS') && !device.label.includes('Virtual')));

        return microphone
    }

    getAvailableAudioOutput = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const microphone = devices.filter(device => device.kind === 'audiooutput' && (!device.label.includes('OBS') && !device.label.includes('Virtual')));

        return microphone
    }

    disconnect = async () => {
        if (this.room) {
            if (this.room.state === ConnectionState.Connected) await this.room.disconnect();
            this.room = undefined;
        }
    }
}
