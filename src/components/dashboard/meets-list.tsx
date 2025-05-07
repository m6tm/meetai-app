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
import { Copy, ExternalLink, MoreHorizontal, Plus, Search } from 'lucide-react';

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

export function MeetsList() {
    const [searchQuery, setSearchQuery] = useState('');

    const meets = [
        {
            id: 'meet-1',
            title: "Réunion d'équipe hebdomadaire",
            date: "Aujourd'hui, 14:00",
            link: 'https://aimeet.app/m/abc123',
            participants: 8,
        },
        {
            id: 'meet-2',
            title: 'Présentation client',
            date: 'Hier, 10:30',
            link: 'https://aimeet.app/m/def456',
            participants: 5,
        },
        {
            id: 'meet-3',
            title: 'Brainstorming produit',
            date: '12 mai, 15:00',
            link: 'https://aimeet.app/m/ghi789',
            participants: 6,
        },
        {
            id: 'meet-4',
            title: 'Entretien candidat',
            date: '10 mai, 11:00',
            link: 'https://aimeet.app/m/jkl012',
            participants: 3,
        },
        {
            id: 'meet-5',
            title: 'Formation nouvelle plateforme',
            date: '8 mai, 09:30',
            link: 'https://aimeet.app/m/mno345',
            participants: 12,
        },
    ];

    const filteredMeets = meets.filter((meet) => meet.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Liens de réunions</CardTitle>
                        <CardDescription>Gérez tous vos liens de réunions générés</CardDescription>
                    </div>
                    <Button className="gap-1">
                        <Plus className="h-4 w-4" />
                        <span>Nouvelle réunion</span>
                    </Button>
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
                            <TableHead>Participants</TableHead>
                            <TableHead>Lien</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMeets.map((meet) => (
                            <TableRow key={meet.id}>
                                <TableCell className="font-medium">{meet.title}</TableCell>
                                <TableCell>{meet.date}</TableCell>
                                <TableCell>{meet.participants}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                        {meet.link}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Copy className="h-4 w-4" />
                                        <span className="sr-only">Copier le lien</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <a href={meet.link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                            <span className="sr-only">Ouvrir le lien</span>
                                        </a>
                                    </Button>
                                </TableCell>
                                <TableCell>
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
                                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                                            <DropdownMenuItem>Régénérer le lien</DropdownMenuItem>
                                            <DropdownMenuItem>Planifier</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
