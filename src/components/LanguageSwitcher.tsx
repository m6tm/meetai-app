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
import { db } from "@ai/db";
import { usePathname, useRouter } from "@ai/i18n/routing";
import { initializeLanguage } from "@ai/lib/utils";
import { Button } from "@ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu"
import { Suspense, useEffect, useState } from "react";

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const default_locale = 'en';
    const [locale, setLocale] = useState<'en' | 'fr'>(default_locale);

    useEffect(() => {
        const fetchAndSetLocale = async () => {
            const _locale = await db.locale.orderBy('id').last();
            if (_locale) {
                setLocale(_locale.locale);
            } else {
                setLocale(default_locale);
            }
        };
        fetchAndSetLocale();
    }, []);

    async function handleChangeLanguage(new_locale: 'en' | 'fr') {
        let _locale = await db.locale.orderBy('id').last();
        if (!_locale) {
            await initializeLanguage()
            _locale = (await db.locale.orderBy('id').last())!;
        }
        await db.locale.update(_locale.id, { locale: new_locale });
        setLocale(new_locale);
        router.replace(pathname, { locale: new_locale });
    }
    return (
        <div>
            <Suspense fallback={<p>Loading...</p>}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="bg-transparent border-none shadow-none">
                        <Button variant="outline">{locale}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleChangeLanguage('fr')}>
                                Français
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleChangeLanguage('en')}>
                                English
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Suspense>
        </div>
    );
}