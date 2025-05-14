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

import { Skeleton } from '@ai/components/ui/skeleton';

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[100px]" />
        </div>
    );
}
