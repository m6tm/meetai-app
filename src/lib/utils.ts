/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
