'use client'
import Loading from "@/components/Helps/Loading";
import Order from "@/components/OrdersList/Order";
import { OrderType } from "@/components/OrdersList/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage({params}:any) {

    const [order, setOrder] = useState<any>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        axios.get(`/api/orders?id=${params.orderId}`).then((res) => {
            if(res.data.success){
                setOrder(res.data?.order);
            }
        });

        setIsSuccess(true);
    }, [])

    if(!isSuccess) return <Loading />

    return <Order order={order} />;
}
