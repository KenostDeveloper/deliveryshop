'use client'
import styles from './profile.module.scss'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import NotFound from '@/components/NotFound/NotFound';
import axios from 'axios';

import { DateRangePicker, InputPicker } from 'rsuite';

import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import { Chart } from 'primereact/chart';
import { Placeholder, Tabs } from 'rsuite';


export default function Profile() {

    const [loading, setLoading] = useState(true)
    const {data: session, update} = useSession();

    const [statistics, setStatistics] = useState<any>([]);
    const [filtrs, setFiltrs] = useState<any>({
        status: null,
        date: []
    })
    const [text, setText] = useState("");
    const [status, setStatus] = useState([]);


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

        axios.get(`/api/orders/status`).then((res) => {
            if(res.data.success){
                setStatus(
                    res.data?.status.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );

                
            }
        });

        axios.post(`/api/statistics/orders`, {}).then((res: any) => {
            if(res.data.success){
                setDataTable(res.data.data.orders);
                setText(res.data.data.text)
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

    function updateStatistic(name:any, value:any){
        switch(name){
            case "date":
                setFiltrs({...filtrs, date: value})
                break;
            case "status":
                setFiltrs({...filtrs, status: value})
                break;
        }
    }

    useEffect(() => {
        axios.post(`/api/statistics/orders`, {filtrs: filtrs}).then((res: any) => {
            if(res.data.success){
                setDataTable(res.data.data.orders);
                setText(res.data.data.text)
            }
        });
    }, [filtrs])


    const getData = () => {
        if (sortColumn && sortType) {
          return dataTable.sort((a:any, b:any) => {
            console.log(a, b, dataTable)
            let x = a[sortColumn];
            let y = b[sortColumn];

            if (typeof x === 'string') {
              x = x.charCodeAt(0);
            }
            if (typeof y === 'string') {
              y = y.charCodeAt(0);
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

    const ImageCell = ({ rowData, dataKey, ...props }:any) => (
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
            <img src={`${process.env.URL_IMAGE}/products/${rowData.product.image}`}/>
          </div>
        </Cell>
    );

    return (
        <div className={`${styles.main} main`}>
            <div className={`${styles.container} container`}>
                <div className={`kenost-window ${styles.kenostwindow}`}>
                    <div className="kenost-title">Статистика продавца</div>
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
                    <div className={`${styles.flex} ${styles.margin}`}>
                        <div className={styles.widget}>
                            <p>Средний километраж</p>
                            <b>~{statistics?.medium_lenght?.toLocaleString()} км</b>
                            <span><i className='pi pi-compass'></i></span>
                        </div>
                        <div className={styles.widget}>
                            <p>Среднее время в пути</p>
                            <b>~{statistics?.medium_duration?.toLocaleString()} ч</b>
                            <span> <i className='pi pi-clock'></i></span>
                        </div>
                        <div className={styles.widget}>
                            <p>Средняя стоимость доставки</p>
                            <b>~{statistics?.medium_delivery?.toLocaleString()} ₽</b>
                            <span><i className='pi pi-truck'></i></span>
                        </div>
                        <div className={styles.widget}>
                            <p>Средняя стоимость заказа</p>
                            <b>~{statistics?.medium_cost?.toLocaleString()} ₽</b>
                            <span><i className='pi pi-box'></i></span>
                        </div>
                    </div>
                    <Tabs style={{margin: '10px 0 0 0'}} defaultActiveKey="1" appearance="subtle">
                        <Tabs.Tab eventKey="1" title="Заказы">
                        <div className={styles.kenostdate}>
                            <h2>{text}</h2>
                            <div className={`${styles.filters} filtersstatistic`}>
                                <InputPicker
                                    data={status}
                                    onChange={(value: any) =>
                                        updateStatistic("status", value)
                                    }
                                    placeholder="Выберите статус"
                                />
                                <DateRangePicker format="MM/dd/yyyy" character=" – " onChange={(value: any) => updateStatistic("date", value)} placeholder="Период статистики" showOneCalendar />
                            </div>
                        </div>
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

                            <Column width={40} sortable fullText>
                                <HeaderCell>Изображение</HeaderCell>
                                <ImageCell dataKey="product.image" />
                            </Column>

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

                            <Column width={100} sortable fullText>
                                <HeaderCell>Стоимость доставки</HeaderCell>
                                <Cell dataKey="deliveryCost" />
                            </Column>

                            <Column width={100} sortable fullText>
                                <HeaderCell>Время заказа в пути (ч)</HeaderCell>
                                <Cell dataKey="allDuration" />
                            </Column>

                            <Column width={100} sortable fullText>
                                <HeaderCell>Километраж</HeaderCell>
                                <Cell dataKey="allLength" />
                            </Column>

                            <Column width={200} sortable fullText >
                                <HeaderCell>Дата</HeaderCell>
                                <Cell dataKey="date" />
                            </Column>

                            <Column width={100} sortable fullText >
                                <HeaderCell>Статус</HeaderCell>
                                <Cell dataKey="order.status.name" />
                            </Column>
                            
                            </Table>
                        </Tabs.Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
