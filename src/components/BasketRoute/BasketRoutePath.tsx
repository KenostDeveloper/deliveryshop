import styles from "./BasketRoute.module.scss";

const BasketRoutePath = ({ pathResultItem, pathParam }: any) => {
    const pathArr = pathResultItem?.path;
    console.log(pathArr);

    return (
        <section className={`${styles["basket-route-path"]}`}>
            {pathArr?.map((pathArrItem: any) => (
                <div key={pathArrItem?.id_product} className={`${styles["basket-route-path__container"]}`}>
                    {pathArrItem?.path?.map((path: any, index: number, array: any) => (
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
                                    <div
                                        className={`${styles["basket-route-path__line-container"]}`}>
                                        <p>
                                            {Object.values(path)[0] as number} {pathParam}
                                        </p>
                                        <img src="/basket/line.svg" alt="line svg" className={`${styles["basket-route-path__line"]}`} />
                                    </div>
                                    <div
                                        key={path?.id}
                                        className={`${styles["basket-route-path__flag-container"]}`}>
                                        <img src={`${index % 2 == 0 && index === array.length - 1 ? "/basket/flag.svg" : "/basket/flag-ellipse.svg"}`} alt="flag image" />
                                        <p>{Object.keys(path)[0]}</p>
                                    </div>
                                </>
                            )}
                        </>
                    ))}
                </div>
            ))}
        </section>
    );
};

export default BasketRoutePath;
