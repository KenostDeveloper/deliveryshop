import { schemaCancelOrder } from "@/validations/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import styles from "./forms.module.scss";
import { Input } from "rsuite";
import { useState } from "react";
import MyButton from "../UI/MyInput/MyButton";
import toast from "react-hot-toast";
import axios from "axios";
import Title from "../UI/Title.components";

const CancelOrderForm = ({
    order,
    action,
    setActive,
}: {
    order: any;
    action: any;
    setActive: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaCancelOrder),
    });

    const [message, setMessage] = useState("");
    const [isLoad, setIsLoad] = useState(false);

    const handleSubmitCancelOrder = async (e: any) => {
        setIsLoad(true);

        e.preventDefault();

        if (!message) {
            toast.error("Пожалуйста, заполните все поля!");
            return;
        }

        const res = await axios.post(`/api/order-cancells`, {
            order_id: order?.id,
            message,
        });

        if (res.data.success) {
            toast.success(res.data.message);

            action("Отменен");

            setActive(false);
        } else {
            toast.error(res.data.message);
        }

        setIsLoad(false);
    };

    return (
        <form className={`${styles.ModalAuth} ${styles["rate-form"]}`} onSubmit={handleSubmitCancelOrder}>
            <Title text="Отказ от заказа" margin={false} className={`${styles["title"]}`} />
            <div
                className={`${styles["input-container"]} ${styles["cancel-form__input-container"]}`}>
                <label
                    htmlFor="advantages"
                    className={`${styles["change-form__label"]} ${styles["cancel-form__label"]}`}>
                    Причина отказа
                </label>
                <Input
                    as="textarea"
                    rows={5}
                    placeholder="Причина"
                    value={message}
                    onChange={(value, e) => {
                        setMessage(e.target.value);
                    }}
                    id="advantages"
                    className={
                        !errors.advantages
                            ? styles.MpInput
                            : `${styles.MpInput} ${styles.MpInputErrorBorder} ${styles.input}`
                    }
                />
                <p className={styles.MpInputError}>{errors.advantages?.message?.toString()}</p>
                <MyButton type="submit" disabled={isLoad}>{!isLoad ? "Отправить" : <i className="pi pi-spin pi-spinner"></i>}</MyButton>
            </div>
        </form>
    );
};

export default CancelOrderForm;
