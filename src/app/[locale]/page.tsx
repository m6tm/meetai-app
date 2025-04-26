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
import '@styles/animations.css';
import AppLayout from '@ai/components/layout/layout';

export async function generateMetadata() {
    return {
        title: 'Meet ai LLC - Visioconference',
        description: 'Meet ai LLC - Appels vidéo et visioconferences pour tous',
    };
}

export default async function Home() {
    return <AppLayout />;
}
