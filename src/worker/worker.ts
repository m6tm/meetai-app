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


export default class Worker extends CoreWorker implements IMeetWorker {

    constructor() {
        super()
        // TODO: Implement worker logic
    }

    async init() {
        console.log('Going to starting ...');
        await this.connect()
        console.log('OK');
    }
}