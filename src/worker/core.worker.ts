/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { ICoreWorker } from "@ai/interfaces/core.worker.interface";
import { io, type Socket } from "socket.io-client";


export default class CoreWorker implements ICoreWorker {
    socket: Socket | undefined = undefined;
    
    connect = async (): Promise<Socket | Socket.DisconnectReason> => {
        const client = io(process.env.NEXT_PUBLIC_URL_WEBSOCKET)
        return new Promise((resolve, reject) => {
            client.on('connect', () => {
                this.socket = client
                resolve(client)
            })

            client.on('disconnect', (reason: Socket.DisconnectReason) => {
                reject(reason)
            })
        })
    }
}