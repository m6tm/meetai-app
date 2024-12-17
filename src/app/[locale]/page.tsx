/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */

import React from 'react';
import LayoutComponent from '@minds/components/layout';
import '@styles/animations.css';
import HomeBanner from '@minds/components/banners/home-banner';
import NosServices from '@minds/components/nos-services';
import { SERVICES } from '@minds/utils/constants';
import Image from 'next/image';
import Testimonials from '@minds/components/testimonials';

export async function generateMetadata() {
    return {
        title: 'Microminds Tech Ltd',
        description: 'Microminds Tech Ltd - Empowering Innovation Through Technology',
    };
}

export default function Home() {
    const services = SERVICES;
    return (
        <LayoutComponent>
            <HomeBanner />
            <div className="flex flex-col space-y-20 py-10 my-10 lg:py-40 px-10 bg-gradient-to-br from-purple-400 via-purple-300 to-orange-300 relative">
                <Image
                    src="/shap-divider.svg"
                    alt="Divider Top"
                    width={100}
                    height={100}
                    className="mx-auto w-full h-32 absolute top-0 left-0 hidden lg:block"
                />
                <h3 className="uppercase text-center text-2xl font-bold">Ours services</h3>
                {services.map((service) => (
                    <NosServices key={service.id} service={service} />
                ))}
                <Image
                    src="/shap-divider.svg"
                    alt="Divider Top"
                    width={100}
                    height={100}
                    className="mx-auto w-full h-32 absolute bottom-0 right-0 rotate-180 hidden lg:block"
                />
            </div>
            <Testimonials />
        </LayoutComponent>
    );
}
