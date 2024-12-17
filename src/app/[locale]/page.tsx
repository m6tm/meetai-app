/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from 'react';
import LayoutComponent from '@ai/components/layout';
import '@styles/animations.css';
// import HomeBanner from '@ai/components/banners/home-banner';
// import NosServices from '@ai/components/nos-services';
// import { SERVICES } from '@ai/utils/constants';
// import Image from 'next/image';
// import Testimonials from '@ai/components/testimonials';

export async function generateMetadata() {
    return {
        title: 'Meet ai LLC',
        description: 'Meet ai LLC - Empowering Innovation Through Technology',
    };
}

export default function Home() {
    // const services = SERVICES;
    return (
        <LayoutComponent>
            <div className=""></div>
        </LayoutComponent>
    );
}
