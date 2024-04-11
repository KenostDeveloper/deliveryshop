import { useEffect, useState } from "react";
import Counter from "../Counter/Counter.components";
import styles from "./BasketItem.module.scss";
import axios from "axios";
import { useBasketContext } from "../Helps/GlobalBasket";
import toast from "react-hot-toast";

const BasketItem = ({ item }: any) => {
    const { basket, setBasket } = useBasketContext();

    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(item?.quantity);
    }, []);

    const changeCount = async (countValue: number) => {
        if (countValue != 0) {
            const formData = new FormData();
            formData.append("id_product", item.id_product);
            formData.append("quantity", countValue.toString());
            setCount(countValue);

            axios.post("/api/basket", formData).then((res) => {
                if (res.data.success) {
                    setCount(countValue)
                    const updateBasket = basket.map((basket: any) => {
                        if (basket.id_product != item.id_product) {
                            // No change
                            return basket;
                        } else {                           
                            // Return a new circle 50px below
                            return {
                                ...basket,
                                quantity: countValue,
                            };
                        }
                    });
                    setBasket(updateBasket);
                }else{
                    toast.error(res.data.message)
                    setCount(res.data.basket.quantity)
                }
            });
        } else {
            deleteProductBasket(item.id_product);
        }
    };

    const deleteProductBasket = async (id: number) => {
        axios.delete(`/api/basket?id=${id}`).then((res) => {
            if (res.data.success) {
                // deleteProduct
                setBasket(basket.filter((bask: any) => bask?.id_product !== id));
            }
        });
    };

    return (
        <div key={item.id} className={styles.item}>
            <img
                src={
                    item?.product?.image
                        ? `/products/${item?.product?.image}`
                        : `/quickshopimage.png`
                }
                alt={`${item?.product?.name}`}
            />
            <div className={styles.itemText}>
                <div className={styles.itemTextTitle}>
                    <p>{item?.product?.name} </p>
                    <span>{item?.product?.price?.toLocaleString()}₽</span>
                </div>
                <div className={styles.itemButtons}>
                    <Counter count={count} setCount={changeCount} isSmall={true} />
                    <i
                        className={`${styles.trash} pi pi-trash`}
                        onClick={() => deleteProductBasket(item.id_product)}></i>
                </div>
            </div>
        </div>
    );
};

export default BasketItem;
