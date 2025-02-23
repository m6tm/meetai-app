/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { IMeetWorker } from "@ai/interfaces/meet.worker.interface";
import CoreWorker from "./core.worker";
import { type EventEmitter } from "events";
import { User } from "@prisma/client";


export default class Worker extends CoreWorker implements IMeetWorker {

    constructor(event: EventEmitter, meet_id: string, user: User | undefined) {
        super(event, user)
        this.call_id = meet_id
    }

    async init() {
        await this.connect()

        if (this.status !== 'connected') throw new Error('Failed to connect to the server')

        await this.connectToRoom()

        // await this.requestMediaStream()

        // if (this.stream === undefined) throw new Error('Failed to get media stream')
    }
}