import { useEffect } from "react";
import Product from "../OrdersList/Product";
import styles from "./BasketRoute.module.scss";
import BasketRoutePath from "./BasketRoutePath";

const BasketRoute = ({ products, path, pathParam }: any) => {
    useEffect(() => {
        console.log(products);
    }, []);

    return (
        <div className={`${styles["basket-routes"]}`}>
            {products.map((product: any) => (
                <article key={product?.id} className={`${styles["basket-route"]}`}>
                    <Product product={product} setOrder={null} inBasket={true} />
                    <BasketRoutePath path={path} pathParam={pathParam} />
                    <p className={`${styles["basket-route__price-total"]}`}>
                        Итого: {(product?.product?.price * product?.quantity).toLocaleString()} ₽
                    </p>
                </article>
            ))}
        </div>
    );
};

export default BasketRoute;
