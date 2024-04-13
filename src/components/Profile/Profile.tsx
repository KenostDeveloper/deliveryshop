/* eslint-disable @next/next/no-img-element */
"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Profile.module.scss";
import axios from "axios";
import toast from "react-hot-toast";
import MyTextArea from "@/components/UI/MyInput/MyTextArea";
import MyButton from "@/components/UI/MyButton/MyButton";
import MyInput from "@/components/UI/MyInput/MyInput";

const Profile = ({ isEdit, setIsEdit, isSeller }: any) => {
    const [profile, setProfile] = useState<any>({
        image: "",
        name: "Noname",
        nameShop: "QuickShop",
        description: "Описание вашего магазина ещё нет :( Исправте это!",
    });
    const [selectedFile, setSelectedFile] = useState<File>();

    const inputFile = useRef<any>(null);

    useEffect(() => {
        axios.get(`/api/profile/settings`).then((res) => {
            setProfile(res.data?.profile);
        });
    }, []);

    const handlerInput = () => {
        inputFile.current.click();
    };

    const updateUser = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        formData.append("name", profile.name);
        formData.append("nameShop", profile.nameShop);
        formData.append("email", profile.email);
        formData.append("description", profile.description);

        axios
            .post(`/api/profile/settings`, formData)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    setProfile(res.data.profile);
                } else {
                    toast.error(res.data.message);
                }
            })
            .finally(() => setIsEdit(false));
    };

    return (
        <div className={`${styles.profile} container`}>
            <img
                onClick={isEdit ? handlerInput : () => {}}
                className={styles.profile__image}
                src={profile?.image == null ? "/quickshopimage.png" : `/users/` + profile.image}
                alt=""
            />
            <div className={styles.profile__text}>
                {!isEdit ? (
                    <>
                        {isSeller ? (
                            <b className={styles.profile__name}>
                                {!profile?.nameShop ? "Имени компании нет :(" : profile?.nameShop}
                                <i className="pi pi-pen-to-square" onClick={() => setIsEdit(!isEdit)}></i>
                            </b>
                        ) : (
                            <b className={styles.profile__name}>
                                {!profile?.name ? "У меня нет имени :(" : profile?.name}
                                <i className="pi pi-pen-to-square" onClick={() => setIsEdit(!isEdit)}></i>
                            </b>
                        )}
                        <p className={styles.profile__desc}>{!profile?.email ? "У вас нет email!" : profile?.email}</p>
                        {isSeller && (
                            <p className={styles.profile__desc}>
                                {!profile?.description ? "У вас еще нет описание, исправьте это! :(" : profile?.description}
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <input
                            onChange={({ target }) => {
                                if (target.files) {
                                    const file = target.files[0];
                                    setSelectedFile(file);
                                }
                            }}
                            type="file"
                            ref={inputFile}
                            className="hidden"
                        />
                        {isSeller ? (
                            <MyInput
                                value={!profile.nameShop ? "" : profile?.nameShop}
                                onChange={(e: any) => setProfile({ ...profile, nameShop: e.target.value })}
                            />
                        ) : (
                            <MyInput
                                value={!profile.name ? "" : profile?.name}
                                onChange={(e: any) => setProfile({ ...profile, name: e.target.value })}
                            />
                        )}
                        <MyInput
                            value={!profile.email ? "" : profile?.email}
                            onChange={(e: any) => setProfile({ ...profile, email: e.target.value })}
                        />
                        {isSeller && (
                            <MyTextArea
                                value={!profile.description ? "" : profile?.description}
                                onChange={(e: any) => setProfile({ ...profile, description: e.target.value })}
                            />
                        )}
                        <MyButton onClick={() => updateUser()}>Сохранить</MyButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
