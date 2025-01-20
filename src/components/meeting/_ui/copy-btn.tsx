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

import React, { useEffect, useState } from 'react'
import { Button } from '@ui/button'
import { Check, Copy } from 'lucide-react'
import { LanguageType } from '@ai/types/definitions'
import { getLanguage } from '@ai/lib/utils'

export default function CopyElement({ code }: { code: string }) {
    const [copied, setCopied] = useState<boolean>(false)
    const [locale, setLocale] = useState<LanguageType>('en');

    useEffect(() => {
        async function setLanguage() {
            const language = await getLanguage()
            if (language) setLocale(language.locale)
        }
        setLanguage()
    }, [])

    function toggleCopyHandler() {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL_ORIGIN}/${locale}/join/${code}`);
        setCopied(true)
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="h-10 w-full rounded-lg bg-secondary/50 flex items-center justify-between px-2 line-clamp-1">
            <span>{`${process.env.NEXT_PUBLIC_URL_ORIGIN}/${locale}/join/${code}`.slice(0, 25)} ...</span>
            <Button className="h-7 w-10" onClick={toggleCopyHandler}>
                {
                    copied ? <Check /> : <Copy />
                }
            </Button>
        </div>
    )
}