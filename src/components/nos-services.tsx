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
import { buttonVariants } from './ui/button';
import { NosServicesProps } from '@ai/types/components-props';

export default function NosServices({ service }: NosServicesProps) {
    return (
        <div
            className={`flex flex-col lg:flex-row lg:items-center gap-4${service.id % 2 === 0 ? ' lg:flex-row-reverse' : ''}`}
        >
            <div className="lg:w-[600px] flex justify-center z-0">
                <div className="relative">
                    <Image
                        src={service.image}
                        className="rounded-full mx-auto w-[200px] h-[200px] object-cover select-none pointer-events-none"
                        width={150}
                        height={150}
                        alt={service.imageAlt ?? ''}
                    />
                    <div className="absolute w-[150px] h-[150px] rounded-full bg-white/10 backdrop-blur-sm top-[-50px] right-[-50px]"></div>
                    <div className="absolute w-[90px] h-[90px] rounded-full bg-white/10 backdrop-blur-sm bottom-[-30px] left-[-30px] z-[-1]"></div>
                </div>
            </div>
            <div className="flex justify-center z-10">
                <div className="lg:w-1/2">
                    <h4 className="text-center text-lg font-bold uppercase">{service.title}</h4>
                    <p className="text-center text-gray-600 line-clamp-3">{service.description}</p>
                    <Link href={service.link} className={`${buttonVariants({ variant: 'link' })}`}>
                        Lire plus
                    </Link>
                </div>
            </div>
        </div>
    );
}
