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
import { format } from "date-fns"
import { cn } from "@lib/utils"
import { Calendar } from "@ui/calendar"
import { useToast } from "@hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"

const ScheduleMeetingDialog = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const [scheduleDate, setScheduleDate] = React.useState<Date>();
  const [scheduling, setScheduling] = React.useState<boolean>(false);
  const closeModalButtonRef = React.useRef<HTMLButtonElement>(null);
  const { toast } = useToast()

  async function handleScheduleMeeting() {
        setScheduling(true);
        setTimeout(() => {
          setScheduling(false);
          toast({
                title: 'Réunion programmée',
                description: `Votre réunion a été programmée pour le ${format(scheduleDate!, 'PPP')}.`,
          })
        }, 3000);
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} {...props} ref={ref} className='hidden'>Ouvrir la boite modale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Programmer une réunion</DialogTitle>
          <DialogDescription>
            Définir une date et un temps pour votre réunion. Nous vous enverrons un e-mail de rappel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {
              scheduling ? (
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )
            }
          </div>
        </div>
        <DialogFooter>
          <Button variant={'secondary'} disabled={!scheduleDate || scheduling} onClick={handleScheduleMeeting}>
            {
              scheduling && <Loader2 className="animate-spin" />
            }
            Programmer mainenant
          </Button>
          <DialogClose asChild>
            <Button variant={'secondary'} className='hidden' ref={closeModalButtonRef}>close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
});

ScheduleMeetingDialog.displayName = 'ScheduleMeetingDialog';

export default ScheduleMeetingDialog;