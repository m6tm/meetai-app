/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { PrismaClient } from "@prisma/client";
import { cache } from "react";

/**
 * Creates and caches a new PrismaClient instance.
 * This ensures only one PrismaClient is created for the application lifecycle.
 * 
 * @returns {PrismaClient} A cached instance of PrismaClient
 * @example
 * const prisma = getPrisma()
 */
export const getPrisma = cache(() => new PrismaClient())
