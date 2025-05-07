/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
import { DashboardOverview } from '@ai/components/dashboard/overview';
import { RecentMeets } from '@ai/components/dashboard/recent-meets';
import { RecentRecordings } from '@ai/components/dashboard/recent-recordings';
import { RecentTranscriptions } from '@ai/components/dashboard/recent-transcriptions';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardOverview />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <RecentMeets />
                <RecentRecordings />
                <RecentTranscriptions />
            </div>
        </div>
    );
}
