/**
 * Proprietary and Confidential
 * Copyright (c) 2024 Microminds Tech Ltd. All rights reserved.
 *
 * This software and its documentation are the exclusive property of
 * Microminds Tech Ltd. No part of this software may be reproduced,
 * distributed, or transmitted in any form or by any means without
 * the prior written permission of Microminds Tech Ltd.
 */
'use client';

import { Carousel, CarouselContent, CarouselItem } from '@ai/components/ui/carousel';
import { TESTIMONIALS } from '@ai/utils/constants';
import { Quote, Star, StarHalf } from 'lucide-react';
import Image from 'next/image';
import { isInteger } from 'lodash';
import Autoplay from 'embla-carousel-autoplay';

export default function Testimonials() {
    function displayStar(star: number) {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < star) {
                stars.push(<Star key={i} className="text-yellow-500" />);
            } else {
                stars.push(<Star key={i} className="text-gray-300" />);
            }
        }

        if (!isInteger(star)) {
            const indexOfFirstBlankStar = stars.findIndex((star) => star.props.className === 'text-gray-300');
            if (indexOfFirstBlankStar !== -1) {
                stars[indexOfFirstBlankStar - 1] = (
                    <StarHalf key={indexOfFirstBlankStar - 1} className="text-yellow-500" />
                );
            } else {
                stars[stars.length - 1] = <StarHalf key={stars.length - 1} className="text-yellow-500" />;
            }
        }
        return stars;
    }

    return (
        <div className="py-10 my-10">
            <h3 className="text-center text-2xl font-bold uppercase">Testimonials</h3>
            <div className="w-full flex flex-col mt-10">
                <Carousel
                    className="w-full md:w-1/2 lg:mx-auto h-[250px]"
                    plugins={[Autoplay({ delay: 5000, stopOnInteraction: false, stopOnFocusIn: false })]}
                >
                    <CarouselContent className="h-[250px]">
                        {TESTIMONIALS.map((testimonial) => (
                            <CarouselItem key={testimonial.id} className="flex items-center select-none">
                                <div className="flex flex-col space-y-1 p-2">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        width={100}
                                        height={100}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <h3 className="text-lg capitalize font-bold flex items-center">
                                        {testimonial.name}
                                        <div className="flex items-center space-x-2 ms-2">
                                            {displayStar(testimonial.star)}
                                        </div>
                                    </h3>
                                    <div className="flex items-start space-x-2">
                                        <Quote className="size-20 lg:size-8 text-neutral-500" />
                                        <p className="text-sm line-clamp-4 mt-2">{testimonial.testimonial}</p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}
