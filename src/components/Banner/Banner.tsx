/* eslint-disable @next/next/no-img-element */
import styles from "./Banner.module.scss";

const Banner = () => {
    return (
        <section className={`${styles.banner}`}>
            <div className={`${styles.banner__container}`}>
                <div
                    className={`${styles["banner__img-container"]} ${styles["banner__img-container--primary"]}`}>
                    <div className={`${styles["banner__img-group"]}`}>
                        {/* <img src="/money.svg" alt="banner img" className={`${styles["banner__img"]} ${styles["banner__img--primary--first"]} ${styles["money-icon"]}`} /> */}

                        {/* Группа картинок "Деньги" */}
                        <div
                            className={`${styles["banner__img-group"]} ${styles["banner__img-group--money"]}`}>
                            {/* Руки */}
                            <img
                                src="/banner/money/money-hand1.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-hand"]}`}
                            />
                            <img
                                src="/banner/money/money-hand2.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-hand"]}`}
                            />

                            {/* Ноги */}
                            <img
                                src="/banner/money/money-leg1.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-brow"]} ${styles["banner__img--money-leg--one"]}`}
                            />
                            <img
                                src="/banner/money/money-leg2.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-leg"]} ${styles["banner__img--money-leg--two"]}`}
                            />

                            {/* Тело */}
                            <img
                                src="/banner/money/money-body.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-body"]}`}
                            />

                            {/* Брови и глаза */}
                            <img
                                src="/banner/money/money-brow1.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-brow"]} ${styles["banner__img--money-brow--one"]}`}
                            />
                            <img
                                src="/banner/money/money-brow2.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-brow"]} ${styles["banner__img--money-brow--two"]}`}
                            />
                            <img
                                src="/banner/money/money-eyes.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--money-eyes"]}`}
                            />
                        </div>

                        {/* Группа картинок "Руки" */}
                        <div
                            className={`${styles["banner__img-group"]} ${styles["banner__img-group--hand"]}`}>
                            <img
                                src="/banner/hand1.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--hand"]}`}
                            />
                            <img
                                src="/banner/hand2.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--hand"]}`}
                            />
                            <img
                                src="/banner/hand3.svg"
                                alt="hand image"
                                className={`${styles["banner__img"]} ${styles["banner__img--hand"]}`}
                            />
                            <img
                                src="/banner/hand-lines.svg"
                                alt="hand lines image"
                                className={`${styles["banner__img"]} ${styles["banner__img--line"]}`}
                            />
                        </div>
                    </div>
                    <div className={`${styles["banner__text-container"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>Лучший сервис доставки</h2>
                        <p className={`${styles["banner__text"]}`}>
                            Наш маркетплейс предлагает широкий ассортимент продуктов и товаров,
                            быструю доставку и удобную систему оплаты.
                        </p>
                    </div>
                </div>
                <div className={`${styles["banner__img-container-wrapper"]}`}>
                    <div
                        className={`${styles["banner__img-container"]} ${styles["banner__img-container--secondary"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>
                            Быстрая доставка
                            <br />
                            до дома
                        </h2>
                        <img
                            src="/Group 2087325264.svg"
                            alt="banner img"
                            className={`${styles["banner__img"]}`}
                        />
                    </div>
                    <div
                        className={`${styles["banner__img-container"]} ${styles["banner__img-container--secondary"]}`}>
                        <h2 className={`${styles["banner__title"]}`}>Выгодные цены</h2>
                        <img
                            src="/hands.svg"
                            alt="banner img"
                            className={`${styles["banner__img"]}`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
