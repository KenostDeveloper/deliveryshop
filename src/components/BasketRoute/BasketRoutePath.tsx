/* eslint-disable @next/next/no-img-element */
import styles from "./BasketRoute.module.scss";

const BasketRoutePath = ({ pathResultItem, pathParam }: any) => {
    const pathArr = pathResultItem?.path;
    console.log(pathArr, pathArr[0], pathArr[0][0]?.parameters);

    return (
        <section className={`${styles["basket-route-path"]}`}>
            {pathArr[0][0]?.parameters ? (
                <>
                    {pathArr?.map((pathArrItem: any) => (
                        <div key={pathArrItem} className={`${styles["basket-route-path__container"]} ${styles["basket-route-path__container--column"]}`}>
                            {console.log("Inside map", pathArr, pathArrItem)}
                            {pathArrItem?.map((pathItem: any, index: number) => (
                                <div key={pathItem} className={`${styles["basket-route-path__container"]}`}>
                                    {pathItem?.path?.map((path: any, index: number, array: any) => (
                                        <>
                                            {console.log("Inside map", pathItem, path)}
                                            {index === 0 ? (
                                                <div key={path?.id} className={`${styles["basket-route-path__flag-container"]}`}>
                                                    <img src="/basket/flag.svg" alt="flag image" />
                                                    <p>{Object.keys(path)[0]}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={`${styles["basket-route-path__line-container"]}`}>
                                                        <p>
                                                            {Number(Object.values(path)[0]) - Number(Object.values(array[index - 1])[0])} {pathParam}
                                                        </p>
                                                        <img
                                                            src="/basket/line.svg"
                                                            alt="line svg"
                                                            className={`${styles["basket-route-path__line"]}`}
                                                        />
                                                    </div>
                                                    <div key={path?.id} className={`${styles["basket-route-path__flag-container"]}`}>
                                                        <img
                                                            src={`${index !== array.length - 1 ? "/basket/flag-ellipse.svg" : "/basket/flag.svg"}`}
                                                            alt="flag image"
                                                        />
                                                        <p>{Object.keys(path)[0]}</p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {pathArr?.map((pathArrItem: any) => (
                        <div key={pathArrItem?.id_product} className={`${styles["basket-route-path__container"]}`}>
                            {pathArrItem?.path?.map((path: any, index: number, array: any) => (
                                <>
                                    {index === 0 ? (
                                        <div key={path?.id} className={`${styles["basket-route-path__flag-container"]}`}>
                                            <img src="/basket/flag.svg" alt="flag image" />
                                            <p>{Object.keys(path)[0]}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`${styles["basket-route-path__line-container"]}`}>
                                                <p>
                                                    {Number(Object.values(path)[0]) - Number(Object.values(array[index - 1])[0])} {pathParam}
                                                </p>
                                                <img src="/basket/line.svg" alt="line svg" className={`${styles["basket-route-path__line"]}`} />
                                            </div>
                                            <div key={path?.id} className={`${styles["basket-route-path__flag-container"]}`}>
                                                <img
                                                    src={`${index !== array.length - 1 ? "/basket/flag-ellipse.svg" : "/basket/flag.svg"}`}
                                                    alt="flag image"
                                                />
                                                <p>{Object.keys(path)[0]}</p>
                                            </div>
                                        </>
                                    )}
                                </>
                            ))}
                        </div>
                    ))}
                </>
            )}
        </section>
    );
};

export default BasketRoutePath;
