/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use client'
import { signIn } from "@ai/actions/auth.action";
import { useUserStore } from "@ai/app/stores/user.store";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import GithubSignIn from "@ai/components/auth/GithubSignIn";
import GoogleSignIn from "@ai/components/auth/GoogleSignIn";
import AppContext from "@ai/context";
import { useRouter } from "@ai/i18n/routing";
import { useContext, useEffect } from "react";


export default function Page() {
    const { googleSignIn, githubSignIn } = useContext(AppContext)
    const { user } = useUserStore()
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
        } catch (error) {
            console.error(error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleGithubSignIn = async () => {
        try {
            await githubSignIn()
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        async function checkUser() {
            await signIn(user?.email, user?.displayName)
            router.push('/')
        }
        if (user) checkUser()
    }, [router, user])

    return (
        <div className="flex flex-col h-screen w-full items-center justify-center space-y-4">
            <GoogleSignIn {...{handleSignIn: handleGoogleSignIn}} />
            {/* <GithubSignIn {...{handleSignIn: handleGithubSignIn}} /> */}
        </div>
    );
}
