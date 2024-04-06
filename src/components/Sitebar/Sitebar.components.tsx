'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './Sitebar.module.css'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import {useSession} from "next-auth/react";

const Sitebar = ({active, setActive}:any) => {

    const {data: session} = useSession();
    
    const [sitebar, setSitebar] = useState([
        {
            name: "Главная",
            icon: "pi-home",
            link: "/"
        },
        {
            name: "Каталог",
            icon: "pi-th-large",
            link: "/catalog"
        },
    ])

    const [sitebarShop, setSitebarShop] = useState([
        {
            name: "Настройки компании",
            icon: "pi-cog",
            link: "/dashboard/settings/"
        },
        {
            name: "Товары компании",
            icon: "pi-barcode",
            link: "/dashboard/products/"
        },
    ])

    const pathname = usePathname()


    return (
        <div onClick={() => setActive(false)} className={active? `${styles.Sitebar} ${styles.active}` : `${styles.Sitebar}`}>
            <div onClick={(e) => e.stopPropagation()} className={active? `${styles.SitebarContent} ${styles.active}` : `${styles.SitebarContent}`}>
                <Link className={styles.logo} href="/"><div className={styles.logositebar}>quick<span>shop</span></div></Link>

                <div className={styles.menu}>
                    {sitebar.map((item:any) => <Link onClick={() => setActive(false)} className={pathname == item.link? `${styles.active}` : ""} key={item.name} href={item.link}><i className={`pi ${item.icon}`}></i>{item.name}</Link>)}
                    {session?.user.role == "SELLER" ? sitebarShop.map((item:any) => <Link onClick={() => setActive(false)} className={pathname == item.link? `${styles.active}` : ""} key={item.name} href={item.link}><i className={`pi ${item.icon}`}></i>{item.name}</Link>)  : ""}
                </div>

                <div onClick={() => setActive(false)} className={styles.close}>
                    <i className={`pi pi-times`}></i>
                </div>
            </div>
        </div>
    );
};

export default Sitebar;