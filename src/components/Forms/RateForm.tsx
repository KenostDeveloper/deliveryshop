"use client";

import { useForm } from "react-hook-form";
import Title from "../UI/Title.components";
import styles from "./forms.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRate } from "@/validations/userSchema";
import { Input } from "rsuite";
import { useEffect, useState } from "react";
import MyButton from "@/components/UI/MyButton/MyButton";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const RateForm = ({ productId, setActive, setOrder, orderId }: { productId: number, setActive: any, setOrder: any, orderId: number }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaRate),
    });

    const [isLoad, setIsLoad] = useState(false);

    const { data: session, update } = useSession();

    const [rate, setRate] = useState(0);
    const [advantages, setAdvantages] = useState("");
    const [disAdvantages, setDisAdvantages] = useState("");
    const [comment, setComment] = useState("");

    const sendRate = async () => {
        setIsLoad(true);

        const res = await axios.post(`/api/rating`, {
            user_id: session?.user.id,
            product_id: productId,
            rate: rate,
            advantages: advantages,
            disAdvantages: disAdvantages,
            comment: comment,
        });

        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }

        toast.success(res.data.message);
        setActive(false);
        
        axios.get(`/api/orders?id=${orderId}`).then((res) => {
            if(res.data.success){
                setOrder(res.data?.order);
            }
        });

        setIsLoad(false);
    };

    return (
        <form className={`${styles["rate-form"]}`}>
            <Title text="Оцените товар" margin={false} className={`${styles["title"]}`} />
            <div>
                <div className={`${styles["input-container"]} ${styles["input-container--rate"]}`}>
                    <p className={`${styles["change-form__label"]}`}>Оценка</p>
                    <div className={`${styles["input-rate-container"]}`}>
                        <i onClick={() => setRate(1)}
                            className={`pi ${
                                rate > 0 ? `${styles.active}` : `${styles.noActive}`
                            } pi-star-fill`}></i>
                        <i onClick={() => setRate(2)}
                            className={`pi ${
                                rate > 1 ? `${styles.active}` : `${styles.noActive}`
                            } pi-star-fill`}></i>
                        <i onClick={() => setRate(3)}
                            className={`pi ${
                                rate > 2 ? `${styles.active}` : `${styles.noActive}`
                            } pi-star-fill`}></i>
                        <i onClick={() => setRate(4)}
                            className={`pi ${
                                rate > 3 ? `${styles.active}` : `${styles.noActive}`
                            } pi-star-fill`}></i>
                        <i onClick={() => setRate(5)}
                            className={`pi ${
                                rate > 4 ? `${styles.active}` : `${styles.noActive}`
                            } pi-star-fill`}></i>
                    </div>
                </div>
            </div>
            <div className={styles["input-container"]}>
                <label htmlFor="advantages" className={`${styles["change-form__label"]}`}>
                    Достоинства
                </label>
                <Input
                    as="textarea"
                    rows={2}
                    placeholder=""
                    value={advantages}
                    onChange={(value, e) => {
                        setAdvantages(e.target.value);
                    }}
                    id="advantages"
                    className={
                        !errors.advantages
                            ? styles.MpInput
                            : `${styles.MpInput} ${styles.MpInputErrorBorder} ${styles.input}`
                    }
                />
                <p className={styles.MpInputError}>{errors.advantages?.message?.toString()}</p>
            </div>
            <div className={styles["input-container"]}>
                <label htmlFor="disAdvantages" className={`${styles["change-form__label"]}`}>
                    Недостатки
                </label>
                <Input
                    as="textarea"
                    rows={2}
                    placeholder=""
                    value={disAdvantages}
                    onChange={(value, e) => {
                        setDisAdvantages(e.target.value);
                    }}
                    id="disAdvantages"
                    className={
                        !errors.disAdvantages
                            ? styles.MpInput
                            : `${styles.MpInput} ${styles.MpInputErrorBorder} ${styles.input}`
                    }
                />
                <p className={styles.MpInputError}>{errors.disAdvantages?.message?.toString()}</p>
            </div>
            <div className={styles["input-container"]}>
                <label htmlFor="comment" className={`${styles["change-form__label"]}`}>
                    Комментарий
                </label>
                <Input
                    as="textarea"
                    rows={2}
                    placeholder=""
                    value={comment}
                    onChange={(value, e) => {
                        setComment(e.target.value);
                    }}
                    id="comment"
                    className={
                        !errors.comment
                            ? styles.MpInput
                            : `${styles.MpInput} ${styles.MpInputErrorBorder} ${styles.input}`
                    }
                />
                <p className={styles.MpInputError}>{errors.comment?.message?.toString()}</p>
            </div>
            <MyButton
                type="button"
                className={styles["button-rate"]}
                disabled={isLoad}
                onClick={() => {
                    sendRate();
                }}>
                {!isLoad ? "Отправить" : <i className="pi pi-spin pi-spinner"></i>}
            </MyButton>
        </form>
    );
};

export default RateForm;
