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
import { getUser } from "@ai/actions/user.action"
import AppContext from "@ai/context"
import { TAppContext } from "@ai/types/context"
import { CustomUser } from "@ai/types/requests/user.request"
import Worker from "@ai/worker/worker"
import { useContext, useEffect, useState } from "react"

function BeginMeet({ code }: { code: string }) {
    const { setWorker, worker, event, user } = useContext<TAppContext>(AppContext)
    const [started, setStarted] = useState<boolean>(false)

    useEffect(() => {
        async function init() {
            const _user = await getUser(user?.email ?? 'empty')
            let userData: CustomUser | undefined = undefined
            if (_user.data) userData = _user.data
            const worker = new Worker(event, code, userData)
            worker.init()
            setWorker(worker)
            setStarted(true)
        }
        if (user && !started) init()
    }, [code, event, setWorker, started, user, worker])
    
    return (
        <div className=""></div>
    )
}

export default BeginMeet