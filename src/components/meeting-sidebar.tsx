/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import Link from "next/link";
import React from "react";

export default function MeetingSideBar() {
    return (
        <div className="flex flex-col h-full w-64 mt-5">
            <nav className="flex-1 overflow-y-auto">
                <ul className="p-2 space-y-2">
                    <li className="p-2 active duration-200 hover:bg-secondary/50 font-bold rounded cursor-pointer">
                        <Link href="/">Réunions</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}