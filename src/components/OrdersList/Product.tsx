/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import styles from "./OrdersList.module.scss";
import { ProductType } from "./types";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ModalAuth from "../ModalAuth/ModalAuth";
import MyButton from "../UI/MyInput/MyButton";
import Modal from "../Modal/Modal";
import RateForm from "../Forms/RateForm";

const Product = ({ product, setOrder, inBasket }: any) => {
    const [modalActive, setModalActive] = useState<boolean>(false);

    const router = useRouter();    

    const getStars = (rate: number): ReactNode => {
        const stars: ReactNode[] = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= rate) {
                stars.push(<img src="/reviews/star-rated.svg" alt="star img" />);
            } else {
                stars.push(<img src="/reviews/star.svg" alt="star img" />);
            }
        }

        return stars;
    };

    const openRate = () => {
        setModalActive(true);
    };

    return (
        <article
            className={`${styles["order__product"]} ${
                inBasket && `${styles["order__product--basket"]}`
            }`}>
            <Link href={`/product/${product?.product?.id}`}>
                <img
                    src={`/products/${product?.product?.image}`}
                    alt="product image"
                    className={`${styles["orders__product-img"]} ${styles["order__product-img"]} ${
                        inBasket && `${styles["order__product-img--basket"]}`
                    }`}
                />
            </Link>
            <div className={`${styles["order__product-content"]}`}>
                <Link
                    href={`/product/${product?.product?.id}`}
                    className={`${styles["order__info-text"]} ${styles["orders__info-title"]}`}>
                    {product?.product?.name}
                </Link>
                <div className={`${styles["order__content-container"]} ${inBasket && `${styles["order__content-container--basket"]}`}`}>
                    <p className={`${styles["order__info-label"]}`}>{product?.quantity} шт</p>
                    {product?.product?.productRating?.length ? (
                        <div className={`${styles["order__star-container"]} ${styles["order__star-container--basket"]}`}>
                            {getStars(product?.product?.productRating[0]?.rate)}
                        </div>
                    ) : (
                        setOrder && <MyButton onClick={() => openRate()}>Оценить товар</MyButton>
                    )}
                </div>
                {inBasket && (
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--small"]}`}>
                        Товар: {(product?.product?.price * product?.quantity).toLocaleString()} ₽ Доставка:{" "}
                        {Number(1000).toLocaleString()} ₽
                    </p>
                )}
            </div>
            {!inBasket && (
                <p className={`${styles["order__info-text"]}`}>
                    {product?.product?.price?.toLocaleString()} ₽
                </p>
            )}

            {setOrder && (
                <Modal active={modalActive} setActive={setModalActive}>
                    <RateForm
                        productId={product?.product?.id}
                        setActive={setModalActive}
                        setOrder={setOrder}
                        orderId={product?.idOrder}
                    />
                </Modal>
            )}
        </article>
    );
};

export default Product;
