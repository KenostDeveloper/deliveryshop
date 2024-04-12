"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaChangePassword } from "@/validations/userSchema";
import style from "@/components/Forms/forms.module.scss";
import MyButton from "@/components/UI/MyButton/MyButton";
import Link from "next/link";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import Title from "../UI/Title.components";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import Loading from "../Helps/Loading";

const ChangePasswordForm = ({ token }: { token: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaChangePassword),
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoad, setIsLoad] = useState(false);

    const router = useRouter();

    useEffect(() => {
        async function checkForgotPassword() {
            const res = await axios.post(
                "/api/auth/get-forgot-password",
                JSON.stringify({ token: token })
            );

            if (!res.data.success) {
                toast.error("Ссылка недействительна");
                router.push("/");
            } else {
                setIsSuccess(true);
            }
        }

        checkForgotPassword();
    }, []);

    const handleSubmitChange = async (data: any) => {
        setIsLoad(true);

        const res = await axios.put("/api/auth/change-password", {
            password: data.password,
        });

        if (res.data.success) {
            toast.success(res.data.message);
            router.push("/");
        } else {
            toast.error(res.data.message);
        }

        setIsLoad(false);
    };

    if (!isSuccess) {
        return <Loading />;
    }

    return (
        <div className="container">
            <form
                className={`${style.ModalAuth} ${style["change-form"]}`}
                onSubmit={handleSubmit(handleSubmitChange)}>
                <Title text="Восстановление пароля" margin={true} />
                <div>
                    <label htmlFor="password" className={`${style["change-form__label"]}`}>
                        Пожалуйста, введите пароль
                    </label>
                    <input
                        placeholder="Введите пароль"
                        id="password"
                        className={
                            !errors.password
                                ? style.MpInput
                                : `${style.MpInput} ${style.MpInputErrorBorder}`
                        }
                        type="password"
                        {...register("password")}
                    />
                    <p className={style.MpInputError}>{errors.password?.message?.toString()}</p>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className={`${style["change-form__label"]}`}>
                        Повторите пароль
                    </label>
                    <input
                        placeholder="Подвердите пароль"
                        className={
                            !errors.confirmPassword
                                ? style.MpInput
                                : `${style.MpInput} ${style.MpInputErrorBorder}`
                        }
                        type="password"
                        {...register("confirmPassword")}
                    />
                    <p className={style.MpInputError}>
                        {errors.confirmPassword?.message?.toString()}
                    </p>
                </div>
                <MyButton type="submit" disabled={isLoad}>{!isLoad ? "Сохранить пароль" : <i className="pi pi-spin pi-spinner"></i>}</MyButton>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
