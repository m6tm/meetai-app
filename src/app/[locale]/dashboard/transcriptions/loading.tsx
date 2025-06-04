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
    return (
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/4" /> {/* Titre */}
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" /> {/* Élément de liste 1 */}
                <Skeleton className="h-10 w-full" /> {/* Élément de liste 2 */}
                <Skeleton className="h-10 w-full" /> {/* Élément de liste 3 */}
                <Skeleton className="h-10 w-full" /> {/* Élément de liste 4 */}
                <Skeleton className="h-10 w-full" /> {/* Élément de liste 5 */}
            </div>
        </div>
    );
}
