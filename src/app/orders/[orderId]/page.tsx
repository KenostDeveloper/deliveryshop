'use client'
import Loading from "@/components/Helps/Loading";
import NotFound from "@/components/NotFound/NotFound";
import Order from "@/components/OrdersList/Order";
import { OrderType } from "@/components/OrdersList/types";
import axios from "axios";
import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";

export default function OrderPage({params}:any) {
    const { data: session, update } = useSession();
    const [order, setOrder] = useState<any>([]);
    // const [userRates, setUserRates] = useState<any>([]);

    useEffect(() => {
        // Получение заказа
        axios.get(`/api/orders?id=${params.orderId}`).then((res) => {
            if(res.data.success){
                setOrder(res.data?.order);
            }
        });

        // // Получение всех отзывов пользователя
        // axios.get(`/api/rating?orderId`).then((res) => {
        //     if(res.data.success){
        //         setUserRates(res.data?.userRates);
        //     }
        // });

    }, [])

    if(session?.user.role != "BUYER") {
        return <NotFound />
    }

    return <Order order={order} setOrder={setOrder}/>;
}
