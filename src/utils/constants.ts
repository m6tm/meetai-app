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
    iceServers: [
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com',
        },
        {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808',
        },
        {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808',
        },
        {
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo',
        },
        {
            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc',
        },
        {
            urls: ['turn:13.250.13.83:3478?transport=udp'],
            username: 'YzYNCouZM1mhqhmseWk6',
            credential: 'YzYNCouZM1mhqhmseWk6',
        },
    ],
};

const CONSTRAINS = (
    audio_mode: boolean,
    video_mode: boolean,
    call_id: string,
    facing_mode: 'user' | 'environment' = 'user',
) => ({
    audio: audio_mode,
    video: video_mode,
    groupId: call_id,
    echoCancellation: true,
    noiseSuppression: true,
    facingMode: { exact: facing_mode },
    width: { min: 640, ideal: 1280 },
    height: { min: 480, ideal: 720 },
    advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
});

const MESSAGES = [
    {
        message: "Bonjour à tous !",
        from: "John Doe",
        timestamp: 1678901234567,
    },
    {
        message: "Comment allez-vous aujourd'hui ?",
        from: "Marie Dubois",
        timestamp: 1678901234568,
    },
    {
        message: "La réunion commence dans 5 minutes",
        from: "Pierre Martin",
        timestamp: 1678901234569,
    },
    {
        message: "J'ai partagé le document dans le chat",
        from: "Sophie Bernard",
        timestamp: 1678901234570,
    },
    {
        message: "Merci pour le partage",
        from: "Lucas Petit",
        timestamp: 1678901234571,
    },
    {
        message: "Pouvez-vous activer votre caméra ?",
        from: "Emma Leroy",
        timestamp: 1678901234572,
    },
    {
        message: "Est-ce que tout le monde peut voir mon écran ?",
        from: "Thomas Roux",
        timestamp: 1678901234573,
    },
    {
        message: "Oui, c'est parfait",
        from: "Julie Moreau",
        timestamp: 1678901234574,
    },
    {
        message: "On fait une pause dans 15 minutes",
        from: "Nicolas Garcia",
        timestamp: 1678901234575,
    },
    {
        message: "D'accord pour la pause",
        from: "Clara Simon",
        timestamp: 1678901234576,
    },
    {
        message: "J'ai une question sur le projet",
        from: "Antoine Durand",
        timestamp: 1678901234577,
    },
    {
        message: "Je note tous les points importants",
        from: "Sarah Lefebvre",
        timestamp: 1678901234578,
    },
    {
        message: "Excellent travail d'équipe !",
        from: "Paul Robert",
        timestamp: 1678901234579,
    },
    {
        message: "On se revoit demain même heure",
        from: "Léa Michel",
        timestamp: 1678901234580,
    },
    {
        message: "Merci à tous pour votre participation",
        from: "David Laurent",
        timestamp: 1678901234581,
    }
];

const DEFAULT_AVATAR = 'https://picsum.photos/id/11/100/100';

export { SERVICES, TESTIMONIALS, PEER_CONFIG, CONSTRAINS, DEFAULT_AVATAR, MESSAGES };
