/* eslint-disable @next/next/no-img-element */
'use client'
import React, {useEffect, useState} from 'react';
import styles from './Navbar.module.scss'
import Link from "next/link";
import MpPerson from "@/components/Icons/MpPerson";
import Modal from '@/components/Modal/Modal'
import ModalAuth from "@/components/ModalAuth/ModalAuth";
import {signOut, useSession} from "next-auth/react";
import MyButton from "@/components/UI/MyButton/MyButton";
import Sitebar from '../Sitebar/Sitebar.components';

const Navbar = () => {
    const [modalActive, setModalActive] = useState<boolean>(false)
    const [authEmail, setAuthEmail] = useState<number>(0) // 0 - все кнопки, 1 - войти, 2 - регистрация
    const {data: session} = useSession();
    const [sitebar, setSitebar] = useState(false);

    useState(() => {
        console.log(session);
    })

    const noUser = () => {
        return(
            <button className={`${styles.nav__button} ${styles["nav__button--yellow"]}`} onClick={() => {
                setModalActive(true)
                setAuthEmail(0)
            }}>
                Вход / Регистрация
            </button>
        )
    }

    const userProfile = () => {
        return (
            // <div className="flex justify-center items-center">
                // {/*<Image src={} alt={}></Image>*/}
                // {/* <MyButton onClick={() => signOut()}>Выйти</MyButton> */}
                // {/* {`${session?.user?.username}`} */}

                <button className={`${styles.nav__button} ${styles["nav__button--yellow"]}`} onClick={() => signOut()}>Выйти</button>
            // </div>
        )
    }

    return (
        <nav className={styles.nav}>
            <Sitebar active={sitebar} setActive={setSitebar}/>
            <div className={`${styles.nav__container} container`}>
                <div className={`${styles["nav__start-container"]}`}>
                    <div className={styles.sitebarButton} onClick={() => setSitebar(true)}>
                        <i className='pi pi-bars'></i>
                    </div>
                    <Link href="/" className={`${styles["nav__title-container"]}`}>
                        <div className={styles.logo}>quick<span>shop</span></div>
                    </Link>
                    <button className={`${styles.nav__button} ${styles["nav__button--transparent"]} ${styles.nav__location}`}>
                        <i className={`${styles["nav__location-icon"]} pi pi-map-marker`}></i>
                        <p className={`${styles.nav__text}`}>Пермь</p>
                    </button>
                    <div className={`${styles.nav__search}`}>
                        <input type="text" className={`${styles["nav__search-input"]}`} placeholder="поиск"/>
                        <button>
                            <i className={`${styles["nav__search-icon"]} pi pi-search`}></i>
                        </button>
                    </div>
                </div>

                <div className={`${styles["nav__buttons-container"]}`}>
                    <button className={`${styles.nav__button} ${styles.nav__catalog}`}>
                        <i className={`${styles["nav__catalog-icon"]} pi pi-th-large`}></i>
                        <p className={`${styles.nav__text}`}>каталог</p>
                    </button>

                    {session ?
                        userProfile()
                        :
                        noUser()
                    }

                    <Link href="/checkout" className={`${styles.nav__button} ${styles.nav__basket} ${styles["nav__button--transparent"]} ${styles.nav__cart}`}>
                        <i className={`${styles["nav__cart-icon"]} pi pi-shopping-cart`}></i>
                    </Link>
                </div>

                
            </div>
            





            {/* <Link href="/" className={styles.logo}>mine<span>post</span></Link> */}
                
            <ModalAuth modalActive={modalActive} setModalActive={setModalActive} authEmail={authEmail} setAuthEmail={setAuthEmail}></ModalAuth>
        </nav>
    );
};

export default Navbar;