/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from "@ui/button"
import { Label } from "@ui/label"
import { Input } from "@ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog"
import { format, subDays } from "date-fns"
import { cn } from "@lib/utils"
import { Calendar } from "@ui/calendar"
import { useToast } from "@hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"
import { Calendar as CalendarIcon, Check, Copy, Loader2 } from "lucide-react"
import { SelectMultiple } from '../ui/select-multiple';
import { saveInvitation } from '@ai/actions/meet.action';
import { useUserStore } from '@ai/app/stores/user.store';

const ScheduleMeetingDialog = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>(undefined);
  const [scheduleHour, setScheduleHour] = React.useState<string>('');
  const [scheduling, setScheduling] = React.useState<boolean>(false);
  const [scheduled, setScheduled] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [meetingLink, setMeetingLink] = React.useState<string>('');
  const [guests, setGuests] = React.useState<string[]>([]);
  const { toast } = useToast()
  const { user } = useUserStore()

  async function handleScheduleMeeting() {
    if (!user || !user.email) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour programmer une réunion.'
      });
      return;
    }
    setScheduling(true);
    const code_link = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const _meetingLink = `${process.env.NEXT_PUBLIC_URL_ORIGIN}/join/${code_link}`;

    const startDate = scheduleDate ? new Date(scheduleDate) : undefined;
    const [hours, minutes] = scheduleHour.split(':');
    if (scheduleHour.length > 0 && startDate) startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const response = await saveInvitation(code_link, guests, user.email, startDate);
    console.log(response);
    
    setMeetingLink(_meetingLink);
    setTimeout(() => {
      setScheduling(false);
      setScheduled(true)
      toast({
            title: 'Réunion programmée',
            description: `Votre réunion a été programmée pour le ${format(startDate!, 'PPP')} à ${scheduleHour}.`,
      })
    }, 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function dialogDisplayTrigger(open: boolean) {
    if (open) {
      setScheduleDate(undefined);
      setMeetingLink('');
      setScheduled(false);
    }
  }
  
  return (
    <Dialog onOpenChange={dialogDisplayTrigger}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} {...props} ref={ref} className='hidden'>Ouvrir la boite modale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {
              !scheduled ? 'Programmer une réunion' : 'Partager le lien'
            }
          </DialogTitle>
          <DialogDescription>
            {
              !scheduled ? (
                'Définir une date et un temps pour votre réunion. Nous vous enverrons un e-mail de rappel.'
              ) : (
                'Toutes les personnes ayant ce lien et les droits d\'accès pourront accéder.'
              )
            }
          </DialogDescription>
        </DialogHeader>
        {
          !scheduled ? (
            <form action="">
              <div className="py-4 w-full">
                <div className="flex items-start justify-start flex-col w-full space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !scheduleDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? format(scheduleDate, "PPP") : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        disabled={(date) => date < subDays(new Date(), 1)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className='ms-4'>&Agrave;</span>
                  <Input type='time' value={scheduleHour} onChange={e => setScheduleHour(e.target?.value)} name='time' className='w-32' />
                  <SelectMultiple 
                    options={[
                      { label: 'Madelxp', value: 'madelxp@gmail.com' },
                      { label: 'John Doe', value: 'john.doe@example.com' },
                      { label: 'Jane Smith', value: 'jane.smith@example.com' },
                      { label: 'Alice Johnson', value: 'alice.johnson@example.com' },
                      { label: 'Bob Brown', value: 'bob.brown@example.com' },
                    ]}
                    placeholder="Ajouter une personne (optionnel)"
                    onChange={(values) => setGuests(values)}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  value={meetingLink}
                  readOnly
                />
              </div>
              <Button type="submit" size="sm" onClick={copyLink} className="px-3">
                <span className="sr-only">Copy</span>
                {
                  copied ? (
                    <Check />
                  ) : (
                    <Copy />
                  )
                }
              </Button>
            </div>
          )
        }
        {
          !scheduled ? (
            <DialogFooter>
              <Button variant={'secondary'} disabled={!scheduleDate || scheduleHour.length === 0 || scheduling} onClick={handleScheduleMeeting}>
                {
                  scheduling && <Loader2 className="animate-spin" />
                }
                Programmer mainenant
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                  <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          )
        }
      </DialogContent>
    </Dialog>
  )
});

ScheduleMeetingDialog.displayName = 'ScheduleMeetingDialog';

export default ScheduleMeetingDialog;