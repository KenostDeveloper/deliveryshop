'use client'
import styles from './profile.module.scss'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import NotFound from '@/components/NotFound/NotFound';
import axios from 'axios';

import { Chart } from 'primereact/chart';


export default function Profile() {

    const [loading, setLoading] = useState(true)
    const {data: session, update} = useSession();

    const [statistics, setStatistics] = useState<any>([]);


    useEffect(() => {
        if(typeof(session) == "object"){
            setLoading(false)
            console.log(session)
        }
    }, [session]);

    useEffect(() => {
        axios.get(`/api/statistics`).then((res) => {
            if(res.data.success){
                setStatistics(res.data.data);
            }
        });
    }, [])

    const data = {
        labels: ['Пунктов выдачи заказов', 'Складов', 'Транзитных городов'],
        datasets: [
            {
                data: [statistics?.city?.PickPoint, statistics?.city?.Warehouse, statistics?.city?.Transit],
                backgroundColor: [
                    "#3b82f6", "#eab308", "#22c55e"
                ],
                hoverBackgroundColor: [
                    "#3b82f6", "#eab308", "#22c55e"
                ]
            }
        ]
    };
    const options = {
        cutout: '60%',
        plugins: false
    };


    if(loading){
        return <Loading/>
    }

    if(session == null){
        return (
            <div>Вы не авторизированы</div>
        )
    }
    if(session.user.role !== "SELLER") {
        return (
            <NotFound />
        )
    }

    return (
        <div className={`${styles.main} main`}>
            <div className={`${styles.container} container`}>
                <div className={`kenost-window ${styles.kenostwindow}`}>
                    {/* <div className="kenost-title">Мои маршруты</div> */}
                    <div className={styles.flex}>
                        <div className={styles.date}>
                            <span>{statistics?.day}</span>
                            <b>{statistics?.week}</b>
                            <p>{statistics?.month}</p>
                        </div>
                        <div className={styles.widget}>
                            <p>Заказы за сегодня</p>
                            <b>{statistics?.orders_today?.sumCost?.toLocaleString()} ₽</b>
                            <span>{statistics?.orders_today?.sumCount?.toLocaleString()} шт.</span>
                        </div>
                        <div className={styles.widget}>
                            <p>Всего проданно товаров</p>
                            <b>{statistics?.orders?.sumCost?.toLocaleString()} ₽</b>
                            <span>{statistics?.orders?.sumCount?.toLocaleString()} шт.</span>
                        </div>
                        <div className={styles.puncts}>
                            <b>Подключённые города</b>
                            <div className={styles.punctsContainer}>
                                <div className={styles.punctsChart}>
                                    <Chart style={{width: "100px"}} type="doughnut" data={data} options={options} />
                                    {/* <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" /> */}
                                </div>
                                <div className={styles.punctsInfo}>
                                    <div className={styles.punctsInfoEl}>
                                        <p><div className={styles.square} style={{background: "#3b82f6"}}></div>Пунктов выдачи заказов</p>
                                        <b>{statistics?.city?.PickPoint}</b>
                                    </div>
                                    <div className={styles.punctsInfoEl}>
                                        <p><div className={styles.square} style={{background: "#eab308"}}></div>Складов</p>
                                        <b>{statistics?.city?.Warehouse}</b>
                                    </div>
                                    <div className={styles.punctsInfoEl}>
                                        <p><div className={styles.square} style={{background: "#22c55e"}}></div>Транзитных городов</p>
                                        <b>{statistics?.city?.Transit}</b>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
