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
import AppContext from "@ai/context/context"
import AppWorkerContext from "@ai/context/worker.context"
import { sleep } from "@ai/lib/utils"
import { TAppContext, TAppWorkerContext } from "@ai/types/context"
import { CustomUser } from "@ai/types/requests/user.request"
import Worker from "@ai/worker/worker"
import { useContext, useEffect, useState } from "react"

function BeginMeet({ code }: { code: string }) {
    const { setWorker, worker, event } = useContext<TAppWorkerContext>(AppWorkerContext)
    const { user } = useContext<TAppContext>(AppContext)
    const [started, setStarted] = useState<boolean>(false)

    useEffect(() => {
        let isMounted = true;
    
        async function init() {
            if (!isMeetPage()) return;
            const _user = await getUser(user?.email ?? 'empty');
            let userData: CustomUser | undefined = undefined;
            if (_user.data) userData = _user.data;
            await sleep(1);
            const worker = new Worker(event, code, userData);
            await worker.init();
            if (isMounted) {
                setWorker(worker);
                setStarted(true);
            }
        }
    
        if (user && !started) init();
    
        return () => {
            if (worker) {
                worker.disconnect();
                setWorker(null);
                // setStarted(false);
            }
            isMounted = false;
        };
    }, [code, event, setWorker, started, user, worker]);
    
    return (
        <div className=""></div>
    )
}

export const isMeetPage = () => {
    const path = location.pathname;
    const regex = /^\/[a-z]{2}\/meet\/[a-zA-Z0-9]+$/;
    console.log('meet: ', regex.test(path));
    return regex.test(path);
};

export default BeginMeet