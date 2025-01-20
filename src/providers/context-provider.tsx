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
import React, { useEffect, useState } from "react";
import AppContext from "@ai/context";
import { TAppContext } from "@ai/types/context";
import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, User } from 'firebase/auth'
import { fireAuth } from '@ai/firebase';
import { db } from "@ai/db";
import { usePathname, useRouter } from "@ai/i18n/routing";
import { initializeLanguage } from "@ai/lib/utils";

export default function ContextProvider({ children }: { children: React.ReactNode; }) {
    const pathname = usePathname();
    const router = useRouter();
    const [meetPanel, setMeetPanel] = React.useState<MEET_PANEL_TYPE>(MEET_PANEL_TYPE.NONE);
    const [autoriseMessage, setAutoriseMessage] = React.useState<boolean>(true);
    const [mediaControl, setMediaControl] = React.useState<MEDIA_CONTROL_TYPE>(MEDIA_CONTROL_TYPE.NONE);
    const [user, setUser] = useState<User | null>(null)

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
        });
        return () => unsubscribe()
    }, [pathname, router, user])

    const context: TAppContext = {
        meetPanel,
        setMeetPanel,
        autoriseMessage,
        setAutoriseMessage,
        mediaControl,
        setMediaControl,
        user,
        googleSignIn,
        githubSignIn,
        logOut,
    }
    
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}