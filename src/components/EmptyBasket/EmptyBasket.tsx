/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import MyButton from "../UI/MyInput/MyButton";
import Title from "../UI/Title.components";
import styles from "./EmptyBasket.module.scss";

const EmptyBasket = () => {
    const router = useRouter();

    return (
        <section className={`${styles["empty-basket"]} container`}>
            {/* <Title text="Корзина" margin={false} /> */}
            <div className={`${styles["empty-basket__container"]}`}>
                <img src="/empty-basket/empty-basket-background.svg" alt="backgronud image" className={`${styles["empty-basket__background"]}`} />
                <div className={`${styles["empty-basket__content"]}`}>
                    <img src="/empty-basket/empty-basket-image.png" alt="basket image" className={`${styles["empty-basket__img"]}`} />
                    <p className={`${styles["empty-basket__text"]}`}>Ваша корзина на данный<br/>момент пуста</p>
                    <MyButton onClick={() => router.push("/catalog/1")}>Перейти в каталог</MyButton>
                </div>
            </div>
        </section>
    );
};

export default EmptyBasket;
