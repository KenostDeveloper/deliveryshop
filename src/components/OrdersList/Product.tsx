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

const Product = ({ product, setOrder }: { product: any; setOrder: any }) => {
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
        <article className={`${styles["order__product"]}`}>
            <Link href={`/products/${product?.product?.id}`}>
                <img
                    src={`/products/${product?.product?.image}`}
                    alt="product image"
                    className={`${styles["orders__product-img"]} ${styles["order__product-img"]}`}
                />
            </Link>
            <div className={`${styles["order__product-content"]}`}>
                <Link
                    href={`/products/${product?.product?.id}`}
                    className={`${styles["order__info-text"]} ${styles["orders__info-title"]}`}>
                    {product?.product?.name}
                </Link>
                <p className={`${styles["order__info-label"]}`}>{product?.count} шт</p>
                {product.product.rating ? (
                    <div className={`${styles["order__star-container"]}`}>
                        {getStars(product.product.rating.rate)}
                    </div>
                ) : (
                    <MyButton onClick={() => openRate()}>Оценить товар</MyButton>
                )}
            </div>
            <p className={`${styles["order__info-text"]}`}>{product?.price?.toLocaleString()} ₽</p>

            <Modal active={modalActive} setActive={setModalActive}>
                <RateForm
                    productId={product?.product?.id}
                    setActive={setModalActive}
                    setOrder={setOrder}
                    orderId={product?.idOrder}
                />
            </Modal>
        </article>
    );
};

export default Product;
