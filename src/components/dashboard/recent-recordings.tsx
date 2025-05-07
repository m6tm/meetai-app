/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
import { Link } from '@ai/i18n/routing';
import { Play, Video } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ai/components/ui/card';

export function RecentRecordings() {
    const recentRecordings = [
        {
            id: 'rec-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            duration: '45 min',
        },
        {
            id: 'rec-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            duration: '32 min',
        },
        {
            id: 'rec-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            duration: '58 min',
        },
    ];

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Enregistrements récents</CardTitle>
                    <CardDescription>Vos derniers enregistrements</CardDescription>
                </div>
                <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentRecordings.map((recording) => (
                        <div key={recording.id} className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{recording.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {recording.date} • {recording.duration}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Play className="h-4 w-4" />
                                <span className="sr-only">Lire l&apos;enregistrement</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/dashboard/recordings">Voir tous les enregistrements</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
