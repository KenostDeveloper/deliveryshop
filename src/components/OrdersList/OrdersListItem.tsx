/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import styles from "./OrdersList.module.scss";
import Link from "next/link";

const OrdersListItem = ({ order }: { order: any }) => {
    const router = useRouter();

    return (
        <article
            className={`${styles["orders__item"]}`}
            onClick={() => router.push(`/orders/${order?.id}`)}>
            <div className={`${styles["orders__info"]}`}>
                <div className={`${styles["orders__info-block"]}`}>
                    <Link
                        href={`/orders/${order?.id}`}
                        className={`${styles["orders__info-title"]}`}>
                        Заказ от {order?.date}{" "}
                        <span className={`${styles["orders__info-number"]}`}>#{order?.id}</span>
                    </Link>
                    <p className={`${styles["orders__info-title"]}`}>{order?.cost.toLocaleString()} ₽</p>
                </div>
                <div className={`${styles["orders__info-block"]}`}>
                    <p className={`${styles["orders__info-text"]}`}>{order?.deliveryMethod}</p>
                    <p className={`${styles["orders__info-text"]}`}>{order?.status}</p>
                </div>
            </div>
            <div className={`${styles["orders__products"]}`}>
                {order?.products?.map((product: any, index: number) => {
                    if (index >= 5) return null;
                    return (
                        <article className={`${styles["orders__product"]}`} key={product?.id}>
                            <img
                                src={`${process.env.URL_IMAGE}/products/${product?.product?.image}`}
                                alt="product image"
                                className={`${styles["orders__product-img"]}`}
                            />
                        </article>
                    );
                })}
                {order?.products?.length > 6 && (
                    <article className={`${styles["orders__more"]}`}>
                        +{order?.products?.length - 5}
                    </article>
                )}
            </div>
        </article>
    );
};

export default OrdersListItem;
