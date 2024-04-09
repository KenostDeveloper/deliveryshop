import { schemaCancelOrder } from "@/validations/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import styles from "./forms.module.scss";
import { useEffect, useState } from "react";
import MyButton from "../UI/MyInput/MyButton";
import toast from "react-hot-toast";
import axios from "axios";
import Title from "../UI/Title.components";
import { InputPicker } from "rsuite";

const CitySelectForm = ({ city, setCity, setActive }: any) => {
    const [cities, setCities] = useState([]);
    const [citySelected, setCitySelected] = useState(city);

    const [newCity, setNewCity] = useState<any>(null);

    useEffect(() => {
        axios.get(`/api/profile/city`).then((res) => {
            setCities(
                res.data?.city.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }))
            );
        });
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res = await axios.post("/api/users", {
            idCity: citySelected.id,
        });

        if (!res.data.success) {
            toast.error(res.data?.message);
            return;
        }
        toast.success(res.data?.message);

        axios.get("/api/profile/city?id=true").then((res) => {
            setCity(res.data.city);
            setActive(false);
        });
    };

    return (
        <form className={`${styles.ModalAuth} ${styles["rate-form"]}`} onSubmit={handleSubmit}>
            <Title text="Выбор города" margin={false} className={`${styles["title"]}`} />
            <div
                className={`${styles["input-container"]} ${styles["city-select-form__input-container"]}`}>
                <label
                    htmlFor="advantages"
                    className={`${styles["change-form__label"]} ${styles["cancel-form__label"]}`}>
                    Город
                </label>
                <InputPicker
                    data={cities}
                    value={citySelected.id}
                    onChange={(value: any) => {                        
                        setCitySelected({ ...citySelected, id: value });
                    }}
                    placeholder="Выберите город"
                />
                <MyButton type="submit">Сохранить</MyButton>
            </div>
        </form>
    );
};

export default CitySelectForm;
