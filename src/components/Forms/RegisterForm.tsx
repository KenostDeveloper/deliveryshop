import React, { useState } from "react";
import MyButton from "@/components/UI/MyButton/MyButton";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRegistr } from "@/validations/userSchema";
import style from "./forms.module.scss";
import { toast } from "react-hot-toast";
import { RadioButton } from "primereact/radiobutton";

const RegisterForm = ({ authEmail, setAuthEmail }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaRegistr),
    });

    const [role, setRole] = useState("BUYER");

    const handleSubmitRegister = async (data: any) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
                role: role,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resJSON = await res.json();

        if (resJSON.success == false) {
            toast.error(resJSON.message);
        } else {
            setAuthEmail(1);
            toast.success("Успешная регистрация!");
        }
    };

    return (
        <form className={style.ModalAuth} onSubmit={handleSubmit(handleSubmitRegister)}>
            <div className={style.ModalAuth__title}>Регистрация</div>
            <div>
                <input
                    placeholder="Логин"
                    className={
                        !errors.username
                            ? style.MpInput
                            : `${style.MpInput} ${style.MpInputErrorBorder}`
                    }
                    type="text"
                    {...register("username")}
                />
                <p className={style.MpInputError}>{errors.username?.message?.toString()}</p>
            </div>
            <div>
                <input
                    placeholder="Почта"
                    className={
                        !errors.username
                            ? style.MpInput
                            : `${style.MpInput} ${style.MpInputErrorBorder}`
                    }
                    type="email"
                    {...register("email")}
                />
                <p className={style.MpInputError}>{errors.email?.message?.toString()}</p>
            </div>
            <div>
                <input
                    placeholder="Пароль"
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
                <input
                    placeholder="Повторите пароль"
                    className={
                        !errors.confirmPassword
                            ? style.MpInput
                            : `${style.MpInput} ${style.MpInputErrorBorder}`
                    }
                    type="password"
                    {...register("confirmPassword")}
                />
                <p className={style.MpInputError}>{errors.confirmPassword?.message?.toString()}</p>
            </div>
            <div className="flex align-items-center">
                <RadioButton
                    inputId="ingredient3"
                    name="role"
                    value="BUYER"
                    onChange={(e) => setRole(e.value)}
                    checked={role === "BUYER"}
                />
                <label htmlFor="ingredient3" className="ml-2">
                    Покупатель
                </label>
            </div>
            <div className="flex align-items-center">
                <RadioButton
                    inputId="ingredient4"
                    name="role"
                    value="SELLER"
                    onChange={(e) => setRole(e.value)}
                    checked={role === "SELLER"}
                />
                <label htmlFor="ingredient4" className="ml-2">
                    Компания
                </label>
            </div>
            <MyButton type="submit">Зарегистрироваться</MyButton>
            <p className={style.notAccount}>
                Уже есть аккаунт? <span onClick={() => setAuthEmail(1)}>Войти</span>
            </p>
            <div className={style.agreement}>
                Осуществляя вход или регистрацию, вы соглашаетесь с{" "}
                <Link href="#">Условиями пользования</Link> и{" "}
                <Link href="#">Политикой конфиденциальности</Link>
            </div>
        </form>
    );
};

export default RegisterForm;
