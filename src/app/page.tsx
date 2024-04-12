"use client";
import Image from "next/image";
import CardPost from "@/components/CardPost/CardPost";
import Banner from "@/components/Banner/Banner";
import CardsSlider from "@/components/CardsSlider/CardsSlider";
import ProductsSwiper from "@/components/ProductsSwiper/ProductsSwiper.components";
import styles from "../style/Home.module.scss";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import Title from "@/components/UI/Title.components";
import Catalog from "@/components/Catalog/Catalog";
import Advantages from "@/components/Advantages/Advantages";
import NotFound from "@/components/NotFound/NotFound";
import RateForm from "@/components/Forms/RateForm";
import axios from "axios";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const { data: session, update } = useSession();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log(session);
    });

    useEffect(() => {
        axios
            .get("/api/products?limit=10")
            .then((res) => res.data)
            .then((data) => {
                setProducts(data?.product);                
            });
    }, []);

    useEffect(() => {
        if (typeof session == "object") {
            setLoading(false);
        }
    }, [session]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={styles.ListPost}>
            <div className="container">
                <Banner />

                <Title text="Популярные товары" margin={true} />
                <ProductsSwiper products={products} isHomePage={true} />

                <Title text="Каталог" margin={true} />
                <Catalog />

                <Title text="Акции" margin={true} />
                <ProductsSwiper products={products} isHomePage={true} />

                <Title text="Наши преимущества" margin={true} />
                <Advantages />

                {/* <Title text="Отзывы клиентов" margin={true} /> */}
                {/* Здесь будут отзывы клиентов */}
            </div>

            {/*Изменить данные сессии*/}
            {/*<div onClick={() => update({ username: "kenostru" })}>Имя = kenostru</div>*/}

            {/*<div>{session?.user? `${session?.user?.username}` : ""}</div>*/}
        </div>
    );
}
