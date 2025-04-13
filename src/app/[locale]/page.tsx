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
import MeetingSideBar from '@ai/components/meeting-sidebar';
import Meeting from '@ai/components/meeting';
import AppLayout from '@ai/components/app-layout';

export async function generateMetadata() {
    return {
        title: 'Meet ai LLC - Visioconference',
        description: 'Meet ai LLC - Appels vidéo et visioconferences pour tous',
    };
}

export default async function Home() {
    return (
        <AppLayout />
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MainApp() {
    return (
        <LayoutComponent>
            <div className="lg:flex">
                <MeetingSideBar />
                <Meeting />
            </div>
        </LayoutComponent>
    )
}
