import styles from "./BasketRoute.module.scss";

const BasketRoutePath = ({ path, pathParam }: any) => {
    return (
        <section className={`${styles["basket-route-path"]}`}>
            <div className={`${styles["basket-route-path__container"]}`}>
                {path.map((path: any, index: number, array: any) => (
                    <>
                        {index === 0 ? (
                            <div
                                key={path?.id}
                                className={`${styles["basket-route-path__flag-container"]}`}>
                                <img src="/basket/flag.svg" alt="flag image" />
                                <p>{Object.keys(path)[0]}</p>
                            </div>
                        ) : (
                            <>
                                <div className={`${styles["basket-route-path__line-container"]}`}>
                                    <p>{Object.values(path)[0] as number} {pathParam}</p>
                                    <img src="/basket/line.svg" alt="line svg" />
                                </div>
                                <div
                                    key={path?.id}
                                    className={`${styles["basket-route-path__flag-container"]}`}>
                                    <img src="/basket/flag.svg" alt="flag image" />
                                    <p>{Object.keys(path)[0]}</p>
                                </div>
                            </>
                        )}
                    </>
                ))}

                {/* <div className={`${styles["basket-route-path__flag-container"]}`}>
                    <img src="/basket/flag.svg" alt="flag image" />
                    <p>Москва</p>
                </div> */}

                {/* <div className={`${styles["basket-route-path__flag-container"]}`}>
                    <img src="/basket/flag.svg" alt="flag image" />
                    <p>Пермь</p>
                </div> */}
            </div>
        </section>
    );
};

export default BasketRoutePath;
