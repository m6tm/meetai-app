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

export default function ContextProvider({ children }: { children: React.ReactNode; }) {
    const [meetPanel, setMeetPanel] = React.useState<MEET_PANEL_TYPE>(MEET_PANEL_TYPE.NONE);
    const [autoriseMessage, setAutoriseMessage] = React.useState<boolean>(true);
    const [mediaControl, setMediaControl] = React.useState<MEDIA_CONTROL_TYPE>(MEDIA_CONTROL_TYPE.NONE);
    const [user, setUser] = useState<User | null>(null)

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider
        signInWithPopup(fireAuth, provider)
    }

    const githubSignIn = async () => {
        const provider = new GithubAuthProvider
        provider.addScope('repo')
        signInWithPopup(fireAuth, provider)
    }

    const logOut = async () => {
        signOut(fireAuth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, currentUser => {
            setUser(currentUser)
        });
        return () => unsubscribe()
    }, [user])

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