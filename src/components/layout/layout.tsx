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

import { Button } from '@ai/components/ui/button';
import { Input } from '@ai/components/ui/input';
import { Calendar } from '@ai/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@ai/components/ui/dialog';
import { useState, useActionState, useRef } from 'react';
import { cn, generateMeetCode } from '@ai/lib/utils';
import { Label } from '@ai/components/ui/label';
import { Copy, Loader2 } from 'lucide-react';
import { useToast } from '@ai/hooks/use-toast';
import React from 'react';
import { useUserStore } from '@ai/stores/user.store';
import { useRouter } from '@ai/i18n/routing';
import Header from '@ai/components/layout/header';
import { createInvitation, CreateInvitationResponse, saveInstantMeeting } from '@ai/actions/meet.action';
import { defaultStateAction } from '@ai/types/definitions';
import { subDays } from 'date-fns';

const initialActionState: defaultStateAction & CreateInvitationResponse = {
    message: '',
    status: 'error',
    meetCode: undefined,
};

export default function AppLayout() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string>(
        new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    );
    const [emails, setEmails] = useState<string>('');
    const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [meetingCodeOpen, setMeetingCodeOpen] = useState(false);
    const { toast } = useToast();
    const [joinCode, setJoinCode] = useState(''); // State for the join code input
    const { user } = useUserStore();
    const router = useRouter();
    const [state, formAction, pending] = useActionState(createInvitation, initialActionState);
    const resetBtnRef = useRef<HTMLButtonElement>(null);
    const [meetCreating, setMeetCreating] = useState(false);
    const [pendingJoinMeet, setPendingJoinMeet] = useState(false);

    const getLink = () => {
        return state.meetCode ? `${process.env.NEXT_PUBLIC_URL_ORIGIN}/meet/${state.meetCode}` : '';
    };

    const addEmail = () => {
        if (emails.trim() !== '' && !invitedEmails.includes(emails.trim())) {
            setInvitedEmails([...invitedEmails, emails.trim()]);
            setEmails(''); // Clear the input after adding
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setInvitedEmails(invitedEmails.filter((email) => email !== emailToRemove));
    };

    const copyToClipboard = async () => {
        if (state.meetCode) {
            await navigator.clipboard.writeText(getLink());
            toast({
                title: 'Copied!',
                description: 'Invitation link copied to clipboard.',
            });
        }
    };

    const copyCodeToClipboard = async () => {
        if (state.meetCode) {
            await navigator.clipboard.writeText(state.meetCode);
            toast({
                title: 'Copied!',
                description: 'Invitation code copied to clipboard.',
            });
        }
    };

    const handleEmailKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addEmail();
        }
    };

    const getFullDateTime = () => {
        if (!date) return undefined;
        const dateTime = new Date(date);
        const [hours, minutes] = time.split(':');
        if (!hours || !minutes) return undefined;
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        return dateTime.toISOString();
    };

    const handleJoinWithCode = () => {
        if (pendingJoinMeet) return;
        setPendingJoinMeet(true);
        // Redirect to the meeting link using the entered joinCode
        if (joinCode.length > 0) router.push(`/meet/${joinCode}`);
        if (state.meetCode) router.push(`/meet/${state.meetCode}`);
    };

    const handleDialogChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            resetBtnRef.current?.click();
            setDate(new Date());
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
            setEmails('');
            setInvitedEmails([]);
            setJoinCode('');
            setMeetingCodeOpen(false);
        }
    };

    const handleInstantMeeting = async () => {
        setMeetCreating(true);
        const meetGetCode = generateMeetCode();
        if (user) {
            const form = new FormData();
            form.append('code', meetGetCode);
            const response = await saveInstantMeeting(form);
            console.log(response);
        }
        router.push(`/meet/${meetGetCode}`);
    };

    return (
        <>
            <main className="flex flex-col relative items-center justify-center min-h-screen p-4 md:p-8 w-full overflow-x-hidden">
                <Header />

                {/* Hero Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">MeetAi</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Connect with anyone, anywhere, instantly.
                    </p>
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 justify-center">
                        <Button onClick={handleInstantMeeting} disabled={meetCreating}>
                            {meetCreating ? (
                                <>
                                    Creating...
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                'Start Instant Meeting'
                            )}
                        </Button>
                        {user && (
                            <Dialog open={open} onOpenChange={handleDialogChange}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        disabled={!user}
                                        className={!user ? 'disabled:cursor-not-allowed' : ''}
                                    >
                                        Schedule Meeting
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Schedule a Meeting</DialogTitle>
                                        <DialogDescription>
                                            Choose a date and time, and invite attendees.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form action={formAction} className="grid gap-4 py-4">
                                        {!state.meetCode ? (
                                            <>
                                                {!pending && (
                                                    <p
                                                        className={cn(
                                                            state.status === 'ok' ? 'text-green-400' : 'text-red-400',
                                                        )}
                                                    >
                                                        {state.message}
                                                    </p>
                                                )}
                                                <div className="grid gap-2">
                                                    <Calendar
                                                        mode="single"
                                                        className="mx-auto"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        disabled={(date) => date < subDays(new Date(), 1)}
                                                        initialFocus
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="start_date"
                                                        value={getFullDateTime()}
                                                        onChange={() => {}}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="time">Time</Label>
                                                    <Input
                                                        type="time"
                                                        id="time"
                                                        defaultValue={time}
                                                        className="w-[240px]"
                                                        onChange={(e) => setTime(e.target.value)}
                                                    />
                                                </div>
                                                {!user && (
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="emails">Invite Attendee</Label>
                                                        <div className="flex flex-row space-x-2">
                                                            <Input
                                                                type="email"
                                                                id="emails"
                                                                placeholder="name@example.com"
                                                                value={emails}
                                                                onChange={(e) => setEmails(e.target.value)}
                                                                onKeyDown={handleEmailKeyDown}
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="h-full"
                                                                size="sm"
                                                                onClick={addEmail}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid gap-2">
                                                    <Label htmlFor="emails">Invite Attendee</Label>

                                                    <div className="flex flex-row space-x-2">
                                                        <Input
                                                            type="email"
                                                            id="emails"
                                                            placeholder="name@example.com"
                                                            value={emails}
                                                            onChange={(e) => setEmails(e.target.value)}
                                                            onKeyDown={handleEmailKeyDown}
                                                        />
                                                        <Button
                                                            type="button"
                                                            className="h-full"
                                                            size="sm"
                                                            onClick={addEmail}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                                {invitedEmails.length > 0 && (
                                                    <div>
                                                        <Label>Invited</Label>
                                                        <div className="flex flex-wrap gap-1">
                                                            {invitedEmails.map((email) => (
                                                                <div
                                                                    key={email}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <span>{email}</span>
                                                                    <input
                                                                        type="hidden"
                                                                        name="invited_emails[]"
                                                                        value={email}
                                                                    />
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="icon"
                                                                        onClick={() => removeEmail(email)}
                                                                    >
                                                                        x
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                <Button type="submit" disabled={pending}>
                                                    {pending ? (
                                                        <>
                                                            Scheduling...
                                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                                        </>
                                                    ) : (
                                                        'Schedule'
                                                    )}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="inviteLink">Invitation Link</Label>
                                                    <input type="hidden" name="state" value="reset" />
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="inviteLink"
                                                            className="cursor-not-allowed"
                                                            value={getLink()}
                                                            disabled
                                                        />
                                                        <Button onClick={copyCodeToClipboard} type="button">
                                                            <Copy /> Code
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Button onClick={copyToClipboard} type="button">
                                                    <Copy /> Copy Link
                                                </Button>
                                                <Button
                                                    onClick={handleJoinWithCode}
                                                    disabled={pendingJoinMeet}
                                                    type="button"
                                                >
                                                    {pendingJoinMeet ? (
                                                        <>
                                                            Joining...
                                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                                        </>
                                                    ) : (
                                                        'Join now'
                                                    )}
                                                </Button>
                                                <Button className="hidden sr-only" type="submit" ref={resetBtnRef}>
                                                    Close
                                                </Button>
                                            </>
                                        )}
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Dialog open={meetingCodeOpen} onOpenChange={setMeetingCodeOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className={!user ? 'disabled:cursor-not-allowed' : ''}>
                                    Enter meeting code
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <div className="">
                                    <DialogHeader>
                                        <DialogTitle>Join Meeting with Code</DialogTitle>
                                        <DialogDescription>
                                            Enter the meeting code to join the meeting.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>

                                <div className="grid gap-4 py-4">
                                    <Label htmlFor="meetingCode">Meeting Code</Label>
                                    <Input
                                        type="text"
                                        id="meetingCode"
                                        placeholder="Enter meeting code"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleJoinWithCode} disabled={pendingJoinMeet}>
                                    {pendingJoinMeet ? (
                                        <>
                                            Joining...
                                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        'Join Meeting'
                                    )}
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>

                {/* Features Section */}

                {/*
                    Easy to Use
                    Intuitive interface for seamless video conferencing.
                */}

                {/*
                    Secure Meetings
                    End-to-end encryption for secure communication.
                */}

                {/*
                    High Quality Video
                    Crystal clear video and audio for productive meetings.
                */}
            </main>
        </>
    );
}
