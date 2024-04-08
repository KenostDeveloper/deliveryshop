"use client";

import { useRouter } from "next/navigation";
import Title from "../UI/Title.components";
import styles from "./OrdersList.module.scss";
import { OrderType } from "./types";

const Order = ({ order }: { order: OrderType }) => {

    const router = useRouter();

    const dateFormated = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(order.date);

    const productsPrice = order.products.reduce((acc, item) => (acc += item.price), 0);

    return (
        <section className={`${styles["order"]} container`}>
            <div className={`${styles["order__top-side"]}`}>
                <div className={`${styles["order__top-side-block"]}`}>
                    <button onClick={() => router.back()} className={`${styles["order__button"]}`}>
                        <img src="/arrow-right.svg" alt="arrow image" />
                    </button>
                    <div className={`${styles["order__title-container"]}`}>
                        <h1 className={`${styles["order__title"]}`}>Заказ #{order.number}</h1>
                        <p className={`${styles["order__date"]}`}>от {dateFormated}</p>
                    </div>
                </div>
                <div className={`${styles["order__top-side-block"]}`}>
                    <button className={`${styles["order__button"]}`}>Отменить заказ</button>
                </div>
            </div>
            <div className={`${styles["order__info-container"]}`}>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Статус</p>
                    <p className={`${styles["order__info-text"]}`}>{order.status}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>ФИО</p>
                    <p className={`${styles["order__info-text"]}`}>{order.user}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Способ доставки</p>
                    <p className={`${styles["order__info-text"]}`}>{order.deliveryMethod}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Способ оплаты</p>
                    <p className={`${styles["order__info-text"]}`}>{order.paymentMethod}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Телефон</p>
                    <p className={`${styles["order__info-text"]}`}>{order.telephone}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>E-mail</p>
                    <p className={`${styles["order__info-text"]}`}>{order.email}</p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Адрес</p>
                    <p className={`${styles["order__info-text"]}`}>{order.address}</p>
                </div>
            </div>
            <div className={`${styles["order__price-container"]}`}>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Товары ({order.products.length})
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {productsPrice}₽
                    </p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Доставка
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {order.deliveryPrice}₽
                    </p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Итого
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {productsPrice + order.deliveryPrice}₽
                    </p>
                </div>
            </div>
            <div className={`${styles["order__products-container"]}`}>
                {order.products.map((product, index) => {
                    return (
                        <article className={`${styles["order__product"]}`} key={index}>
                            <img
                                src={product.image}
                                alt="product image"
                                className={`${styles["orders__product-img"]} ${styles["order__product-img"]}`}
                            />
                            <div className={`${styles["order__product-content"]}`}>
                                <p className={`${styles["order__info-text"]}`}>{product.name}</p>
                                <p className={`${styles["order__info-label"]}`}>
                                    {product.count} шт
                                </p>
                            </div>
                            <p
                                className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                                {product.price * product.count}₽
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default Order;
