/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import MyButton from "../UI/MyInput/MyButton";
import Title from "../UI/Title.components";
import styles from "./EmptyBasket.module.scss";

const EmptyOrders = () => {
    const router = useRouter();

    return (
        <section className={`${styles["empty-basket"]} container`}>
            {/* <Title text="Корзина" margin={false} /> */}
            <div className={`${styles["empty-basket__container"]}`}>
                <img src="/empty-basket/empty-basket-background.svg" alt="backgronud image" className={`${styles["empty-basket__background"]}`} />
                <div className={`${styles["empty-basket__content"]}`}>
                    <img src="/empty-basket/empty-orders.png" alt="basket image" className={`${styles["empty-basket__img"]}`} />
                    <p className={`${styles["empty-basket__text"]}`}>У вас нет заказов</p>
                    <MyButton onClick={() => router.push("/catalog/all")}>Перейти в каталог</MyButton>
                </div>
            </div>
        </section>
    );
};

export default EmptyOrders;
