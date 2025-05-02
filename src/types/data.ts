/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

export type TService = {
    id: number;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    link: string;
};

export type TServiceCollection = Array<TService>;

export type TTestimonial = {
    id: number;
    name: string;
    avatar: string;
    star: number;
    testimonial: string;
};

export type TTestimonialCollection = Array<TTestimonial>;

export type TMeetRole = 'admin' | 'moderator' | 'guest';

export type TParticipantMetadata = {
    joined: 'yes' | 'no';
    pinned: 'no' | 'yes';
    upHand: 'no' | 'yes';
    canMessage: 'no' | 'yes';
    avatar: string;
    role: TMeetRole;
};
