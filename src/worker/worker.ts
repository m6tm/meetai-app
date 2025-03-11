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
import { User } from "firebase/auth";


export default class Worker extends CoreWorker implements IMeetWorker {

    constructor(event: EventEmitter, code: string, user: User | null) {
        super(event, code)
        if (user) this.user = user
    }

    async init() {
        await this.connect()

        if (this.status !== 'connected') throw new Error('Failed to connect to the server')
        await this.startMeet()

        // await this.requestMediaStream()

        // if (this.stream === undefined) throw new Error('Failed to get media stream')
    }
}