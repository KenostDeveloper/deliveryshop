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
import { InputPicker } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import NotFound from '@/components/NotFound/NotFound';
import { Modal, ButtonToolbar, Button, RadioGroup, Radio, Placeholder } from 'rsuite';


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
    const [newCityWay, setNewCityWay] = useState({
        city1: "",
        city2: ""
    })

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
                </div>

                <Modal keyboard={false} open={open} onClose={() => setOpen(false)}>
                    <Modal.Header>
                        <Modal.Title>Добавить маршрут</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className={styles.sityWayFlex}>
                            <InputPicker
                                data={city}
                                value={newCityWay.city1}
                                onChange={(value) => setNewCityWay({...newCityWay, city1: value})}
                                placeholder="Выберите город"
                            />
                            <InputPicker
                                data={city}
                                value={newCityWay.city2}
                                onChange={(value) => setNewCityWay({...newCityWay, city2: value})}
                                placeholder="Выберите город"
                            />
                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => setOpen(false)} appearance="primary">
                        Сохранить
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
