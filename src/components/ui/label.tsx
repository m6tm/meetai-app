/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@minds/lib/utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
