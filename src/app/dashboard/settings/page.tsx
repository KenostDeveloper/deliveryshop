/* eslint-disable @next/next/no-img-element */
'use client'
import styles from './settings.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import MyInput from '@/components/UI/MyInput/MyInput';
import MyTextArea from '@/components/UI/MyInput/MyTextArea';
import MyButton from '@/components/UI/MyInput/MyButton';
import axios from 'axios';
import toast from 'react-hot-toast';
import { InputNumber, InputPicker } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import NotFound from '@/components/NotFound/NotFound';
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';
import { Graph } from "react-d3-graph";


export default function Settings() {

    const [loading, setLoading] = useState(true)
    const {data: session, update} = useSession();
    const [open, setOpen] = React.useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [profile, setProfile] = useState<any>({
        image: "",
        nameShop: "QuickShop",
        description: "Описание вашего магазина ещё нет :( Исправте это!"
    });

    const [selectedFile, setSelectedFile] = useState<File>();

    const [shopSelected, setShopSelected] = useState([
        {}
    ]);

    const [sityWay, setSityWay] = useState([{}]);

    const [city, setCity] = useState([]);
    const [cityUser, setCityUser] = useState([]);

    const type= [
        {label: 'Склад', value: 'Warehouse'},
        {label: 'Пункт выдачи', value: 'PickPoint'},
        {label: 'Транзитный', value: 'Transit'},
    ]

    function updateShopPointCity(id: string, property: any, list: any, setList: any) {
        const nextShapes = list.map((characteristic: any) => {

            if (characteristic.id != id) {
            // No change
            return characteristic;
            } else {
            // Return a new circle 50px below
            return {
            ...characteristic,
            idCity: property,
            };
            }
        });
        setList(nextShapes);
    }

    function updateShopPointType(id: string, property: any, list: any, setList: any) {
        const nextShapes = list.map((characteristic: any) => {

            if (characteristic.id != id) {
            // No change
            return characteristic;
            } else {
            // Return a new circle 50px below
            return {
            ...characteristic,
            typePoint: property,
            };
            }
        });
        setList(nextShapes);
    }


    const inputFile = useRef<any>(null);


    useEffect(() => {
        if(typeof(session) == "object"){
            setLoading(false)
        }
    }, [session]);

    useEffect(() => {
        axios.get(`/api/profile/settings`).then((res) => {
            setProfile(res.data?.profile);
            if(profile?.nameShop == null){
                setProfile({...profile, nameShop: " "})
            }

            if(profile?.description == null){
                setProfile({...profile, description: " "})
            }
        });

        axios.get(`/api/profile/points`).then((res) => {
            if(res.data.success){
                if(res.data?.points.length != 0){
                    setShopSelected(res.data?.points);
                }
            }
        });

        axios.get(`/api/profile/city`).then((res) => {
            setCity(res.data?.city.map((item: any) => ({
                label: item.name,
                value: item.id,
            })));
        });

        axios.get(`/api/profile/city?way=true`).then((res) => {
            if(res.data.success){
                setCityUser(res.data?.city.map((item: any) => ({
                    label: item.city.name,
                    value: item.city.id,
                })));
            }
        });

        axios.get(`/api/delivery/transports`).then((res) => {
            setTransport(res.data?.transport.map((item: any) => ({
                label: item.name,
                value: item.id,
            })));
        });
        
    }, [])


    useEffect(() => {
        console.log(session)
    })

    const createProduct = async () => {
        const formData = new FormData();
        if(selectedFile){
            formData.append("file", selectedFile);
        }
        formData.append("name", profile.nameShop);
        formData.append("description", profile.description);

        axios
        .post(`/api/profile/settings`, formData)
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setProfile(res.data.profile)
            } else {
                toast.error(res.data.message);
            }
        })
        .finally(() => setIsEdit(false));
    };

    const createShops = async () => {
        axios
        .post(`/api/profile/points`, JSON.stringify({shopSelected}))
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setProfile(res.data.profile)
                axios.get(`/api/profile/city?way=true`).then((res) => {
                    if(res.data.success){
                        setCityUser(res.data?.city.map((item: any) => ({
                            label: item.city.name,
                            value: item.city.id,
                        })));

                        axios.get(`/api/delivery/cityway?graph=true`).then((res) => {
                            if(res.data.success){
                                setSityWayGraph(res.data?.cityway);
                            }
                        });
                    }
                });
            } else {
                toast.error(res.data.message);
            }
        })
        .finally(() => setIsEdit(false));
    }

  const hendlerInput = () => {
    inputFile.current.click();
  };

    //Добавление нового маршрута

    const [newCityWay, setNewCityWay] = useState<any>({
        city1: "",
        city2: ""
    })

    const [newCityWayTransport, setNewCityWayTransport] = useState<any>([
        {
            id: uuidv4(),
            transport: "", // Тип транспорта
            duration: 0, //Длительность
            cost: 0, //Стоимость
            length: 0 //Протяжённость
        }
    ])

    const [sityWayGraph, setSityWayGraph] = useState([]);

    useEffect(() => {
        axios.get(`/api/delivery/cityway?graph=true`).then((res) => {
            if(res.data.success){
                setSityWayGraph(res.data?.cityway);
            }
        });
    }, [])


    const myConfig = {
        nodeHighlightBehavior: true,
        focusZoom: 1,
        node: {
          color: "#FFE500",
          size: 120,
          labelProperty: "id",
          highlightStrokeColor: "blue",
        },
        link: {
          type: "CURVE_SMOOTH",
          highlightColor: "lightblue",
        },
      };
    
    const [loadCityWay, setLoadCityWay] = useState(false);

    function updateNewCityWayTransport(id: string, item: any, property: any) {
        const nextShapes = newCityWayTransport.map((characteristic: any) => {
            if (characteristic.id != id) {
                // No change
                return characteristic;
            } else {
                // Return a new circle 50px below
                switch (item) {
                    case "transport":
                        return {
                            ...characteristic,
                            transport: property,
                        };
                    case "duration":
                        return {
                            ...characteristic,
                            duration: property,
                        };
                    case "cost":
                        return {
                            ...characteristic,
                            cost: property,
                        };
                    case "length":
                        return {
                            ...characteristic,
                            length: property,
                        };
                        
                }
            }
        });
        setNewCityWayTransport(nextShapes);
    }



    function createCytiway(){
        setLoadCityWay(true)
        axios
        .post(`/api/delivery/cityway`, JSON.stringify({ cityWay: newCityWay, cityWayTransport: newCityWayTransport }))
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                axios.get(`/api/delivery/cityway?graph=true`).then((res) => {
                    if(res.data.success){
                        setSityWayGraph(res.data?.cityway);
                    }
                });
                setOpen(false)
                setNewCityWay({
                    city1: "",
                    city2: "",
                })
                setNewCityWayTransport([
                    {
                        id: uuidv4(),
                        transport: "", // Тип транспорта
                        duration: 0, //Длительность
                        cost: 0, //Стоимость
                        length: 0, //Протяжённость
                    }
                ])
            } else {
                toast.error(res.data.message);
            }
        }).finally(() => setLoadCityWay(false));
    }

    const [transport, setTransport] = useState([]);

    if(loading){
        return <Loading/>
    }

    if(session == null){
        return (
            <NotFound/>
        )
    }

    return (
        <div className={`${styles.main} main`}>
            <div className={`${styles.container} container`}>
                <div className={styles.profile}>
                    <img onClick={ hendlerInput } className={styles.profile__image} src={profile?.image == null ? "/quickshopimage.png" : `/users/` + profile.image} alt="" />
                    <div className={styles.profile__text}>
                        {!isEdit?
                            <>
                                <b className={styles.profile__name}>{profile?.nameShop  == null || "" ? "QuickShop" : profile?.nameShop}<i className='pi pi-pen-to-square' onClick={() => setIsEdit(!isEdit)}></i></b>
                                <p className={styles.profile__desc}>{profile?.description == null || "" ? "Описание вашего магазина ещё нет :( Исправте это!" : profile?.description}</p>
                            </>
                            :
                            <>
                                <input onChange={
                                    ({target}) => {
                                        if(target.files){
                                            const file = target.files[0];
                                            setSelectedFile(file)
                                        }
                                    }
                                } type="file" ref={inputFile} className="hidden"/>
                                <MyInput value={profile.nameShop  == null || "" ? "QuickShop" : profile?.nameShop}  onChange={(e: any) => setProfile({...profile, nameShop: e.target.value})}/>
                                <MyTextArea value={profile.description == null || "" ? "Описание вашего магазина ещё нет :( Исправте это!" : profile?.description}  onChange={(e: any) => setProfile({...profile, description: e.target.value})}/>
                                <MyButton onClick={() => createProduct()}>Сохранить</MyButton>
                            </>
                        }
                        
                    </div>
                </div>

                <div className={styles.shops}>
                    <div className="kenost-title">Мои города</div>
                    {shopSelected.map((item: any, index: any) => 
                        <div key={item.id} className={styles.shops__el}>
                            <InputPicker
                                className="shop__input"
                                data={city}
                                value={item.idCity}
                                onChange={(value) => updateShopPointCity(item.id, value, shopSelected, setShopSelected)}
                                placeholder="Выберите город"
                            />
                            <InputPicker
                                className="shop__input"
                                data={type}
                                value={item.typePoint}
                                onChange={(value) => updateShopPointType(item.id, value, shopSelected, setShopSelected)}
                                placeholder="Выберите тип точки"
                            />
                            {index + 1 == shopSelected.length? 
                            <div className={styles.shops__button} onClick={() => {setShopSelected([...shopSelected, {id: uuidv4(), idCity: null, typePoint: null}])}}><i className='pi pi-plus'></i></div>
                            :
                            ""
                            }
                        </div>
                    )}
                    <MyButton onClick={() => createShops()}>Сохранить</MyButton>
                </div>

                <div className='kenost-window'>
                    <div className="kenost-title">Мои маршруты</div>
                    <div className={styles.sityWayAdd} onClick={() => setOpen(true)}><i className='pi pi-plus'></i> Добавить</div>
                    <Graph
                        className="kenost-graph"
                        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                        data={sityWayGraph}
                        config={myConfig}
                    />
                    <div className={styles.explanations}>
                        <b>Обозначения</b>
                        <div className={styles.explanationsEl}>
                            <img src="/shop/1.svg" alt="" />
                            Транзитный город
                        </div>
                        <div className={styles.explanationsEl}>
                            <img src="/shop/2.svg" alt="" />
                            В этом городе есть пункт выдачи заказов
                        </div>
                        <div className={styles.explanationsEl}>
                            <img src="/shop/4.svg" alt="" />
                            В этом городе есть склад
                        </div>
                        <div className={styles.explanationsEl}>
                            <img src="/shop/3.svg" alt="" />
                            В этом городе есть пункт выдачи заказов и склад
                        </div>
                        <div className={styles.explanationsEl}>
                            <img src="/shop/5.svg" alt="" />
                            В городе есть пункт выдвчи заказов или склад, но он не подключён к другим городам (Товары из этого города не будут отображаться в каталоге)
                        </div>
                    </div>
                </div>

                <Modal keyboard={false} open={open} onClose={() => setOpen(false)}>
                    <Modal.Header>
                        <Modal.Title>Добавить маршрут</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className={`${styles.sityWayFlex} ${styles.sityWayFlexMargin}`}>
                            <div className={styles.sityWayFlexEl}>
                                <p className={styles.label}>Первый город</p>
                                <InputPicker
                                    data={cityUser}
                                    value={newCityWay.city1}
                                    onChange={(value) => setNewCityWay({...newCityWay, city1: value})}
                                    placeholder="Выберите город"
                                />
                            </div>
                            <div className={styles.sityWayFlexEl}>
                                <p className={styles.label}>Второй город</p>
                                <InputPicker
                                    data={cityUser}
                                    value={newCityWay.city2}
                                    onChange={(value) => setNewCityWay({...newCityWay, city2: value})}
                                    placeholder="Выберите город"
                                />
                            </div>
                        </div>
                        {newCityWayTransport.map((item: any, index: any) =>
                            <>
                            <div key={item.id} className={styles.sityWayFlex}>
                                <div className={styles.sityWayFlexEl}>
                                    <p className={styles.label}>Тип транспорта</p>
                                    <InputPicker
                                        data={transport}
                                        value={item.transport}
                                        onChange={(value, e) =>
                                            updateNewCityWayTransport(item.id, "transport", value)
                                        }
                                        placeholder="Тип транспорта"
                                    />
                                </div>
                                <div className={styles.sityWayFlexEl}>
                                    <p className={styles.label}>Стоимость</p>
                                    <InputNumber
                                        placeholder="Стоимость"
                                        value={item.cost}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateNewCityWayTransport(item.id, "cost", value)
                                        }
                                    />
                                </div>
                            </div>            
                            <div key={item.id} className={styles.sityWayFlex}>
                                <div className={styles.sityWayFlexEl}>
                                    <p className={styles.label}>Длительность (ч)</p>
                                    <InputNumber
                                        placeholder="Длительность"
                                        value={item.duration}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateNewCityWayTransport(item.id, "duration", value)
                                        }
                                    />
                                </div>
                                <div className={styles.sityWayFlexEl}>
                                    <p className={styles.label}>Протяжённость (км)</p>
                                    <InputNumber
                                        placeholder="Протяжённость"
                                        value={item.length}
                                        min={0}
                                        onChange={(value, e) =>
                                            updateNewCityWayTransport(item.id, "length", value)
                                        }
                                    />
                                </div>
                            </div>
                            <div key={item.id} className={styles.sityWayFlex}>
                                {index + 1 == newCityWayTransport.length && transport.length >= index + 2? 
                                    <div className={styles.shops__button} onClick={() => {setNewCityWayTransport([...newCityWayTransport, {id: uuidv4(), transport: "", duration: 0, cost: 0, length: 0}])}}><i className='pi pi-plus'></i> Добавить транспорт</div>
                                    :
                                    ""
                                }
                            </div>
                            </>
                            
                        )}
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => createCytiway()} appearance="primary">
                        {loadCityWay? <i className='pi pi-spin pi-spinner'></i> : "Сохранить"}
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance="subtle">
                        Отменить
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
