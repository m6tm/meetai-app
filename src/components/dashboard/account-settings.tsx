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

import type React from 'react';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save } from 'lucide-react';

import { Button } from '@ai/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ai/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@ai/components/ui/form';
import { Input } from '@ai/components/ui/input';
import { Textarea } from '@ai/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ai/components/ui/select';
import { Switch } from '@ai/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ai/components/ui/tabs';
import { getUserInfo } from '@ai/actions/user.action';

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: 'Le nom doit contenir au moins 2 caractères.',
    }),
    email: z.string().email({
        message: 'Veuillez entrer une adresse email valide.',
    }),
    bio: z.string().max(160).optional(),
    language: z.string({
        required_error: 'Veuillez sélectionner une langue.',
    }),
});

const notificationsFormSchema = z.object({
    emailNotifications: z.boolean(),
    meetingReminders: z.boolean(),
    recordingComplete: z.boolean(),
    transcriptionComplete: z.boolean(),
    marketingEmails: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function AccountSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Nouvel état de chargement

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        // defaultValues seront définis après le chargement des données utilisateur
    });

    const notificationsForm = useForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsFormSchema),
        // defaultValues seront définis après le chargement des données utilisateur
    });

    useEffect(() => {
        async function fetchUserInfo() {
            setIsLoading(true);
            const user = await getUserInfo();
            if (user) {
                // Mettre à jour les valeurs par défaut des formulaires
                profileForm.reset({
                    name: user.name || '',
                    email: user.email,
                    bio: user.bio || '', // Gérer le cas où bio est null
                    language: user.language || 'fr', // Gérer le cas où language est null, avec une valeur par défaut
                });
                // Supposons que les préférences de notification sont stockées dans l'objet utilisateur
                // Si elles sont stockées séparément, il faudrait une action dédiée pour les récupérer
                notificationsForm.reset({
                    emailNotifications: true,
                    meetingReminders: true,
                    recordingComplete: true,
                    transcriptionComplete: true,
                    marketingEmails: false,
                });
            }
            setIsLoading(false);
        }

        fetchUserInfo();
    }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois au montage

    function onProfileSubmit(data: ProfileFormValues) {
        setIsSaving(true);
        // TODO: Appeler une action pour mettre à jour le profil utilisateur
        console.log('Profile data to save:', data);
        setTimeout(() => {
            setIsSaving(false);
            // Afficher un message de succès ou gérer les erreurs
        }, 1000);
    }

    function onNotificationsSubmit(data: NotificationsFormValues) {
        setIsSaving(true);
        // TODO: Appeler une action pour mettre à jour les préférences de notification
        console.log('Notifications data to save:', data);
        setTimeout(() => {
            setIsSaving(false);
            // Afficher un message de succès ou gérer les erreurs
        }, 1000);
    }

    // Afficher un indicateur de chargement pendant la récupération des données
    if (isLoading) {
        return <div>Chargement des paramètres utilisateur...</div>; // Remplacez par un composant de chargement approprié
    }

    return (
        <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil</CardTitle>
                        <CardDescription>Gérez les informations de votre profil</CardDescription>
                    </CardHeader>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Parlez-nous de vous"
                                                        className="resize-none"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Vous pouvez @mentionner d&apos;autres utilisateurs et organisations.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Langue</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionnez une langue" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="fr">Français</SelectItem>
                                                        <SelectItem value="en">Anglais</SelectItem>
                                                        <SelectItem value="es">Espagnol</SelectItem>
                                                        <SelectItem value="de">Allemand</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Save className="mr-2 h-4 w-4 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configurez vos préférences de notifications</CardDescription>
                    </CardHeader>
                    <Form {...notificationsForm}>
                        <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={notificationsForm.control}
                                        name="emailNotifications"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Notifications par email</FormLabel>
                                                    <FormDescription>
                                                        Recevez des emails concernant votre activité.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={notificationsForm.control}
                                        name="meetingReminders"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Rappels de réunion</FormLabel>
                                                    <FormDescription>
                                                        Recevez des rappels avant vos réunions programmées.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={notificationsForm.control}
                                        name="recordingComplete"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Enregistrement terminé</FormLabel>
                                                    <FormDescription>
                                                        Soyez notifié lorsqu&apos;un enregistrement est prêt.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={notificationsForm.control}
                                        name="transcriptionComplete"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Transcription terminée</FormLabel>
                                                    <FormDescription>
                                                        Soyez notifié lorsqu&apos;une transcription est prête.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={notificationsForm.control}
                                        name="marketingEmails"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Emails marketing</FormLabel>
                                                    <FormDescription>
                                                        Recevez des emails sur les nouveaux produits et fonctionnalités.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Save className="mr-2 h-4 w-4 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Enregistrer les préférences
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="security">
                <Card>
                    <CardHeader>
                        <CardTitle>Sécurité</CardTitle>
                        <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Mot de passe</h3>
                                <p className="text-sm text-muted-foreground">
                                    Mettez à jour votre mot de passe pour sécuriser votre compte
                                </p>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </div>
                            <Button>Mettre à jour le mot de passe</Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Authentification à deux facteurs</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ajoutez une couche de sécurité supplémentaire à votre compte
                                </p>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <div className="text-base">Authentification à deux facteurs</div>
                                    <div className="text-sm text-muted-foreground">
                                        Protégez votre compte avec l&apos;authentification à deux facteurs
                                    </div>
                                </div>
                                <Button variant="outline">Configurer</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Sessions actives</h3>
                                <p className="text-sm text-muted-foreground">
                                    Gérez vos sessions actives sur différents appareils
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <div className="text-base">MacBook Pro - Paris</div>
                                        <div className="text-sm text-muted-foreground">
                                            Dernière activité: Aujourd&apos;hui à 14:23
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs text-muted-foreground">Actuel</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <div className="text-base">iPhone 13 - Paris</div>
                                        <div className="text-sm text-muted-foreground">
                                            Dernière activité: Aujourd&apos;hui à 12:15
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Déconnecter
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <div className="text-base">Windows PC - Lyon</div>
                                        <div className="text-sm text-muted-foreground">
                                            Dernière activité: Hier à 18:42
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Déconnecter
                                    </Button>
                                </div>
                            </div>
                            <Button variant="outline">Déconnecter toutes les autres sessions</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            {...props}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        />
    );
}
