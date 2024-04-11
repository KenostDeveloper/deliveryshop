/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./CatalogMenu.module.css";
// import CatalogMenuItem from '../CatalogMenuItem/CatalogMenuItem.component';
import axios from "axios";
import Link from "next/link";

const CatalogMenu = (params: any) => {
    const [category, setCategory] = useState<any>([]);

    useEffect(() => {
        axios.get(`/api/products/category`).then((res) => {
            setCategory(res.data?.category);
        });
    }, []);

    return (
        <div className={styles.menu}>
            <ul>
                {/* <Link key={item.id} href={`/catalog/${item.id}`}><img src={`/catalogMenu/${item.id}.svg`} alt="" /> */}
                <Link
                    href={`/catalog/all`}
                    className={params.params == `all` ? `${styles.active}` : ``}>
                    <img src={`/catalogMenu/all.svg`} alt="" />
                    Все товары
                </Link>
                {category.map((item: any) => (
                    <Link
                        key={item.id}
                        href={`/catalog/${item.id}`}
                        className={params.params == `${item.id}` ? `${styles.active}` : ``}>
                        <img src={`/catalogMenu/${item.id}.svg`} alt="" />
                        {item.name}
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default CatalogMenu;
