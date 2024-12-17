/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */

import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

export default function HomeBanner() {
    return (
        <section className="banner-home">
            <div className="bg-black/15 backdrop-blur-sm absolute top-0 left-0 w-full h-full grid grid-cols-1 lg:grid-cols-2">
                <div className="font-fleur-sans flex items-center justify-center flex-col gap-5">
                    <h2 className="uppercase text-white font-primary-semi-bold font-extrabold text-3xl">
                        Un titre important
                    </h2>
                    <p className="w-[80%] text-white text-lg text-center text-shadow">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel ultricies luctus,
                        velit nisl ultricies nisl.
                    </p>
                    <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
                        Demander un devis
                    </Link>
                </div>
                <div className="justify-center items-center select-none hidden lg:flex">
                    <Image
                        src="/rocket-banner.png"
                        width={400}
                        height={400}
                        className="object-cover rocket-banner"
                        alt="Rocket banner illustration"
                    />
                </div>
            </div>
        </section>
    );
}
