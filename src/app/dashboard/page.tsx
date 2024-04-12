'use client'
import styles from './profile.module.scss'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import NotFound from '@/components/NotFound/NotFound';
import axios from 'axios';

import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { Chart } from 'primereact/chart';
import { Placeholder, Tabs } from 'rsuite';


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

        axios.get(`/api/statistics/orders`).then((res) => {
            if(res.data.success){
                setDataTable(res.data.data.orders);
                console.log(res.data.data.orders)
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

    const [dataTable, setDataTable] = useState<any>([]);

    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loadingTable, setLoadingTable] = useState(false);

    const getData = () => {
        if (sortColumn && sortType) {
          return dataTable.sort((a:any, b:any) => {
            console.log(a, b, dataTable)
            let x = a[sortColumn];
            let y = b[sortColumn];

            if (typeof x === 'string') {
              x = x.charCodeAt();
            }
            if (typeof y === 'string') {
              y = y.charCodeAt();
            }
            if (sortType === 'asc') {
              return x - y;
            } else {
              return y - x;
            }
          });
        }
        return dataTable;
      };
    
    const handleSortColumn = (sortColumn:any, sortType:any) => {
        setLoadingTable(true);
        setTimeout(() => {
            setLoadingTable(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
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

    const ImageCell = ({ rowData, dataKey, ...props }) => (
        <Cell {...props} style={{ padding: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: '#f5f5f5',
              borderRadius: 6,
              marginTop: 2,
              overflow: 'hidden',
              display: 'inline-block'
            }}
          >
            <img src={`/products/${rowData.product.image}`}/>
          </div>
        </Cell>
    );

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
                    <Tabs style={{margin: '10px 0 0 0'}} defaultActiveKey="1" appearance="subtle">
                        <Tabs.Tab eventKey="1" title="Заказы">
                        <Table
                            height={1000}
                            data={getData()}
                            sortColumn={sortColumn}
                            sortType={sortType}
                            onSortColumn={handleSortColumn}
                            loading={loadingTable}
                            >
                            <Column width={70} align="center" fixed sortable fullText>
                                <HeaderCell>id</HeaderCell>
                                <Cell dataKey="id" />
                            </Column>

                            {/* <Column width={40} sortable fullText>
                                <HeaderCell>Изображение</HeaderCell>
                                <ImageCell dataKey="product.image" />
                            </Column> */}

                            <Column width={130} sortable fullText>
                                <HeaderCell>Название</HeaderCell>
                                <Cell dataKey="product_name" />
                            </Column>

                            <Column width={80} sortable fullText>
                                <HeaderCell>Количество</HeaderCell>
                                <Cell dataKey="quantity" />
                            </Column>

                            <Column width={120} sortable fullText>
                                <HeaderCell>Цена товара</HeaderCell>
                                <Cell dataKey="price" />
                            </Column>

                            <Column width={100} sortable fullText>
                                <HeaderCell>Стоимость товаров</HeaderCell>
                                <Cell dataKey="cost" />
                            </Column>

                            {/* <Column width={100} sortable fullText>
                                <HeaderCell>Стоимость доставки</HeaderCell>
                                <Cell dataKey="order.deliveryCost" />
                            </Column>

                            <Column width={100} sortable fullText>
                                <HeaderCell>Время заказа в пути (ч)</HeaderCell>
                                <Cell dataKey="order.allDuration" />
                            </Column>

                            <Column width={100} sortable fullText>
                                <HeaderCell>Километраж</HeaderCell>
                                <Cell dataKey="order.allLength" />
                            </Column> */}

                            <Column width={200} sortable fullText>
                                <HeaderCell>Дата</HeaderCell>
                                <Cell dataKey="date" />
                            </Column>
                            
                            </Table>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
