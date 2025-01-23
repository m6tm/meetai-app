/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { MEDIA_CONTROL_TYPE, MEET_PANEL_TYPE } from "@ai/enums/meet-panel";
import Worker from "@ai/worker/worker";
import { User } from "firebase/auth";

export type TAppContext = {
    meetPanel: MEET_PANEL_TYPE,
    setMeetPanel: (meetPanel: MEET_PANEL_TYPE) => void,
    autoriseMessage: boolean,
    setAutoriseMessage: (autoriserMessage: boolean) => void,
    mediaControl: MEDIA_CONTROL_TYPE,
    setMediaControl: (mediaControl: MEDIA_CONTROL_TYPE) => void,
    user: User | null,
    googleSignIn: () => Promise<void>,
    githubSignIn: () => Promise<void>,
    logOut: () => Promise<void>,
    worker: Worker | null,
    setWorker: (worker: Worker) => void,
}