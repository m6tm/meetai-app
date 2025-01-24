/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Meet ai LLC. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Meet ai LLC. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Meet ai LLC.
 */

import { TServiceCollection, TTestimonialCollection } from '@ai/types/data';

const SERVICES: TServiceCollection = [
    {
        id: 1,
        title: 'Build your website',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: '/services/service-1.jpg',
        link: '/',
    },
    {
        id: 2,
        title: 'Client support AI',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: '/services/service-2.jpg',
        link: '/',
    },
    {
        id: 3,
        title: 'Build your SaSS',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: '/services/service-3.jpg',
        link: '/',
    },
    {
        id: 4,
        title: 'Build your mobile Apps',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: '/services/service-4.jpg',
        link: '/',
    },
];

const TESTIMONIALS: TTestimonialCollection = [
    {
        id: 1,
        name: 'John Doe',
        avatar: '/testimonials/avatar-1.jpg',
        star: 5,
        testimonial:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        id: 2,
        name: 'John Doe',
        avatar: '/testimonials/avatar-2.jpg',
        star: 5,
        testimonial:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        id: 3,
        name: 'John Doe',
        avatar: '/testimonials/avatar-3.jpg',
        star: 5,
        testimonial:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
];

const PEER_CONFIG = {
    iceServers: [{
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    },
    {
        url: 'turn:turn.bistri.com:80',
        credential: 'homeo',
        username: 'homeo'
    },
    {
        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
    },
    {
        urls: [
            "turn:13.250.13.83:3478?transport=udp"
        ],
        username: "YzYNCouZM1mhqhmseWk6",
        credential: "YzYNCouZM1mhqhmseWk6"
    }
    ]
}

const CONSTRAINS = (audio_mode: boolean, video_mode: boolean, call_id: string, facing_mode: 'user' | 'environment' = 'user') => ({
    audio: audio_mode,
    video: video_mode,
    groupId: call_id,
    echoCancellation: true,
    noiseSuppression: true,
    facingMode: { exact: facing_mode },
    width: { min: 640, ideal: 1280 },
    height: { min: 480, ideal: 720 },
    advanced: [
        { width: 1920, height: 1280 },
        { aspectRatio: 1.333 }
    ]
})

export { SERVICES, TESTIMONIALS, PEER_CONFIG, CONSTRAINS };
