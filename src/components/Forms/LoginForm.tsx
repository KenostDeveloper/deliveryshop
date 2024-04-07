import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "@/validations/userSchema";
import style from "@/components/Forms/forms.module.scss";
import MyButton from "@/components/UI/MyButton/MyButton";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

const LoginForm = ({ authEmail, setAuthEmail, setModalActive }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaLogin),
    });

    const handleSubmitLogin = async (data: any) => {
        const res = await signIn("credentials", {
            usernameOrEmail: data.usernameOrEmail,
            password: data.password,
            redirect: true,
        });

        if (res?.error) {
            toast.error(res?.error);
        } else {
            setModalActive(false);
            toast.success("Успешная авторизация!");
        }
    };

    return (
        <form className={style.ModalAuth} onSubmit={handleSubmit(handleSubmitLogin)}>
            <div className={style.ModalAuth__title}>Войти</div>

            <div>
                <input
                    placeholder="Почта или логин"
                    className={
                        !errors.usernameOrEmail
                            ? style.MpInput
                            : `${style.MpInput} ${style.MpInputErrorBorder}`
                    }
                    type="text"
                    {...register("usernameOrEmail")}
                />
                <p className={style.MpInputError}>{errors.usernameOrEmail?.message?.toString()}</p>
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

            <MyButton type="submit">Войти</MyButton>
            <p className={style.notAccount}>
                Ещё нет аккаунта? <span onClick={() => setAuthEmail(2)}>Зарегистрироваться</span>
            </p>
            <p className={style.notAccount}>
                Забыли пароль? <span onClick={() => setAuthEmail(3)}>Восстановить</span>
            </p>
            <div className={style.agreement}>
                Осуществляя вход или регистрацию, вы соглашаетесь с{" "}
                <Link href="#">Условиями пользования</Link> и{" "}
                <Link href="#">Политикой конфиденциальности</Link>
            </div>
        </form>
    );
};

export default LoginForm;
