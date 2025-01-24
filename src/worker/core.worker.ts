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
import { uuid } from "@ai/lib/utils";
import { MeetConnectionStatus } from "@ai/types/worker";
import { io, type Socket } from "socket.io-client";
import { type EventEmitter } from "events";


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
    participants: Array<IParticipant> = [];
    token: string = ''
    stream: MediaStream | undefined = undefined;
    call_id: string = ''
    event!: EventEmitter;
    retry = 0

    constructor(event: EventEmitter) {
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
}