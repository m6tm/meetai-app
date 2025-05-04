/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */
import Link from 'next/link';
import { Calendar, ExternalLink } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ai/components/ui/card';

export function RecentMeets() {
    const recentMeets = [
        {
            id: 'meet-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            link: 'https://aimeet.app/m/abc123',
        },
        {
            id: 'meet-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            link: 'https://aimeet.app/m/def456',
        },
        {
            id: 'meet-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            link: 'https://aimeet.app/m/ghi789',
        },
    ];

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Réunions récentes</CardTitle>
                    <CardDescription>Vos derniers liens de réunion</CardDescription>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentMeets.map((meet) => (
                        <div key={meet.id} className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{meet.title}</p>
                                <p className="text-sm text-muted-foreground">{meet.date}</p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={meet.link} target="_blank">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">Ouvrir le lien</span>
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/dashboard/meets">Voir toutes les réunions</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
