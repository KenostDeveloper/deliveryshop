'use client'
import React, {useState} from 'react';
import style from './CardPost.module.css'
import Link from "next/link";
import Image from "next/image";
import MpPlus from "@/components/Icons/MpPlus";
import MpTreePoint from "@/components/Icons/MpTreePoint";
import MpContirm from "@/components/Icons/MpContirm";
import {bool} from "prop-types";

const CardPost = () => {

    const [isSubscribe, setIsSubscribe] = useState<boolean>(false)

    return (
        <div className={style.CardPost}>
            <div className={style.CardPost__control}>
                <Link href="#" className={style.user}>
                    <Image src="/avatar.jpg" alt="Аватарка" width={32} height={32}></Image>
                    Kenost
                </Link>
                <div className={style.CardPost__add}>
                    <span>4 часа назад</span>
                    <div onClick={() => setIsSubscribe(!isSubscribe)}>{isSubscribe? <div className={style.unsubscribe}><MpContirm /></div> : <MpPlus />}</div>
                    <MpTreePoint/>
                </div>
            </div>
        </div>
    );
};

export default CardPost;