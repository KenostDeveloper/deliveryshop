'use client'
import Loading from "@/components/Helps/Loading";
import OrdersList from "@/components/OrdersList/OrdersList";
import { OrderType } from "@/components/OrdersList/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {useSession} from "next-auth/react"
import NotFound from "@/components/NotFound/NotFound";

export default function Orders() {
    const { data: session, update } = useSession();
    const [orders, setOrders] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        axios.get(`/api/orders`).then((res) => {
            if(res.data.success){
                console.log(res.data?.orders);
                
                setOrders(res.data?.orders);
            }
        });

        setIsSuccess(true);
    }, [])

    if(!isSuccess) return <Loading />

    if(session?.user.role != "BUYER") {
        return <NotFound />
    }

    return <OrdersList orders={orders} />;
}
