/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function GithubSignIn({ handleSignIn }: { handleSignIn: () => void }) {
    return (
        <Button variant={'ghost'} onClick={handleSignIn}>
            <Image src={'/images/github.png'} alt="google icon" width={24} height={24} />
            Connexion Github
        </Button>
    );
}