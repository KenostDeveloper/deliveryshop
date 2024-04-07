/* eslint-disable @next/next/no-img-element */
'use client'
import styles from './products.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import { Input, InputPicker, Toggle } from 'rsuite';
import MyButton from '@/components/UI/MyInput/MyButton';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Products() {

    const inputFile = useRef<any>(null);
    const [selectedFile, setSelectedFile] = useState<File>();


    const [loading, setLoading] = useState(true)
    const {data: session} = useSession();

    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get(`/api/products/category`).then((res) => {
            setCategories(res.data?.category.map((item: any) => ({
                label: item.name,
                value: item.id,
            })));
        });
    }, [])

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        category: "", //Сатегория
        length: "", //Длинна
        width: "", //Ширина
        height: "", //Высота
        weight: "", //Вес
        description: "",
        status: true
    })

    const hendlerInput = () => {
        inputFile.current.click();
    };

    const createProduct = async () => {
        const formData = new FormData();
        if(selectedFile){
            formData.append("file", selectedFile);
        }
        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("category", newProduct.category);
        formData.append("length", newProduct.length);
        formData.append("width", newProduct.width);
        formData.append("height", newProduct.height);
        formData.append("weight", newProduct.weight);
        formData.append("description", newProduct.description);
        formData.append("status", `${newProduct.status}`);

        axios
        .post(`/api/products`, formData)
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                // setProfile(res.data.profile)
            } else {
                toast.error(res.data.message);
            }
        })
    };

    useEffect(() => {
        if(typeof(session) == "object"){
            setLoading(false)
        }
    }, [session]);

    if(loading){
        return <Loading/>
    }

    if(session == null){
        return (
            <div>Вы не авторизированы</div>
        )
    }

    return (
        <div className={`${styles.main} main`}>
            <div className={`${styles.container} container`}>
                <div className='kenost-window'>
                    <div className='kenost-title'>Добавить новый товар</div>
                    <div className={styles.addProduct}>
                        <div className={styles.addProductLeft}>
                            <p className={styles.label}>Название товара</p>
                            <Input
                                placeholder="Введите название товара"
                                value={newProduct.name}
                                onChange={(value, e) => setNewProduct({...newProduct, name: value})}
                            />
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Цена товара</p>
                                    <Input
                                        placeholder="Введите цену"
                                        value={newProduct.price}
                                        onChange={(value, e) => setNewProduct({...newProduct, price: value})}
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Категория товара</p>
                                    <InputPicker
                                        className="shop__input"
                                        data={categories}
                                        value={newProduct.category}
                                        onChange={(value: any) => setNewProduct({...newProduct, category: value})}
                                        placeholder="Выберите город"
                                    />
                                </div>
                            </div>
                            <div className={styles.addProductFlex}>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Длина</p>
                                    <Input
                                        placeholder="Длина (мм)"
                                        value={newProduct.length}
                                        onChange={(value, e) => setNewProduct({...newProduct, length: value})}
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Ширина</p>
                                    <Input
                                        placeholder="Ширина (мм)"
                                        value={newProduct.width}
                                        onChange={(value, e) => setNewProduct({...newProduct, width: value})}
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Высота</p>
                                    <Input
                                        placeholder="Высота (мм)"
                                        value={newProduct.height}
                                        onChange={(value, e) => setNewProduct({...newProduct, height: value})}
                                    />
                                </div>
                                <div className={styles.addProductFlexEl}>
                                    <p className={styles.label}>Вес</p>
                                    <Input
                                        placeholder="Вес (г)"
                                        value={newProduct.weight}
                                        onChange={(value, e) => setNewProduct({...newProduct, weight: value})}
                                    />
                                </div>
                            </div>
                            <p className={`${styles.label} ${styles.marginTop}`}>Описание</p>
                            <Input 
                            as="textarea"
                            rows={3} 
                            placeholder="Описание вашего товара"
                            value={newProduct.description}
                            onChange={(value, e) => setNewProduct({...newProduct, description: value})} />
                            <div className={styles.addProductFlex}>
                                <MyButton onClick={() => createProduct()}>Добавить</MyButton>
                                <Toggle checkedChildren="On" unCheckedChildren="Off" checked={newProduct.status} onChange={(value) => setNewProduct({...newProduct, status: value})}/>
                            </div>
                        </div>
                        <div className={styles.addProductRight}>
                            <input onChange={
                                ({target}) => {
                                    if(target.files){
                                        const file = target.files[0];
                                        setSelectedFile(file)
                                    }
                                }
                            } type="file" ref={inputFile} className="hidden"/>
                            <p className={styles.label}>Изображения товара</p>
                            <div className={styles.addProductImage} onClick={ hendlerInput }><i className='pi pi-image'></i></div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
