"use client";

import { useForm } from "react-hook-form";
import Title from "../UI/Title.components";
import styles from "./forms.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRate } from "@/validations/userSchema";
import { Input } from "rsuite";
import { useEffect, useState } from "react";
import MyButton from "@/components/UI/MyButton/MyButton";

const RateForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaRate),
    });

    const [rate, setRate] = useState(0);
    const [rateFixed, setRateFixed] = useState(0);
    const [advantages, setAdvantages] = useState("");
    const [disAdvantages, setDisAdvantages] = useState("");
    const [comment, setComment] = useState("");

    return (
        <form className={`${styles["rate-form"]}`}>
            <Title text="Оцените товар" margin={false} className={`${styles["title"]}`} />
            <div>
                <div className={`${styles["input-container"]} ${styles["input-container--rate"]}`}>
                    <p className={`${styles["change-form__label"]}`}>Оценка</p>
                    <div className={`${styles["input-rate-container"]}`}>
                        <label
                            htmlFor="rate1"
                            onMouseEnter={() => setRate(1)}
                            onMouseLeave={() => setRate(0)}
                            className={`${styles["label-rate"]} ${styles["label-rate--1"]}`}>
                            <svg
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.679 1.1163C15.0271 0.31332 16.1659 0.313319 16.514 1.1163L20.0325 9.23228C20.1796 9.57151 20.5018 9.80191 20.8704 9.83135L29.8841 10.5512C30.7779 10.6226 31.1333 11.7435 30.4439 12.3169L23.641 17.9751C23.3472 18.2195 23.2183 18.6099 23.309 18.9812L25.3789 27.4576C25.5885 28.316 24.6634 29.0045 23.9013 28.5573L16.1026 23.981C15.7901 23.7976 15.4029 23.7976 15.0904 23.981L7.29168 28.5573C6.52962 29.0045 5.60452 28.316 5.81412 27.4576L7.884 18.9812C7.97466 18.6099 7.84581 18.2195 7.55201 17.9751L0.749052 12.3169C0.0596786 11.7435 0.41509 10.6226 1.3089 10.5512L10.3226 9.83135C10.6911 9.80191 11.0134 9.57151 11.1605 9.23228L14.679 1.1163Z"
                                    fill={rateFixed >= 1 || rate >= 1 ? "#FFF500" : "#F2F2F2"}
                                />
                            </svg>
                        </label>
                        <input
                            type="radio"
                            name="rate"
                            id="rate1"
                            onChange={(e) => setRateFixed(1)}
                            className={`${styles["input-rate"]} ${styles["input-rate--1"]}`}
                        />
                        <label
                            htmlFor="rate2"
                            onMouseEnter={() => setRate(2)}
                            onMouseLeave={() => setRate(0)}
                            className={`${styles["label-rate"]} ${styles["label-rate--2"]}`}>
                            <svg
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.679 1.1163C15.0271 0.31332 16.1659 0.313319 16.514 1.1163L20.0325 9.23228C20.1796 9.57151 20.5018 9.80191 20.8704 9.83135L29.8841 10.5512C30.7779 10.6226 31.1333 11.7435 30.4439 12.3169L23.641 17.9751C23.3472 18.2195 23.2183 18.6099 23.309 18.9812L25.3789 27.4576C25.5885 28.316 24.6634 29.0045 23.9013 28.5573L16.1026 23.981C15.7901 23.7976 15.4029 23.7976 15.0904 23.981L7.29168 28.5573C6.52962 29.0045 5.60452 28.316 5.81412 27.4576L7.884 18.9812C7.97466 18.6099 7.84581 18.2195 7.55201 17.9751L0.749052 12.3169C0.0596786 11.7435 0.41509 10.6226 1.3089 10.5512L10.3226 9.83135C10.6911 9.80191 11.0134 9.57151 11.1605 9.23228L14.679 1.1163Z"
                                    fill={rateFixed >= 2 || rate >= 2 ? "#FFF500" : "#F2F2F2"}
                                />
                            </svg>
                        </label>
                        <input
                            type="radio"
                            name="rate"
                            id="rate2"
                            onChange={(e) => setRateFixed(2)}
                            className={`${styles["input-rate"]} ${styles["input-rate--2"]}`}
                        />
                        <label
                            htmlFor="rate3"
                            onMouseEnter={() => setRate(3)}
                            onMouseLeave={() => setRate(0)}
                            className={`${styles["label-rate"]} ${styles["label-rate--3"]}`}>
                            <svg
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.679 1.1163C15.0271 0.31332 16.1659 0.313319 16.514 1.1163L20.0325 9.23228C20.1796 9.57151 20.5018 9.80191 20.8704 9.83135L29.8841 10.5512C30.7779 10.6226 31.1333 11.7435 30.4439 12.3169L23.641 17.9751C23.3472 18.2195 23.2183 18.6099 23.309 18.9812L25.3789 27.4576C25.5885 28.316 24.6634 29.0045 23.9013 28.5573L16.1026 23.981C15.7901 23.7976 15.4029 23.7976 15.0904 23.981L7.29168 28.5573C6.52962 29.0045 5.60452 28.316 5.81412 27.4576L7.884 18.9812C7.97466 18.6099 7.84581 18.2195 7.55201 17.9751L0.749052 12.3169C0.0596786 11.7435 0.41509 10.6226 1.3089 10.5512L10.3226 9.83135C10.6911 9.80191 11.0134 9.57151 11.1605 9.23228L14.679 1.1163Z"
                                    fill={rateFixed >= 3 || rate >= 3 ? "#FFF500" : "#F2F2F2"}
                                />
                            </svg>
                        </label>
                        <input
                            type="radio"
                            name="rate"
                            id="rate3"
                            onChange={(e) => setRateFixed(3)}
                            className={`${styles["input-rate"]} ${styles["input-rate--3"]}`}
                        />
                        <label
                            htmlFor="rate4"
                            onMouseEnter={() => setRate(4)}
                            onMouseLeave={() => setRate(0)}
                            className={`${styles["label-rate"]} ${styles["label-rate--4"]}`}>
                            <svg
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.679 1.1163C15.0271 0.31332 16.1659 0.313319 16.514 1.1163L20.0325 9.23228C20.1796 9.57151 20.5018 9.80191 20.8704 9.83135L29.8841 10.5512C30.7779 10.6226 31.1333 11.7435 30.4439 12.3169L23.641 17.9751C23.3472 18.2195 23.2183 18.6099 23.309 18.9812L25.3789 27.4576C25.5885 28.316 24.6634 29.0045 23.9013 28.5573L16.1026 23.981C15.7901 23.7976 15.4029 23.7976 15.0904 23.981L7.29168 28.5573C6.52962 29.0045 5.60452 28.316 5.81412 27.4576L7.884 18.9812C7.97466 18.6099 7.84581 18.2195 7.55201 17.9751L0.749052 12.3169C0.0596786 11.7435 0.41509 10.6226 1.3089 10.5512L10.3226 9.83135C10.6911 9.80191 11.0134 9.57151 11.1605 9.23228L14.679 1.1163Z"
                                    fill={rateFixed >= 4 || rate >= 4 ? "#FFF500" : "#F2F2F2"}
                                />
                            </svg>
                        </label>
                        <input
                            type="radio"
                            id="rate4"
                            onChange={(e) => setRateFixed(4)}
                            className={`${styles["input-rate"]} ${styles["input-rate--4"]}`}
                        />
                        
                        <label
                            htmlFor="rate5"
                            onMouseEnter={() => setRate(5)}
                            onMouseLeave={() => setRate(0)}
                            className={`${styles["label-rate"]} ${styles["label-rate--5"]}`}>
                            <svg
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.679 1.1163C15.0271 0.31332 16.1659 0.313319 16.514 1.1163L20.0325 9.23228C20.1796 9.57151 20.5018 9.80191 20.8704 9.83135L29.8841 10.5512C30.7779 10.6226 31.1333 11.7435 30.4439 12.3169L23.641 17.9751C23.3472 18.2195 23.2183 18.6099 23.309 18.9812L25.3789 27.4576C25.5885 28.316 24.6634 29.0045 23.9013 28.5573L16.1026 23.981C15.7901 23.7976 15.4029 23.7976 15.0904 23.981L7.29168 28.5573C6.52962 29.0045 5.60452 28.316 5.81412 27.4576L7.884 18.9812C7.97466 18.6099 7.84581 18.2195 7.55201 17.9751L0.749052 12.3169C0.0596786 11.7435 0.41509 10.6226 1.3089 10.5512L10.3226 9.83135C10.6911 9.80191 11.0134 9.57151 11.1605 9.23228L14.679 1.1163Z"
                                    fill={rateFixed >= 5 || rate >= 5 ? "#FFF500" : "#F2F2F2"}
                                />
                            </svg>
                        </label>
                        <input
                            type="radio"
                            name="rate"
                            id="rate5"
                            onChange={(e) => setRateFixed(5)}
                            className={`${styles["input-rate"]} ${styles["input-rate--5"]}`}
                        />
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
            <MyButton type="submit" className={styles["button-rate"]}>
                Отправить
            </MyButton>
        </form>
    );
};

export default RateForm;
