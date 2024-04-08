'use client'
import Loading from "@/components/Helps/Loading";
import OrdersList from "@/components/OrdersList/OrdersList";
import { OrderType } from "@/components/OrdersList/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        axios.get(`/api/orders`).then((res) => {
            if(res.data.success){
                setOrders(res.data?.orders);
            }
        });

        setIsSuccess(true);
    }, [])

    if(!isSuccess) return <Loading />

    return <OrdersList orders={orders} />;
}
