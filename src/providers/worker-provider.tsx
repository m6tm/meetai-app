"use client";
import AppContext from "@ai/context/context";
import AppWorkerContext from "@ai/context/worker.context";
import { TAppWorkerContext } from "@ai/types/context";
import React from "react";


export default function WorkerProvider({ children }: { children: React.ReactNode }) {
    const { event } = React.useContext(AppContext);
    const [worker, setWorker] = React.useState<Worker | null>(null);
    return (
        <AppWorkerContext.Provider value={{
            worker,
            setWorker,
            event,
        } as TAppWorkerContext}>
            {children}
        </AppWorkerContext.Provider>
    );
}
