/* eslint-disable @next/next/no-img-element */
'use client'
import styles from './products.module.scss'
import React, {useEffect, useRef, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import { Input } from 'rsuite';

export default function Products() {

    const [loading, setLoading] = useState(true)
    const {data: session} = useSession();

    const [newProduct, setNewProduct] = useState({
        name: ""
    })


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
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
