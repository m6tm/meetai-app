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
import React, { useEffect } from "react";
import AppContext from "@ai/context";
import { TAppContext } from "@ai/types/context";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { fireAuth } from '@ai/firebase';
import { db } from "@ai/db";
import { usePathname, useRouter } from "@ai/i18n/routing";
import { initializeLanguage } from "@ai/lib/utils";
import { EventEmitter } from "events"
import { useUserStore } from "@ai/app/stores/user.store";
import { signOutNow } from "@ai/actions/auth.action";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ContextProvider({ children }: { children: React.ReactNode; }) {
    const event = new EventEmitter();
    const pathname = usePathname();
    const router = useRouter();
    const { setUser, setResponded } = useUserStore()

    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(fireAuth, provider)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
        }
    }

    const githubSignIn = async () => {
        try {
            const provider = new GithubAuthProvider()
            provider.addScope('repo')
            await signInWithPopup(fireAuth, provider)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
        }
    }

    const logOut = async () => {
        await signOutNow()
        signOut(fireAuth)
    }

    useEffect(() => {
        async function setLanguage() {
            const { language_setted } = await initializeLanguage()
            const new_locale = (await db.locale.orderBy('id').last())!;
            if (language_setted) router.replace(pathname, { locale: new_locale.locale });
        }
        setLanguage()

        const unsubscribe = onAuthStateChanged(fireAuth, currentUser => {
            setUser(currentUser)
            setResponded(true)
        });
        return () => unsubscribe()
    }, [pathname, router, setResponded, setUser])

    const context: TAppContext = {
        googleSignIn,
        githubSignIn,
        logOut,
        event,
    }
    const queryClient = new QueryClient()
    
    return (
        <AppContext.Provider value={context}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AppContext.Provider>
    )
}