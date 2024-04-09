"use client";

import { useRouter } from "next/navigation";
import Title from "../UI/Title.components";
import styles from "./OrdersList.module.scss";
import { OrderType } from "./types";
import Product from "./Product";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "../Modal/Modal";
import CancelOrderForm from "../Forms/CancelOrderForm";
import MyButton from "../UI/MyInput/MyButton";

const Order = ({ order, setOrder }: { order: any; setOrder: any }) => {
    const [modalActive, setModalActive] = useState<boolean>(false);

    const router = useRouter();

    const updateOrderStatus = async (status: string) => {
        const res = await axios.put(`/api/orders`, {
            id: order?.id,
            status_id: status === "Принят" ? 2 : 3,
        });

        if (!res.data.success) {
            toast.error(res.data.message);
            return;
        }

        toast.success(res.data.message);

        setOrder({ ...order, status: { name: status } });
    };

    const repeatOrder = async () => {
        const res = await axios.post(`/api/orders/repeat`, {
            products: order?.products,
        });

        if (!res.data.success) {
            toast.error(res.data.message);
            return;
        }

        toast.success(res.data.message);
        router.push("/checkout");
    }

    return (
        <section className={`${styles["order"]} container`}>
            <div className={`${styles["order__top-side"]}`}>
                <div className={`${styles["order__top-side-block"]}`}>
                    <div className={`${styles["order__title-container"]}`}>
                        <h1 className={`${styles["order__title"]}`}>
                            <Link href="/orders" className={`${styles["arrow"]}`}>
                                <i className="pi pi-angle-left"></i>
                            </Link>
                            Заказ #{order?.id}
                        </h1>
                        <p className={`${styles["order__date"]}`}>от {order?.date}</p>
                    </div>
                </div>
            </div>
            <div className={`${styles["order__info-container"]}`}>
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Статус</p>
                    <p
                        className={`${styles["order__info-text"]} ${
                            order?.status?.name === "Принят"
                                ? styles["order__info-label--green"]
                                : order?.status?.name === "Отменен"
                                ? styles["order__info-label--red"]
                                : ""
                        }`}>
                        {order?.status?.name}
                    </p>
                </div>
                {/* <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>ФИО</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.user?.login}</p>
                </div> */}
                {/* <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Способ доставки</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.deliveryMethod}</p>
                </div> */}
                {/* <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Способ оплаты</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.paymentMethod}</p>
                </div> */}
                {/* <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Телефон</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.telephone}</p>
                </div> */}
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>E-mail</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.user?.email}</p>
                </div>
                {/* <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Адрес</p>
                    <p className={`${styles["order__info-text"]}`}>{order?.address}</p>
                </div> */}
                <div className={`${styles["order__info"]}`}>
                    <p className={`${styles["order__info-label"]}`}>Действия</p>
                    <div className={`${styles["order__buttons-container"]}`}>
                        {order?.status?.name === "Новый" && (
                            <>
                                <button
                                    onClick={() => {
                                        updateOrderStatus("Принят");
                                    }}
                                    className={`${styles["order__button"]} ${styles["order__button--green"]}`}>
                                    Принять заказ
                                </button>
                                <span className={`${styles["order__info-label"]}`}>
                                    &nbsp;&nbsp;/&nbsp;&nbsp;
                                </span>
                                <button
                                    onClick={() => {
                                        setModalActive(true);
                                    }}
                                    className={`${styles["order__button"]} ${styles["order__button--red"]}`}>
                                    Отменить заказ
                                </button>
                                <span className={`${styles["order__info-label"]}`}>
                                    &nbsp;&nbsp;/&nbsp;&nbsp;
                                </span>
                            </>
                        )}
                        <button
                            onClick={() => {repeatOrder()}}
                            className={`${styles["order__button"]} ${styles["order__button--yellow"]}`}>
                            Повторить заказ
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${styles["order__price-container"]}`}>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Товары ({order?.products?.length})
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {order?.cost}₽
                    </p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Доставка
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {/* {order?.deliveryPrice}₽ */}
                        {Number(1000).toLocaleString()} ₽
                    </p>
                </div>
                <div className={`${styles["order__info"]}`}>
                    <p
                        className={`${styles["order__info-label"]} ${styles["order__info-label--bold"]}`}>
                        Итого
                    </p>
                    <p
                        className={`${styles["order__info-text"]} ${styles["order__info-text--bold"]}`}>
                        {/* { + order?.deliveryPrice}₽ */}
                        {(order?.cost + Number(1000)).toLocaleString()} ₽
                    </p>
                </div>
            </div>
            <div className={`${styles["order__products-container"]}`}>
                {order?.products?.map((product: any, index: number) => {
                    return <Product key={product.id} product={product} setOrder={setOrder} inBasket={false} />;
                })}
            </div>

            <Modal active={modalActive} setActive={setModalActive}>
                <CancelOrderForm
                    order={order}
                    action={updateOrderStatus}
                    setActive={setModalActive}
                />
            </Modal>
        </section>
    );
};

export default Order;
