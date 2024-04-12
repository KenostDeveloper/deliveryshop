"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFogotPassword } from "@/validations/userSchema";
import style from "@/components/Forms/forms.module.scss";
import MyButton from "@/components/UI/MyButton/MyButton";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";
import { isDirty } from "zod";

const ForgotPasswordForm = ({ authEmail, setAuthEmail, setModalActive }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaFogotPassword),
    });

    const [isLoad, setIsLoad] = useState(false);

    const handleSubmitForgot = async (data: any) => {
        setIsLoad(true);
        
        // Отправка сообщения со сгенерированным кодом
        const res = await axios.post("/api/auth/fogot", {
            email: data.email,
        });

        if (res?.status !== 200) {
            toast.error(res.statusText);
        } else {
            toast.success("Код отправлен");

            setModalActive(false);
        }

        setIsLoad(false);
    };

    return (
        <form className={style.ModalAuth} onSubmit={handleSubmit(handleSubmitForgot)}>
            <div className={style.ModalAuth__title}>Восстановление пароля</div>

            <div>
                <input
                    placeholder="Почта или логин"
                    className={
                        !errors.email
                            ? style.MpInput
                            : `${style.MpInput} ${style.MpInputErrorBorder}`
                    }
                    type="text"
                    {...register("email")}
                />
                <p className={style.MpInputError}>{errors.email?.message?.toString()}</p>
            </div>

            <MyButton type="submit" disabled={isLoad}>{!isLoad ? "Отправить код" : <i className="pi pi-spin pi-spinner"></i>}</MyButton>
        </form>
    );
};

export default ForgotPasswordForm;
