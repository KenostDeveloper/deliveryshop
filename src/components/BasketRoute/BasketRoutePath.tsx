import styles from "./BasketRoute.module.scss";

const BasketRoutePath = ({ path }: any) => {
    return (
        <section className={`${styles["basket-route-path"]}`}>
            <div className={`${styles["basket-route-path__container"]}`}>
                <div className={`${styles["basket-route-path__flag-container"]}`}>
                    <img src="/basket/flag.svg" alt="flag image" />
                    <p>Москва</p>
                </div>
                <div className={`${styles["basket-route-path__line-container"]}`}>
                    <p>500 км (1 000 ₽)</p>
                    <img src="/basket/line.svg" alt="line svg" />
                </div>
                <div className={`${styles["basket-route-path__flag-container"]}`}>
                    <img src="/basket/flag.svg" alt="flag image" />
                    <p>Пермь</p>
                </div>
            </div>
        </section>
    )
}

export default BasketRoutePath;