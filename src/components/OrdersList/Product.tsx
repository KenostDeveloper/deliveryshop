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

const Product = ({ product, setOrder, inBasket, index, pathResult }: any) => {
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
                <div
                    className={`${styles["order__content-container"]} ${
                        inBasket && `${styles["order__content-container--basket"]}`
                    }`}>
                    <p className={`${styles["order__info-label"]}`}>{product?.quantity} шт</p>
                    {product?.product?.rating ? (
                        <div
                            className={`${styles["order__star-container"]} ${styles["order__star-container--basket"]}`}>
                            {getStars(product?.product?.rating?.rate)}
                        </div>
                    ) : (
                        setOrder && <MyButton onClick={() => openRate()}>Оценить товар</MyButton>
                    )}
                </div>
                {inBasket && (
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--small"]}`}>
                        Товар: {(product?.product?.price * product?.quantity).toLocaleString()} ₽
                        {pathResult[index]?.path &&
                            `Доставка: ${Number(pathResult[index]?.all_cost).toLocaleString()} ₽`}
                    </p>
                )}
                {inBasket && pathResult[index]?.path && (
                    <p className={`${styles["order__info-label"]}`}>
                        Из{" "}
                        {String(pathResult[index]?.count_path).endsWith("1")
                            ? `${pathResult[index]?.count_path} склада`
                            : `${pathResult[index]?.count_path} складов`}{" "}
                        мы доставим за{" "}
                        {pathResult[index]?.all_duration < 24
                            ? `${
                                  pathResult[index]?.all_duration == 1
                                      ? pathResult[index]?.all_duration + " час"
                                      : pathResult[index]?.all_duration >= 5
                                      ? pathResult[index]?.all_duration + " часов"
                                      : pathResult[index]?.all_duration + " часа"
                              }`
                            : `${
                                  Math.floor(pathResult[index]?.all_duration / 24) == 1
                                      ? Math.floor(pathResult[index]?.all_duration / 24) + " день"
                                      : Math.floor(pathResult[index]?.all_duration / 24) + " дня"
                              }`}{" "}
                        ({pathResult[index]?.all_length} км)
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
