"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Sitebar.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import MyButton from "../UI/MyInput/MyButton";
import ModalAuth from "../ModalAuth/ModalAuth";

const Sitebar = ({ active, setActive }: any) => {
    const { data: session } = useSession();
    const [isLoad, setIsLoad] = useState(false);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [authEmail, setAuthEmail] = useState<number>(0); // 0 - все кнопки, 1 - войти, 2 - регистрация

    const [sitebar, setSitebar] = useState([
        {
            name: "Главная",
            icon: "pi-home",
            link: "/",
        },
        {
            name: "Каталог",
            icon: "pi-th-large",
            link: "/catalog/all",
        },
        {
            name: "Заказы",
            icon: "pi-shopping-bag",
            link: "/orders",
        },
        {
            name: "Корзина",
            icon: "pi-shopping-cart",
            link: "/checkout",
        },
        {
            name: "Профиль",
            icon: "pi-user",
            link: "/profile",
        },
    ]);

    const [sitebarShop, setSitebarShop] = useState([
        {
            name: "Главная",
            icon: "pi-home",
            link: "/",
        },
        {
            name: "Каталог",
            icon: "pi-th-large",
            link: "/catalog/all",
        },
        {
            name: "Настройки компании",
            icon: "pi-cog",
            link: "/dashboard/settings/",
        },
        {
            name: "Товары компании",
            icon: "pi-barcode",
            link: "/dashboard/products/",
        },
    ]);

    const pathname = usePathname();

    const router = useRouter();

    const Logout = async () => {
        setIsLoad(true);

        axios.post(`/api/basket/delete`).finally(() => {
            setIsLoad(false);
            router.push("/");
            signOut();
        });
    };

    return (
        <div onClick={() => setActive(false)} className={active ? `${styles.Sitebar} ${styles.active}` : `${styles.Sitebar}`}>
            <div onClick={(e) => e.stopPropagation()} className={active ? `${styles.SitebarContent} ${styles.active}` : `${styles.SitebarContent}`}>
                <Link className={styles.logo} href="/">
                    <div className={styles.logositebar}>
                        quick<span>shop</span>
                    </div>
                </Link>

                <div className={styles.menu}>
                    {session?.user.role == "SELLER"
                        ? sitebarShop.map((item: any) => (
                              <Link
                                  onClick={() => setActive(false)}
                                  className={pathname == item.link ? `${styles.active}` : ""}
                                  key={item.name}
                                  href={item.link}>
                                  <i className={`pi ${item.icon}`}></i>
                                  {item.name}
                              </Link>
                          ))
                        : sitebar.map((item: any) => (
                              <Link
                                  onClick={() => setActive(false)}
                                  className={pathname == item.link ? `${styles.active}` : ""}
                                  key={item.name}
                                  href={item.link}>
                                  <i className={`pi ${item.icon}`}></i>
                                  {item.name}
                              </Link>
                          ))}
                </div>

                {session ? (
                    <MyButton
                        disabled={isLoad}
                        onClick={() => {
                            Logout();
                        }}>
                        {!isLoad ? "Выйти" : <i className="pi pi-spin pi-spinner"></i>}
                    </MyButton>
                ) : (
                    <MyButton
                        onClick={() => {
                            setModalActive(true);
                            setAuthEmail(0);
                        }}>
                        Вход / Регистрация
                    </MyButton>
                )}

                <div onClick={() => setActive(false)} className={styles.close}>
                    <i className={`pi pi-times`}></i>
                </div>
            </div>

            <ModalAuth modalActive={modalActive} setModalActive={setModalActive} authEmail={authEmail} setAuthEmail={setAuthEmail}></ModalAuth>
        </div>
    );
};

export default Sitebar;
