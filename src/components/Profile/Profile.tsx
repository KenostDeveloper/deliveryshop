"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./Profile.module.scss"
import axios from "axios";
import toast from "react-hot-toast";
import MyTextArea from "@/components/UI/MyInput/MyTextArea";
import MyButton from "@/components/UI/MyButton/MyButton";
import MyInput from "@/components/UI/MyInput/MyInput";

const Profile = ({ isEdit, setIsEdit }: any) => {

    const [profile, setProfile] = useState<any>({
        image: "",
        nameShop: "QuickShop",
        description: "Описание вашего магазина ещё нет :( Исправте это!"
    });
    const [selectedFile, setSelectedFile] = useState<File>();

    const inputFile = useRef<any>(null);

    useEffect(() => {
        axios.get(`/api/profile/settings`).then((res) => {
            setProfile(res.data?.profile);
            if(profile?.nameShop == null){
                setProfile({...profile, nameShop: " "})
            }

            if(profile?.description == null){
                setProfile({...profile, description: " "})
            }
        });
    }, []);

    const handlerInput = () => {
        inputFile.current.click();
      };

    const updateUser = async () => {
        const formData = new FormData();
        if(selectedFile){
            formData.append("file", selectedFile);
        }
        formData.append("name", profile.nameShop);
        formData.append("description", profile.description);

        axios
        .post(`/api/profile/settings`, formData)
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                setProfile(res.data.profile)
            } else {
                toast.error(res.data.message);
            }
        })
        .finally(() => setIsEdit(false));
    };

    return (
        <div className={styles.profile}>
            <img
                onClick={handlerInput}
                className={styles.profile__image}
                src={profile?.image == null ? "/quickshopimage.png" : `/users/` + profile.image}
                alt=""
            />
            <div className={styles.profile__text}>
                {!isEdit ? (
                    <>
                        <b className={styles.profile__name}>
                            {profile?.nameShop == null || "" ? "QuickShop" : profile?.nameShop}
                            <i className="pi pi-pen-to-square" onClick={() => setIsEdit(!isEdit)}></i>
                        </b>
                        <p className={styles.profile__desc}>
                            {profile?.description == null || "" ? "Описание вашего магазина ещё нет :( Исправте это!" : profile?.description}
                        </p>
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
                        <MyInput
                            value={profile.nameShop == null || "" ? "QuickShop" : profile?.nameShop}
                            onChange={(e: any) => setProfile({ ...profile, nameShop: e.target.value })}
                        />
                        <MyTextArea
                            value={profile.description == null || "" ? "Описание вашего магазина ещё нет :( Исправте это!" : profile?.description}
                            onChange={(e: any) => setProfile({ ...profile, description: e.target.value })}
                        />
                        <MyButton onClick={() => updateUser()}>Сохранить</MyButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
