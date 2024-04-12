"use client";
import React, { useEffect, useState } from "react";
import style from "./ProductCard.module.scss";
import Link from "next/link";
import axios from "axios";
import { useBasketContext } from "../Helps/GlobalBasket";
import { useSession } from "next-auth/react";

const ProductCard = ({ item, slider, isHomePage }: any) => {
    const { data: session, update } = useSession();
    const [image, setImage] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [isBasket, setIsBasket] = useState(false);

    const { basket, setBasket } = useBasketContext();

    // useEffect(() => {
    //     for(let i = 0; i < item.image.length; i++){
    //         image.push(`/product/${item.image[i]?.name}`)
    //     }
    //     // item.image?.map((img : any) => image.push(`/product/${img.name}`))
    //     setLoading(false)
    // }, [])

    useEffect(() => {
        //Проверка товара в корзине пользователя
        let temp = false;
        for (let i = 0; i < basket?.length; i++) {
            if (basket[i].id_product == item.id) {
                temp = true;
                break;
            }
        }
        if (temp) {
            setIsBasket(true);
        } else {
            setIsBasket(false);
        }
    }, [basket]);

    //Добавление в корзину
    const addToBasket = async () => {
        const formData = new FormData();
        formData.append("id_product", item.id);
        formData.append("quantity", "1");
        setIsBasket(true);

        axios.post(`/api/basket`, formData).then((res) => {
            if (!res.data.success) {
                setIsBasket(false);
            }
        });
    };

    return (
        <div className={slider == true ? `${style.width} ${style.ProductCard}` : `${style.ProductCard}`}>
            <Link className={style.ProductCardImage} href={`/product/${item.id}`}>
                <img src={`/products/${item.image}`} alt="" />
            </Link>

            <div className={`${style.ProductCardText}`}>
                <Link href={`/product/${item.id}`}>
                    <p>{item?.name}</p>
                </Link>
                <div className={`${style.ProductCardPrice} ${isHomePage && style.ProductCardPrice_Home}`}>
                    <b>{(item?.price).toLocaleString()} ₽</b>
                    {!session || session?.user.role === "BUYER" && (
                        <>
                            {!isBasket ? (
                                <button onClick={() => addToBasket()}>В корзину</button>
                            ) : (
                                <button className={style.btnActive}>В корзине</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
