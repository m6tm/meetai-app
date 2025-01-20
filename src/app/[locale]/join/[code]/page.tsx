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
import { useRouter } from "@ai/i18n/routing";
import { getLanguage } from "@ai/lib/utils";
import { LanguageType } from "@ai/types/definitions";
import { useEffect, useState } from "react";


export default function Join({ params }: { params: Promise<{ code: string }> }) {
    const [code, setCode] = useState<string | null>(null)
    const [locale, setLocale] = useState<LanguageType | null>(null);
    const router = useRouter()
    
    useEffect(() => {
        async function setLanguage() {
            const language = await getLanguage()
            const { code: _code } = await params;
            if (language) setLocale(language.locale)
            setCode(_code)
        }
        setLanguage()

        if (locale) router.push(`/meet/${code}`, { locale })
    }, [code, locale, params, router])
    
    // redirect({ href: `/meet/${code}`, locale: 'en' })

    return (
        <div className=""></div>
    )
}
