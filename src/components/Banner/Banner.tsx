/* eslint-disable @next/next/no-img-element */
import styles from "./Banner.module.scss";

const Banner = () => {

    return (
        <section className={`${styles.banner}`}>
            <div className={`${styles.banner__container}`}>
                <div className={`${styles["banner__img-container"]} ${styles["banner__img-container--primary"]}`}>
                    <div className={`${styles["banner__img-group"]}`}>
                        <img src="/money.svg" alt="banner img" className={`${styles["banner__img"]} ${styles["banner__img--primary--first"]} ${styles["money-icon"]}`} />
                        <img src="/Group 2087325263.svg" alt="banner img" className={`${styles["banner__img"]} ${styles["banner__img--primary--second"]} ${styles["hands-icon"]}`} />
                    </div>
                    <div className={`${styles["banner__text-container"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>Лучший сервис доставки</h2>
                        <p className={`${styles["banner__text"]}`}>Наш маркетплейс предлагает широкий ассортимент продуктов и товаров, быструю доставку и удобную систему оплаты.</p>
                    </div>
                </div>
                <div className={`${styles["banner__img-container-wrapper"]}`}>
                    <div className={`${styles["banner__img-container"]} ${styles["banner__img-container--secondary"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>Быстрая доставка<br/>до дома</h2>
                        <img src="/Group 2087325264.svg" alt="banner img" className={`${styles["banner__img"]}`} />
                    </div>
                    <div className={`${styles["banner__img-container"]} ${styles["banner__img-container--secondary"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>Выгодные цены</h2>
                        <img src="/hands.svg" alt="banner img" className={`${styles["banner__img"]}`} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner