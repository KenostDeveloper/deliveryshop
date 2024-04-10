import { useEffect } from "react";
import Product from "../OrdersList/Product";
import styles from "./BasketRoute.module.scss";
import BasketRoutePath from "./BasketRoutePath";

const BasketRoute = ({ products, pathResult, pathParam }: any) => {
    useEffect(() => {
        console.log(products);
    }, []);

    console.log("products", products);
    

    return (
        <div className={`${styles["basket-routes"]}`}>
            {products.map((product: any, index: number) => (
                <article key={product?.id} className={`${styles["basket-route"]}`}>
                    <Product product={product} setOrder={null} inBasket={true} index={index} pathResult={pathResult} />
                    {pathResult?.find((product: any) => product?.id_product === product?.id_product) && (
                        <BasketRoutePath pathResultItem={pathResult[index]} pathParam={pathParam} />
                    )}
                    <p className={`${styles["basket-route__price-total"]}`}>
                        Итого: {(product?.product?.price * product?.quantity).toLocaleString()} ₽
                    </p>
                </article>
            ))}
        </div>
    );
};

export default BasketRoute;
