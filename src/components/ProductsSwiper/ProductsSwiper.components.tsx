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
                    {/* <div className={styles.slidePortfilio}>
                        <img className={styles.slidePortfilioImg} src={`/portfolio/${port.image}`} alt="" />
                        <svg className={styles.slidePortfilioPlay} width="73" height="77" viewBox="0 0 73 77" xmlns="http://www.w3.org/2000/svg">
                            <path d="M65.0888 23.2731C73.5123 27.065 74.6722 38.5536 67.1766 43.9526L24.904 74.4015C17.4084 79.8005 6.87901 75.0607 5.95109 65.8698L0.717935 14.0362C-0.209983 4.84534 9.15949 -1.90348 17.583 1.88836L65.0888 23.2731Z"/>
                        </svg>
                    </div> */}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default ProductsSwiper;