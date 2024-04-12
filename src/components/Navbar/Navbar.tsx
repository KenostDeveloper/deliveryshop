/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import MpPerson from "@/components/Icons/MpPerson";
import Modal from "@/components/Modal/Modal";
import ModalAuth from "@/components/ModalAuth/ModalAuth";
import { signOut, useSession } from "next-auth/react";
import MyButton from "@/components/UI/MyButton/MyButton";
import Sitebar from "../Sitebar/Sitebar.components";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import CitySelectForm from "../Forms/CitySelectForm";

const Navbar = () => {
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [cityModalActive, setCityModalActive] = useState<boolean>(false);

    const [authEmail, setAuthEmail] = useState<number>(0); // 0 - все кнопки, 1 - войти, 2 - регистрация
    const { data: session } = useSession();
    const [sitebar, setSitebar] = useState(false);

    const [userCity, setUserCity] = useState({
        id: 0,
        name: "",
    });

    const [cityWithoutUser, setCityWithoutUser] = useState({
        id: 0,
        name: "",
    });

    const [isLoad, setIsLoad] = useState(false);

    // useState(() => {
    //     console.log(session);
    // });
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/profile/city/?id=true").then((res) => {
            setUserCity(res.data.city);
            setCityWithoutUser(res.data.city);
        });
    }, []);

    const Logout = async () => {
        setIsLoad(true);

        axios.post(`/api/basket/delete`).finally(() => {
            setIsLoad(false);
            router.push("/");
            signOut();
        });
    };

    const noUser = () => {
        return (
            <>
                <button
                    className={`${styles.nav__button} ${styles["nav__button--yellow"]} ${styles["nav__auth-button"]}`}
                    onClick={() => {
                        setModalActive(true);
                        setAuthEmail(0);
                    }}>
                    Вход / Регистрация
                </button>
                <Link
                    href="/checkout"
                    className={`${styles.nav__button} ${styles.nav__basket} ${styles["nav__button--transparent"]} ${styles.nav__cart}`}>
                    <i className={`${styles["nav__cart-icon"]} pi pi-shopping-cart`}></i>
                </Link>
            </>
        );
    };

    const userProfile = () => {
        return (
            // <div className="flex justify-center items-center">
            // {/*<Image src={} alt={}></Image>*/}
            // {/* <MyButton onClick={() => signOut()}>Выйти</MyButton> */}
            // {/* {`${session?.user?.username}`} */}

            <button
                className={`${styles.nav__button} ${styles["nav__button--yellow"]} ${styles["nav__auth-button"]}`}
                disabled={isLoad}
                onClick={() => {
                    Logout();
                }}>
                {!isLoad ? "Выйти" : <i className="pi pi-spin pi-spinner"></i>}
            </button>
            // </div>
        );
    };

    // const openRate = () => {
    //     setModalActive(true)
    //     setAuthEmail(4);
    // }

    return (
        <nav className={styles.nav}>
            <Sitebar active={sitebar} setActive={setSitebar} />
            <div className={`${styles.nav__container} container`}>
                <div className={`${styles["nav__start-container"]}`}>
                    <div className={styles.sitebarButton} onClick={() => setSitebar(true)}>
                        <i className="pi pi-bars"></i>
                    </div>
                    <Link href="/" className={`${styles["nav__title-container"]}`}>
                        <div className={styles.logo}>
                            quick<span>shop</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setCityModalActive(true)}
                        className={`${styles.nav__button} ${styles["nav__button--transparent"]} ${styles.nav__location}`}>
                        <i className={`${styles["nav__location-icon"]} pi pi-map-marker`}></i>
                        <p className={`${styles.nav__text}`}>{session?.user?.id ? userCity?.name : cityWithoutUser?.name}</p>
                    </button>
                    <div className={`${styles.nav__search}`}>
                        <input type="text" className={`${styles["nav__search-input"]}`} placeholder="поиск" />
                        <button>
                            <i className={`${styles["nav__search-icon"]} pi pi-search`}></i>
                        </button>
                    </div>
                </div>

                <div className={`${styles["nav__buttons-container"]}`}>
                    <button className={`${styles.nav__button} ${styles.nav__catalog}`} onClick={() => router.push("/catalog/all")}>
                        <i className={`${styles["nav__catalog-icon"]} pi pi-th-large`}></i>
                        <p className={`${styles.nav__text}`}>каталог</p>
                    </button>

                    {session ? userProfile() : noUser()}

                    <div className={styles.mobileLocation}>
                        <button
                            onClick={() => setCityModalActive(true)}
                            className={`${styles.nav__button} ${styles["nav__button--transparent"]} ${styles.nav__location}`}>
                            <i className={`${styles["nav__location-icon"]} pi pi-map-marker`}></i>
                            <p className={`${styles.nav__text}`}>{session?.user?.id ? userCity?.name : cityWithoutUser?.name}</p>
                        </button>
                    </div>

                    {session?.user.role == "BUYER" && (
                        <Link
                            href="/checkout"
                            className={`${styles.nav__button} ${styles.nav__basket} ${styles["nav__button--transparent"]} ${styles.nav__cart}`}>
                            <i className={`${styles["nav__cart-icon"]} pi pi-shopping-cart`}></i>
                        </Link>
                    )}
                </div>
            </div>

            {/* <Link href="/" className={styles.logo}>mine<span>post</span></Link> */}

            <ModalAuth modalActive={modalActive} setModalActive={setModalActive} authEmail={authEmail} setAuthEmail={setAuthEmail}></ModalAuth>

            <Modal active={cityModalActive} setActive={setCityModalActive}>
                <CitySelectForm city={userCity} setCity={setUserCity} setActive={setCityModalActive} setCityWithoutUser={setCityWithoutUser} />
            </Modal>
        </nav>
    );
};

export default Navbar;
