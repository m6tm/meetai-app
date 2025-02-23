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
import { createContext } from "react";
import { TAppWorkerContext } from "../types/context";
import Worker from "@ai/worker/worker";
import { EventEmitter } from "events";

const AppWorkerContext = createContext<TAppWorkerContext>({
    event: new EventEmitter,
    worker: null,
    setWorker: function (worker: Worker | null): void {
        throw new Error("Function not implemented.");
    }
})

export default AppWorkerContext