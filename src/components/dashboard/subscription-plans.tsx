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

import { Check } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ai/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@ai/components/ui/radio-group';
import { Label } from '@ai/components/ui/label';

export function SubscriptionPlans() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Votre abonnement actuel</CardTitle>
                    <CardDescription>Vous êtes actuellement sur le plan Pro</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">Plan Pro</h3>
                            <p className="text-muted-foreground">Facturé annuellement</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">29€</p>
                            <p className="text-sm text-muted-foreground">par mois</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <p className="text-sm font-medium">Inclus dans votre abonnement :</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Réunions illimitées</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Jusqu&apos;à 50 participants</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Enregistrements illimités</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Transcriptions illimitées</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Assistance prioritaire</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button variant="outline" className="w-full">
                        Annuler l&apos;abonnement
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Changer de plan</CardTitle>
                    <CardDescription>Choisissez le plan qui correspond le mieux à vos besoins</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup defaultValue="pro" className="grid gap-4 lg:grid-cols-3">
                        <div className="flex items-start space-x-4 rounded-md border p-4">
                            <RadioGroupItem value="free" id="free" className="mt-1" />
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="free" className="text-base font-medium">
                                    Plan Gratuit
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Parfait pour les particuliers et les petites équipes
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Réunions limitées à 40 minutes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Jusqu&apos;à 10 participants</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>5 enregistrements par mois</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>5 transcriptions par mois</span>
                                    </li>
                                </ul>
                                <p className="font-medium">0€ / mois</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 rounded-md border p-4 border-primary bg-primary/5">
                            <RadioGroupItem value="pro" id="pro" className="mt-1" />
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="pro" className="text-base font-medium">
                                    Plan Pro
                                </Label>
                                <p className="text-sm text-muted-foreground">Idéal pour les équipes professionnelles</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Réunions illimitées</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Jusqu&apos;à 50 participants</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Enregistrements illimités</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Transcriptions illimitées</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Assistance prioritaire</span>
                                    </li>
                                </ul>
                                <p className="font-medium">29€ / mois</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 rounded-md border p-4">
                            <RadioGroupItem value="enterprise" id="enterprise" className="mt-1" />
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="enterprise" className="text-base font-medium">
                                    Plan Entreprise
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Pour les grandes organisations avec des besoins avancés
                                </p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Tout ce qui est inclus dans le plan Pro</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Jusqu&apos;à 500 participants</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Administration avancée</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Intégration SSO</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Support dédié 24/7</span>
                                    </li>
                                </ul>
                                <p className="font-medium">Contactez-nous pour les tarifs</p>
                            </div>
                        </div>
                    </RadioGroup>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Mettre à jour l&apos;abonnement</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
