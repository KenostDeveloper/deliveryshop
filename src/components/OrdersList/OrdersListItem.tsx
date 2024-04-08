"use client";

import { useRouter } from "next/navigation";
import Title from "../UI/Title.components";
import styles from "./OrdersList.module.scss";
import { OrderType } from "./types";

const OrdersListItem = ({ order }: { order: OrderType }) => {

    const router = useRouter();

    const dateFormated = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(order.date);

    return (
        <article className={`${styles["orders__item"]}`} onClick={() => router.push(`/orders/${order.number}`)}>
            <div className={`${styles["orders__info"]}`}>
                <div className={`${styles["orders__info-block"]}`}>
                    <p className={`${styles["orders__info-title"]}`}>
                        Заказ от {dateFormated}{" "}
                        <span className={`${styles["orders__info-number"]}`}># {order.number}</span>
                    </p>
                    <p className={`${styles["orders__info-title"]}`}>
                        {order.products.reduce((acc, item) => (acc += item.price), 0)}₽
                    </p>
                </div>
                <div className={`${styles["orders__info-block"]}`}>
                    <p className={`${styles["orders__info-text"]}`}>{order.deliveryMethod}</p>
                    <p className={`${styles["orders__info-text"]}`}>{order.status}</p>
                </div>
            </div>
            <div className={`${styles["orders__products"]}`}>
                {order.products.map((product, index) => {
                    return (
                        <article className={`${styles["orders__product"]}`} key={index}>
                            <img
                                src={product.image}
                                alt="product image"
                                className={`${styles["orders__product-img"]}`}
                            />
                        </article>
                    );
                })}
            </div>
        </article>
    );
};

export default OrdersListItem;
