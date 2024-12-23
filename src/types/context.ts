/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { MEET_PANEL_TYPE } from "@ai/enums/meet-panel";

export type TAppContext = {
    meetPanel: MEET_PANEL_TYPE,
    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => void,
}