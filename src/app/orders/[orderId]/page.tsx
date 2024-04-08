'use client'
import Order from "@/components/OrdersList/Order";
import { OrderType } from "@/components/OrdersList/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage({params}:any) {
    // Тестовые данные
    // const order = {
    //     date: new Date(),
    //     number: 3,
    //     status: "Готов к выдаче",
    //     deliveryMethod: "Самовывоз",
    //     user: "Иванов Иван Иванович",
    //     paymentMethod: "Наличные",
    //     telephone: "+7 (999) 999-99-99",
    //     email: "C0H5H@example.com",
    //     address: "г. Москва, ул. Ленина, д. 1",
    //     deliveryPrice: 300,
    //     products: [
    //         {
    //             id: 1,
    //             name: "Чемодан большой L  пропилен, светло-жёлтый Чемодан большой L  пропилен, светло-жёлтый",
    //             image: "/quickshopimage.png",
    //             price: 300,
    //             count: 2
    //         },
    //         {
    //             id: 2,
    //             name: "Чемодан большой L  пропилен, светло-жёлтый Чемодан большой L  пропилен, светло-жёлтый",
    //             image: "/quickshopimage.png",
    //             price: 500,
    //             count: 3
    //         },
    //         {
    //             id: 3,
    //             name: "Чемодан большой L  пропилен, светло-жёлтый Чемодан большой L  пропилен, светло-жёлтый",
    //             image: "/quickshopimage.png",
    //             price: 200,
    //             count: 7
    //         },
    //         {
    //             id: 3,
    //             name: "Чемодан большой L  пропилен, светло-жёлтый Чемодан большой L  пропилен, светло-жёлтый",
    //             image: "/quickshopimage.png",
    //             price: 100,
    //             count: 5
    //         },
    //         {
    //             id: 4,
    //             name: "Чемодан большой L  пропилен, светло-жёлтый Чемодан большой L  пропилен, светло-жёлтый",
    //             image: "/quickshopimage.png",
    //             price: 1,
    //             count: 1
    //         },
    //     ],
    // };

    const [order, setOrder] = useState<OrderType>();

    useEffect(() => {
        axios.get(`/api/orders?id=${params.orderId}`).then((res) => {
            if(res.data.success){
                setOrder(res.data?.order as OrderType);
            }
        });
    }, [])    

    return <Order order={order} />;
}
