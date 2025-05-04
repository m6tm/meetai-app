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
import { Download, FileText, MoreHorizontal, Search, Share2 } from 'lucide-react';

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

export function TranscriptionsList() {
    const [searchQuery, setSearchQuery] = useState('');

    const transcriptions = [
        {
            id: 'trans-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            words: '4,532 mots',
            language: 'Français',
        },
        {
            id: 'trans-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            words: '3,218 mots',
            language: 'Français',
        },
        {
            id: 'trans-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            words: '5,874 mots',
            language: 'Français',
        },
        {
            id: 'trans-4',
            title: 'Entretien candidat',
            date: '10 mai, 11:00',
            words: '2,945 mots',
            language: 'Français',
        },
        {
            id: 'trans-5',
            title: 'Formation nouvelle plateforme',
            date: '8 mai, 09:30',
            words: '7,123 mots',
            language: 'Français',
        },
    ];

    const filteredTranscriptions = transcriptions.filter((transcription) =>
        transcription.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Transcriptions</CardTitle>
                        <CardDescription>Gérez toutes vos transcriptions de réunions</CardDescription>
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
                            <TableHead>Mots</TableHead>
                            <TableHead>Langue</TableHead>
                            <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTranscriptions.map((transcription) => (
                            <TableRow key={transcription.id}>
                                <TableCell className="font-medium">{transcription.title}</TableCell>
                                <TableCell>{transcription.date}</TableCell>
                                <TableCell>{transcription.words}</TableCell>
                                <TableCell>{transcription.language}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <FileText className="h-4 w-4" />
                                            <span className="sr-only">Voir</span>
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
                                                <DropdownMenuItem>Traduire</DropdownMenuItem>
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
