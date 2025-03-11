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
import { MeetConnectionStatus } from "@ai/types/worker";
import { io, type Socket } from "socket.io-client";
import { type EventEmitter } from "events";
import { User } from "firebase/auth";
import { RemoteParticipant, Room, RoomEvent, TrackPublication } from 'livekit-client';
import { generateRandomUserName } from "@ai/lib/meet.lib";
import { GenerateMeetTokenResponse } from "@ai/types/requests/meet-token.request";


export default class CoreWorker implements ICoreWorker {
    socket: Socket | undefined = undefined;
    status: MeetConnectionStatus = 'disconnected'
    audio = {
        sources: {
            microphone: undefined,
            speaker: undefined
        },
        currentSource: {
            microphone: undefined,
            speaker: undefined
        },
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
        sources: {
            camera: undefined
        },
        currentSource: {
            camera: undefined
        },
        muted: true,
        volume: 1
    }
    _participants: Array<IParticipant> = [];
    participants: IParticipant[] = [];
    token: string = ''
    stream: MediaStream | undefined = undefined;
    call_id: string = ''
    event!: EventEmitter;
    retry = 0
    user: User | undefined = undefined
    ws_url: string = process.env.NEXT_PUBLIC_LIVEKIT_WEBSOCKET_URL ?? ''
    room: Room | undefined = undefined;

    constructor(event: EventEmitter, public code: string) {
        this.event = event
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

    startMeet = async () => {
        if (this.token.length === 0) {
            const form = new FormData();
            const default_user = generateRandomUserName();
            form.append('room_name', this.code);

            if (this.user) {
                form.append('participant_name', this.user.displayName ?? default_user);
            } else {
                form.append('participant_name', default_user);
            }

            const response = await makeRequest<GenerateMeetTokenResponse>('/api/get-token', form, 'POST');

            if (!response.data) {
                throw new Error('Failed to generate token');
            }


            this.token = response.data.token;
        }

        this.room = new Room();

        this.room.on(RoomEvent.Connected, () => {
            this.status = 'connected'
            this.event.emit('je suis connecté à la salle');
        });

        await this.room.connect(this.ws_url, this.token, {
            autoSubscribe: true,
        });

        this._participants = this.getParticipants();

        this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
            console.log('Track subscribed :', track.kind, publication.trackSid, participant.identity);
        });

        this.room.on(RoomEvent.ParticipantConnected, (participant) => {
            this.event.emit('un utilisateur viens de se connecter');
            participant.on('trackMuted', (track: TrackPublication) => {
                this.event.emit('un participant a désactivé une piste audio/video', participant, track);
            });
            participant.on('trackUnmuted', (track: TrackPublication) => {
                this.event.emit('un participant a activé une piste audio/video', participant, track);
            });
        });

        // this.room.on(RoomEvent.Disconnected, () => {});

        this.room.on(RoomEvent.ParticipantDisconnected, () => this.event.emit('un utilisateur viens de se déconnecter'));
    }

    getParticipants = (): IParticipant[] => {
        if (!this.room) return []
        // Obtenir la liste des participants déjà présents
        const _participants: IParticipant[] = [];
        Array.from(this.room.remoteParticipants.values()).forEach((participant: RemoteParticipant) => {
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
            id: this.room.localParticipant.sid,
            name: this.user?.displayName ?? generateRandomUserName(),
            avatar: undefined,
            email: this.user?.email ?? '',
            pinned: true,
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

        this.event.emit('met à jour la liste des participants', _participants);

        return _participants;
    }

    setMyLocalDevice = async (audio: boolean, video: boolean) => {
        if (!this.room) return { audioToggled: false, videoToggled: false }

        let audioToggled = false;
        let videoToggled = false;
        if (audio) audioToggled = !!(await this.room.localParticipant.setMicrophoneEnabled(true));
        if (!audio) audioToggled = !!(await this.room.localParticipant.setMicrophoneEnabled(false));
        if (video) videoToggled = !!(await this.room.localParticipant.setCameraEnabled(true));
        if (!video) videoToggled = !!(await this.room.localParticipant.setCameraEnabled(false));
        return { audioToggled, videoToggled }
    }

    setMyAudioLocalDevice = async (audio: boolean) => {
        if (!this.room) return false

        let audioToggled = false;
        if (audio) audioToggled = !!(await this.room.localParticipant.setMicrophoneEnabled(true));
        if (!audio) audioToggled = !!(await this.room.localParticipant.setMicrophoneEnabled(false));
        return audioToggled
    }

    setMyVideoLocalDevice = async (video: boolean) => {
        if (!this.room) return false

        let videoToggled = false;
        if (video) videoToggled = !!(await this.room.localParticipant.setCameraEnabled(true));
        if (!video) videoToggled = !!(await this.room.localParticipant.setCameraEnabled(false));
        return videoToggled
    }

    disconnect = async () => {
        if (this.room) {
            await this.room.disconnect();
            this.room = undefined;
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = undefined;
        }
        this.event.emit('déconnexion en cours')
    }
}