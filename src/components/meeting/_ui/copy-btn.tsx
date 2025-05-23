/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
'use client';

import React, { useEffect, useState } from 'react';
import { Check, Copy, Link } from 'lucide-react';
import { LanguageType } from '@ai/types/definitions';
import { getLanguage } from '@ai/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ai/components/ui/tooltip';

export default function CopyElement({ code }: { code: string }) {
    const [copiedCode, setCopiedCode] = useState<boolean>(false);
    const [copiedLink, setCopiedLink] = useState<boolean>(false);
    const [locale, setLocale] = useState<LanguageType>('en');

    useEffect(() => {
        async function setLanguage() {
            const language = await getLanguage();
            if (language) setLocale(language.locale);
        }
        setLanguage();
    }, []);

    function toggleCopyHandler() {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    }

    function toggleLinkCopyHandler() {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL_ORIGIN}/${locale}/join/${code}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    }

    return (
        <div className="h-10 w-full rounded-lg bg-secondary/50 flex items-center justify-between px-2 line-clamp-1">
            <span>{`${process.env.NEXT_PUBLIC_URL_ORIGIN}/${locale}/join/${code}`.slice(0, 20)} ...</span>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        className="bg-black text-white px-3 py-1.5 text-sm rounded-md"
                        onClick={toggleLinkCopyHandler}
                    >
                        {copiedLink ? <Check className="size-4" /> : <Link className="size-4" />}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copy the meet link</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        className="bg-black text-white px-3 py-1.5 text-sm rounded-md"
                        onClick={toggleCopyHandler}
                    >
                        {copiedCode ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copy the meet code</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
