'use client'
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import styles from './ProductsSwiper.module.css'

import {Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from '../ProductCard/ProductCatd.components';


const ProductsSwiper = ({products}:any) => {
    return (
        <Swiper
            className='padding-swiper'
            modules={[Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={2}
            loop={true}
            // autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
                0: {
                    slidesPerView: 1.5,
                },
                400: {
                    slidesPerView: 2.2,
                },
                575: {
                    slidesPerView: 2.3,
                },
                // when window width is >= 640px
                768: {
                    slidesPerView: 3,
                },
                // when window width is >= 768px
                1001: {
                    slidesPerView: 3.8,
                },
                1201: {
                    slidesPerView: 4.8,
                }
            }}
        >

            {products?.map((product: any) => (
                <SwiperSlide key={product.id}>
                    <ProductCard slider={true} item={product}/>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default ProductsSwiper;