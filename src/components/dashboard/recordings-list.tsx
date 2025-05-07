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

import { useState } from 'react';
import { Download, MoreHorizontal, Play, Search, Share2 } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ai/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@ai/components/ui/dropdown-menu';
import { Input } from '@ai/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ai/components/ui/table';

export function RecordingsList() {
    const [searchQuery, setSearchQuery] = useState('');

    const recordings = [
        {
            id: 'rec-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            duration: '45 min',
            size: '128 MB',
        },
        {
            id: 'rec-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            duration: '32 min',
            size: '95 MB',
        },
        {
            id: 'rec-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            duration: '58 min',
            size: '165 MB',
        },
        {
            id: 'rec-4',
            title: 'Entretien candidat',
            date: '10 mai, 11:00',
            duration: '28 min',
            size: '82 MB',
        },
        {
            id: 'rec-5',
            title: 'Formation nouvelle plateforme',
            date: '8 mai, 09:30',
            duration: '1h 15min',
            size: '210 MB',
        },
    ];

    const filteredRecordings = recordings.filter((recording) =>
        recording.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Enregistrements</CardTitle>
                        <CardDescription>Gérez tous vos enregistrements de réunions</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par titre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9"
                    />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Durée</TableHead>
                            <TableHead>Taille</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecordings.map((recording) => (
                            <TableRow key={recording.id}>
                                <TableCell className="font-medium">{recording.title}</TableCell>
                                <TableCell>{recording.date}</TableCell>
                                <TableCell>{recording.duration}</TableCell>
                                <TableCell>{recording.size}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Play className="h-4 w-4" />
                                            <span className="sr-only">Lire</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Télécharger</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Share2 className="h-4 w-4" />
                                            <span className="sr-only">Partager</span>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Renommer</DropdownMenuItem>
                                                <DropdownMenuItem>Générer transcription</DropdownMenuItem>
                                                <DropdownMenuItem>Exporter</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
