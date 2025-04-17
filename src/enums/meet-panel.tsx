/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

export enum MEET_PANEL_TYPE {
    NONE = -1,
    INFOS = 0,
    USERS = 1,
    MESSAGES = 2,
}

export enum MEDIA_CONTROL_TYPE {
    NONE = -1,
    VIDEO = 0,
    AUDIO = 1,
}

export enum MeetRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    GUEST = "guest",
}
