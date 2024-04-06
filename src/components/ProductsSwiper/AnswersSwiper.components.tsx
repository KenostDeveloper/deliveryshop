'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import styles from './ProductsSwiper.module.css'

import {Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const AnswerSwiper = ({answers}:any) => {
    return (
        <Swiper
            className='padding-swiper'
            modules={[Pagination, Autoplay]}
            spaceBetween={8}
            slidesPerView={3.5}
            loop={true}
            // autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                575: {
                    slidesPerView: 1.5,
                },
                // when window width is >= 640px
                768: {
                    slidesPerView: 2.5,
                },
                // when window width is >= 768px
                1001: {
                    slidesPerView: 3,
                },
                1201: {
                    slidesPerView: 3.5,
                }
            }}
        >

            {answers.map((answer: any) => (
                <SwiperSlide key={answer.id}>
                    <div className={styles.answer}>
                        <div className={styles.answerTop}>
                            <img src={answer.photo} alt="" />
                            <p>{answer.name}</p>
                        </div>
                        <p className={styles.text}>{answer.text}</p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default AnswerSwiper;