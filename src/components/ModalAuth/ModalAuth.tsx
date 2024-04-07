'use client'
import React, {useEffect, useState} from 'react';
import style from './ModalAuth.module.css'
import Modal from "@/components/Modal/Modal";
import MpMail from "@/components/Icons/MpMail";
import MpDiscord from "@/components/Icons/MpDiscord";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import RegisterForm from "@/components/Forms/RegisterForm";
import LoginForm from "@/components/Forms/LoginForm";
import {signIn} from "next-auth/react";
import ChangePassword from '../Forms/ForgotPassword';

const ModalAuth = ({modalActive, setModalActive, authEmail, setAuthEmail}: any) => {
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const router = useRouter();
    const dialogRef = searchParams.get('modalRegister')

    //Открытие модального окна ссылкой https://host/?modalRegister=true
    useEffect(() => {
        if(dialogRef === "true"){
            setModalActive(true)
            // @ts-ignore
            const nextSearchParams = new URLSearchParams(searchParams.toString())
            nextSearchParams.delete('modalRegister')

            router.replace(`${pathname}?${nextSearchParams}`)
            // router.replace('?modalRegister', undefined, { shallow: true });
        }
    }, []);

    return (
        <Modal active={modalActive} setActive={setModalActive} authEmail={authEmail} setAuthEmail={setAuthEmail}>
            {authEmail == 0?
                <div className={style.ModalAuth}>
                    <p className={style.ModalAuth__title}>Войти с помощью</p>
                    <div className={`${style.ModalAuth__el} ${style.ModalAuth__discord}`} onClick={() => signIn("twitch")}><MpDiscord/> Twitch</div>
                    <div className={`${style.ModalAuth__el} ${style.ModalAuth__discord}`} onClick={() => signIn("vk")}><MpDiscord/> ВКонтакте</div>
                    <div className={`${style.ModalAuth__el} ${style.ModalAuth__discord}`} onClick={() => signIn("discord")}><MpDiscord/> Discord</div>
                    <div className={style.ModalAuth__el} onClick={() => setAuthEmail(true)}><MpMail/> Почта</div>
                </div>
                :
                authEmail == 1?
                <LoginForm setModalActive={setModalActive} authEmail={authEmail} setAuthEmail={setAuthEmail}/>
                :
                authEmail == 2?
                <RegisterForm authEmail={authEmail} setAuthEmail={setAuthEmail}/>
                :
                <ChangePassword authEmail={authEmail} setAuthEmail={setAuthEmail} setModalActive={setModalActive} />
            }
        </Modal>
    );
};

export default ModalAuth;