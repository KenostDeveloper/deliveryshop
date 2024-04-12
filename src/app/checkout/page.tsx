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
import { CheckPicker, Checkbox, Input, Slider } from "rsuite";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NotFound from "@/components/NotFound/NotFound";

export default function Checkout() {
    const { data: session, update } = useSession();
    const [methodDelivery, setMetodDelivery] = useState(1);
    const router = useRouter();
    const { basket, setBasket } = useBasketContext();
    const [amount, setAmount] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [load, setLoad] = useState(false);

    const [pathResult, setPathResult] = useState<any>([]);
    const [pathParam, setPathParam] = useState("");

    const [orderComment, setOrderComment] = useState("");

    const [maxCost, setMaxCost] = useState(10000);
    const [maxLength, setMaxLength] = useState(1000);
    const [maxDuration, setMaxDuration] = useState(100);

    const [loading, setLoading] = useState(true);

    const [deliveryTransports, setDeliveryTransports] = useState<any>([
        { label: "Автомобильный", value: 1 },
        { label: "Железнодорожный", value: 2 },
        { label: "Морской", value: 3 },
        { label: "Речной", value: 4 },
        { label: "Воздушный", value: 5 },
    ]);
    const [selectTransport, setSelectTransport] = useState<any>([1, 2, 3, 4, 5]);

    const [isAgreeToCondition, setIsAgreeToCondition] = useState(false);
    const [isAllPathsExists, setIsAllPathsExists] = useState(false);

    useEffect(() => {
        if (typeof session == "object") {
            setLoading(false);
        }
    }, [session]);

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
        if (pathResult?.length) {
            pathResult.find((product: any) => !product?.path) ? setIsAllPathsExists(false) : setIsAllPathsExists(true);
        }

        setDeliveryCost(pathResult.reduce((acc: number, product: any) => (acc += product?.all_cost), 0));
    }, [pathResult]);

    useEffect(() => {
        axios.get(`/api/basket`).then((res) => {
            // setBasketItems(res.data?.basket);
            setBasket(res.data?.basket);
        });

        // axios.get(`/api/delivery/transports`).then((res) => {
        //     setDeliveryTransports(
        //         res.data?.transport.map((item: any) => ({
        //             label: item.name,
        //             value: item.id,
        //         }))
        //     );

        //     setSelectTransport(res.data?.transport.map((item: any) => item.id));
        // });
    }, []);

    useEffect(() => {
        switch (methodDelivery) {
            case 1:
                fetchPath("fast");
                setPathParam("ч");
                break;
            case 2:
                fetchPath("cheap");
                setPathParam("₽");
                break;
            case 3:
                fetchPath("short");
                setPathParam("км");
                break;
            case 4:
                fetchPath("balance");
                setPathParam("ч");
                break;
        }
    }, [methodDelivery, basket, selectTransport, maxCost, maxLength, maxDuration]);

    const fetchPath = async (searchType: string) => {
        const dataToPost: any = {
            transport: selectTransport,
        };

        if (methodDelivery == 4) {
            dataToPost.maxCost = maxCost;
            dataToPost.maxLenght = maxLength;
            dataToPost.maxDuration = maxDuration;
        }

        const res = await axios.post(`/api/delivery/search/${searchType}`, { ...dataToPost });

        if (!res?.data?.success) {
            toast.error(res.data?.message);
        } else {
            setPathResult(res.data?.result);
        }

        console.log("Pathresult:", res.data);
    };

    function placeOrder() {
        setLoad(true);

        // Формирование списка городов, из который нужно списывать товар
        const citiesToReduce: any = [];
        for (let i = 0; i < pathResult.length; i++) {
            citiesToReduce[i] = [];

            for (let j = 0; j < pathResult[i]?.path.length; j++) {
                citiesToReduce[i].push(Object.keys(pathResult[i]?.path[j]?.path[0])[0]);
            }
        }

        // Получение названия способа доставки
        const deliveryMethod =
            methodDelivery == 1
                ? "Самая быстрая"
                : methodDelivery == 2
                ? "Самая дешевая"
                : methodDelivery == 3
                ? "Короткий маршрут"
                : "Сбаланссированный маршрут";

        axios
            .post(
                `/api/orders`,
                JSON.stringify({
                    deliveryCost: deliveryCost,
                    cities: citiesToReduce,
                    allDuration: pathResult.reduce((sum: number, pathItem: any) => (sum += pathItem?.all_duration), 0),
                    allLength: pathResult.reduce((sum: number, pathItem: any) => (sum += pathItem?.all_length), 0),
                    deliveryMethod: deliveryMethod
                })
            )
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

    if (loading) {
        return <Loading />;
    }

    if (basket == null || !basket?.length) {
        return <EmptyBasket />;
    }

    if (session?.user.role != "BUYER") {
        return <NotFound />;
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
                                className={methodDelivery == 1 ? `${styles.active} ${styles.delivery}` : `${styles.delivery}`}
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
                                className={methodDelivery == 2 ? `${styles.active} ${styles.delivery}` : `${styles.delivery}`}
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
                                className={methodDelivery == 3 ? `${styles.active} ${styles.delivery}` : `${styles.delivery}`}
                                onClick={() => setMetodDelivery(3)}>
                                <div className={styles.deliveryTitle}>
                                    <p>Короткий маршрут</p> <i className="pi pi-compass"></i>
                                </div>
                                <div className={styles.deliveryBody}>
                                    {/* <p>В магазине</p> */}
                                    <span>Выбрать</span>
                                </div>
                            </div>
                            <div
                                className={methodDelivery == 4 ? `${styles.active} ${styles.delivery}` : `${styles.delivery}`}
                                onClick={() => setMetodDelivery(4)}>
                                <div className={styles.deliveryTitle}>
                                    <p>Сбалансированный маршрут</p> <i className="pi pi-filter"></i>
                                </div>
                                <div className={styles.deliveryBody}>
                                    {/* <p>В магазине</p> */}
                                    <span>Выбрать</span>
                                </div>
                            </div>
                            <div className={`${styles["deliveryFilter"]}`}>
                                <CheckPicker
                                    placeholder="Способ транспортировки"
                                    value={selectTransport}
                                    onChange={setSelectTransport}
                                    data={deliveryTransports}
                                    className={`${styles["deliveryFilter--transport"]} deliveryTranspots`}
                                />
                                {methodDelivery == 4 && (
                                    <>
                                        <div>
                                            <p>Максимально количество часов доставки</p>
                                            <Slider progress min={0} max={100} defaultValue={100} onChange={setMaxDuration} />
                                        </div>
                                        <div>
                                            <p>Максимальная сумма доставки</p>
                                            <Slider progress min={0} max={10000} defaultValue={10000} onChange={setMaxCost} />
                                        </div>
                                        <div>
                                            <p>Максимальная протяжённость пути (км)</p>
                                            <Slider progress min={0} max={1000} defaultValue={1000} onChange={setMaxLength} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <section>
                            <p className={`${styles["basket-route__title"]}`}>Ваши товары</p>
                            <BasketRoute products={basket} pathResult={pathResult} pathParam={pathParam} />

                            <p className={`${styles["basket-route__title"]} ${styles["basket-route__title--comment"]}`}>Комментарий к заказу</p>
                            <Input
                                as="textarea"
                                rows={5}
                                placeholder=""
                                value={orderComment}
                                onChange={(value, e) => {
                                    setOrderComment(e.target.value);
                                }}
                                id="advantages"
                            />

                            <div className={`${styles["basket__checkbox-container"]}`}>
                                <div>
                                    {/* <input type="checkbox" name="call" id="call" />
                                    <label htmlFor="call">Перезвоните для подтверждения заказа</label> */}
                                    <Checkbox color="yellow">Перезвоните для подтверждения заказа</Checkbox>
                                </div>
                                <div>
                                    {/* <input type="checkbox" name="conditionAgree" id="conditionAgree" />
                                    <label htmlFor="conditionAgree">Я соглашаюсь с <Link href="/condition">условиями оферты</Link> и <Link href="/politics">политикой конфиденциальности</Link></label> */}
                                    <Checkbox color="yellow" checked={isAgreeToCondition} onChange={() => setIsAgreeToCondition(!isAgreeToCondition)}>
                                        Я соглашаюсь с <Link href="/condition">условиями оферты</Link> и{" "}
                                        <Link href="/politics">политикой конфиденциальности</Link>
                                    </Checkbox>
                                </div>
                            </div>
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
                                    <p>{amount?.toLocaleString()} ₽</p>
                                </div>
                                <div className={styles.saleEl}>
                                    <p>Доставка</p>
                                    <p>{deliveryCost.toLocaleString()} ₽</p>
                                </div>
                            </div>

                            <div className={styles.itog}>
                                <p>Итого</p>
                                <p>{(amount + deliveryCost).toLocaleString()}₽</p>
                            </div>

                            <button onClick={() => placeOrder()} className={styles.buttonOrder} disabled={!isAgreeToCondition || !isAllPathsExists}>
                                {!load ? "Оформить заказ" : <i className="pi pi-spin pi-spinner"></i>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
