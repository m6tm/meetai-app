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
import React, { useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import Footer from './footer';

const pages = [
    {
        name: 'Services',
        href: '/',
    },
    {
        name: 'Portfolio',
        href: '/',
    },
    {
        name: 'Contact',
        href: '/',
    },
    {
        name: 'À propos',
        href: '/',
    },
];

export default function LayoutComponent({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="h-[60px] backdrop-blur-md bg-secondary/50 sticky top-0 left-0 z-50 flex items-center justify-between px-10 md:px-[100px] lg:px-[200px]">
                <Link href="/" className="flex items-center gap-2 font-bold select-none font-fleur-sans text-3xl">
                    Meet ai
                </Link>

                <ul className="list-none space-x-4 hidden md:block">
                    {pages.map((page, index) => (
                        <li key={index} className="inline-block">
                            <Link href={page.href} className="duration-200 hover:bg-secondary px-4 py-2 rounded-md">
                                {page.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <HamburgerMenuIcon className="size-5" />
                    </button>
                    <div
                        className={`fixed top-0 left-0 w-screen h-screen bg-black/20 duration-500 overflow-x-hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <button
                            className={`size-10 hover:bg-secondary ${isOpen ? 'block' : 'hidden'} flex items-center justify-center rounded-full absolute top-5 right-5 z-10`}
                            onClick={() => setIsOpen(false)}
                        >
                            <XIcon size={20} />
                        </button>
                        <div
                            className={`h-full w-1/2 sm:w-1/3 bg-white absolute right-0 top-0 duration-500 pt-[70px] px-4 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        >
                            <div className="grid grid-cols-1 gap-3">
                                {pages.map((page, index) => (
                                    <Link
                                        key={index}
                                        href={page.href}
                                        className="duration-200 hover:bg-secondary px-4 py-2 rounded-md"
                                    >
                                        {page.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="pb-10 min-h-[80vh]">{children}</main>
            <Footer />
        </>
    );
}
