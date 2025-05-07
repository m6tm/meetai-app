/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { Link } from '@ai/i18n/routing';
import { useTranslations } from 'next-intl';
import { Input } from '@ai/components/ui/input';
import { Label } from '@ai/components/ui/label';
import { Button } from '@ai/components/ui/button';
import { MailIcon, PhoneIcon } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Footer');
    return (
        <footer className="bg-primary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
            <div className="text-white space-y-1 flex flex-col">
                <Link href={'/'} title={t('about')}>
                    {t('about')}
                </Link>
                <Link href={'/'} title={t('mentions')}>
                    {t('mentions')}
                </Link>
            </div>
            <div className="text-white order-2 md:col-span-2 lg:order-1 lg:col-span-1">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Subscribe to ours newsletter</Label>
                        <div className="flex">
                            <Input
                                type="email"
                                id="email"
                                className="rounded-tr-none rounded-br-none duration-150 focus:bg-primary-foreground/5"
                                placeholder="Your email address"
                            />
                            <Button variant="secondary" className="rounded-tl-none rounded-bl-none">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="text-white order-1 lg:order-2">
                Contactes:
                <ul className="list-none space-y-2">
                    <li>
                        <Link href="/">
                            <PhoneIcon className="inline-block" /> <span>+237 XXX XXX XXX</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="mailto:info@microminds.com;subject=Form website">
                            <MailIcon className="inline-block" /> <span>email@example.com</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="md:col-span-2 lg:col-span-3 order-3">
                <p className="text-white text-center text-sm">Copyright © 2024 Meet ai LLC. All rights reserved.</p>
            </div>
        </footer>
    );
}
