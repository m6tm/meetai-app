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
import AppContext from "@ai/context"
import { TAppContext } from "@ai/types/context"
import Worker from "@ai/worker/worker"
import { useContext, useEffect, useState } from "react"

function BeginMeet() {
    const { setWorker } = useContext<TAppContext>(AppContext)
    const [started, setStarted] = useState<boolean>(false)

    useEffect(() => {
        if (!started) {
            const worker = new Worker()
            worker.init()
            setWorker(worker)
            setStarted(true)
        }
    }, [setWorker, started])

    return (
        <div className=""></div>
    )
}

export default BeginMeet