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
import { FileText } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ai/components/ui/card';

export function RecentTranscriptions() {
    const recentTranscriptions = [
        {
            id: 'trans-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            words: '4,532 mots',
        },
        {
            id: 'trans-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            words: '3,218 mots',
        },
        {
            id: 'trans-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            words: '5,874 mots',
        },
    ];

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Transcriptions récentes</CardTitle>
                    <CardDescription>Vos dernières transcriptions</CardDescription>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentTranscriptions.map((transcription) => (
                        <div key={transcription.id} className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{transcription.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {transcription.date} • {transcription.words}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/transcriptions/${transcription.id}`}>
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">Voir la transcription</span>
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/dashboard/transcriptions">Voir toutes les transcriptions</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
