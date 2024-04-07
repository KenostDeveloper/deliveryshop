import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaFogotPassword } from "@/validations/userSchema";
import style from "@/components/Forms/forms.module.css";
import MyButton from "@/components/UI/MyButton/MyButton";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";

const ChangePassword = ({ authEmail, setAuthEmail, setModalActive }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaFogotPassword),
    });

    const handleSubmitLogin = async (data: any) => {
        // const res = await signIn('credentials', {
        //     usernameOrEmail: data.usernameOrEmail,
        //     password: data.password,
        //     redirect: true
        // })

        // if(res?.error){
        //     toast.error(res?.error)
        // }else{
        //     setModalActive(false)
        //     toast.success("Успешная авторизация!")
        // }

        console.log("as;dlkasd;l");

        // Отправка сообщения со сгенерированным кодом
        const res = await axios.post("/auth/fogot", data);

        if (res?.status !== 200) {
        }
    };

    return (
        <form className={style.ModalAuth} onSubmit={handleSubmit(handleSubmitLogin)}>
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

            <MyButton type="submit">Получить код</MyButton>
        </form>
    );
};

export default ChangePassword;
