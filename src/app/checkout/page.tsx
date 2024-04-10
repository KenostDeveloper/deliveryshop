/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import styles from "./checkout.module.scss";
import axios from "axios";
import { useBasketContext } from "@/components/Helps/GlobalBasket";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import EmptyBasket from "@/components/EmptyBasket/EmptyBasket";
import Loading from "@/components/Helps/Loading";
import Counter from "@/components/Counter/Counter.components";
import BasketItem from "@/components/BasketItem/BasketItem";
import BasketRoute from "@/components/BasketRoute/BasketRoute";

export default function Checkout() {
    const [methodDelivery, setMetodDelivery] = useState(1);
    const router = useRouter();
    const { basket, setBasket } = useBasketContext();
    const [amount, setAmount] = useState(0);
    const [load, setLoad] = useState(false);
    
    const [pathResult, setPathResult] = useState([]);
    const [pathParam, setPathParam] = useState("");

    useEffect(() => {
        if (basket) {
            let temp = 0;

            for (let i = 0; i < basket?.length; i++) {
                temp = temp + basket[i]?.quantity * basket[i]?.product?.price;
            }
            setAmount(temp);
        }
    }, [basket]);

    useEffect(() => {
        axios.get(`/api/basket`).then((res) => {
            // setBasketItems(res.data?.basket);
            setBasket(res.data?.basket);
        });
    
    }, []);

    useEffect(() => {        
        switch(methodDelivery) {
            case 1:
                axios.get(`/api/delivery/search/fast`).then((res) => {
                    setPathResult(res.data?.result);            
                });
                setPathParam("ч");
                break;
            case 2:
                axios.get(`/api/delivery/search/cheap`).then((res) => {
                    setPathResult(res.data?.result);
                });
                setPathParam("₽");
                break;
            case 3:
                axios.get(`/api/delivery/search/short`).then((res) => {
                    setPathResult(res.data?.result);
                });
                setPathParam("км");
                break;
        }
    }, [methodDelivery, basket])

    function placeOrder() {
        setLoad(true);
        axios
            .post(`/api/orders`)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    router.push(`/orders/${res.data.order.id}`);
                } else {
                    toast.error(res.data.message);
                }
            })
            .finally(() => setLoad(false));
    }

    if (basket == null || !basket?.length) {
        return <EmptyBasket />;
    }

    return (
        <main className={styles.main}>
            <div className={`${styles.container} container`}>
                <h1>Офомление заказа</h1>
                <div className={styles.containerChekout}>
                    <div className={styles.left}>
                        {/* <h2>Оформление доставки</h2> */}
                        <div className={styles.methodDelivery}>
                            <div
                                className={
                                    methodDelivery == 1
                                        ? `${styles.active} ${styles.delivery}`
                                        : `${styles.delivery}`
                                }
                                onClick={() => {
                                    setMetodDelivery(1);
                                }}>
                                <div className={styles.deliveryTitle}>
                                    <p>Самая быстрая</p> <i className="pi pi-bolt"></i>
                                </div>
                                <div className={styles.deliveryBody}>
                                    {/* <p>По России</p> */}
                                    <span>Выбрать</span>
                                </div>
                            </div>
                            <div
                                className={
                                    methodDelivery == 2
                                        ? `${styles.active} ${styles.delivery}`
                                        : `${styles.delivery}`
                                }
                                onClick={() => setMetodDelivery(2)}>
                                <div className={styles.deliveryTitle}>
                                    <p>Самая дешевая</p> <i className="pi pi-wallet"></i>
                                </div>
                                <div className={styles.deliveryBody}>
                                    {/* <p>По СПб</p> */}
                                    <span>Выбрать</span>
                                </div>
                            </div>
                            <div
                                className={
                                    methodDelivery == 3
                                        ? `${styles.active} ${styles.delivery}`
                                        : `${styles.delivery}`
                                }
                                onClick={() => setMetodDelivery(3)}>
                                <div className={styles.deliveryTitle}>
                                    <p>Короткий маршрут</p> <i className="pi pi-compass"></i>
                                </div>
                                <div className={styles.deliveryBody}>
                                    {/* <p>В магазине</p> */}
                                    <span>Выбрать</span>
                                </div>
                            </div>
                        </div>
                        <section>
                            <p className={`${styles["basket-route__title"]}`}>Ваши товары</p>
                            <BasketRoute products={basket} pathResult={pathResult} pathParam={pathParam} />
                        </section>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.card}>
                            <div className={styles.products}>
                                {basket.map((item: any) => (
                                    <BasketItem key={item.id} item={item} />
                                ))}
                            </div>

                            <div className={styles.sale}>
                                <div className={styles.saleEl}>
                                    <p>Стоимость товаров</p>
                                    <p>{amount?.toLocaleString()}₽</p>
                                </div>
                                <div className={styles.saleEl}>
                                    <p>Доставка</p>
                                    <span>
                                        {methodDelivery == 0
                                            ? "Не выбрано"
                                            : methodDelivery == 1
                                            ? "Бесплатно"
                                            : methodDelivery == 2
                                            ? "Стоимость уточнит менеджер"
                                            : "Бесплатно"}
                                    </span>
                                </div>
                                {methodDelivery == 1 ? (
                                    <div className={styles.saleEl}>
                                        <p>Адрес доставки</p>
                                        {/* <span>{codeCdek.city? `${codeCdek?.city}, ${codeCdek?.address}` : "Не выбрано"}</span> */}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className={styles.itog}>
                                <p>Итого</p>
                                <p>{amount?.toLocaleString()}₽</p>
                            </div>

                            <button onClick={() => placeOrder()} className={styles.buttonOrder}>
                                {!load ? (
                                    "Оформить заказ"
                                ) : (
                                    <i className="pi pi-spin pi-spinner"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
