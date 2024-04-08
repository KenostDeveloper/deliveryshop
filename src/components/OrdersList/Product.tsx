"use client";

import { useRouter } from "next/navigation";
import styles from "./OrdersList.module.scss";
import { ProductType } from "./types";
import Link from "next/link";

const Product = ({ product }: { product: any }) => {
    const router = useRouter();

    return (
        <article className={`${styles["order__product"]}`}>
            <Link href={`/products/${product.id}`}>
                <img
                    src={`/products/${product?.product?.image}`}
                    alt="product image"
                    className={`${styles["orders__product-img"]} ${styles["order__product-img"]}`}
                />
            </Link>
            <div className={`${styles["order__product-content"]}`}>
                <Link
                    href={`/products/${product?.id}`}
                    className={`${styles["order__info-text"]} ${styles["orders__info-title"]}`}>
                    {product?.product?.name}
                </Link>
                <p className={`${styles["order__info-label"]}`}>{product?.count} шт</p>
                {/* <button
                    className={`${styles["order__product-button"]}`}
                    onClick={() => router.push(`/products/${product?.id}`)}>
                    Оценить товар
                </button> */}
                <div className={`${styles["order__star-container"]}`}>
                    <img src="/reviews/star-rated.svg" alt="star img" />
                    <img src="/reviews/star-rated.svg" alt="star img" />
                    <img src="/reviews/star-rated.svg" alt="star img" />
                    <img src="/reviews/star-rated.svg" alt="star img" />
                    <img src="/reviews/star-rated.svg" alt="star img" />
                </div>
            </div>
            <p className={`${styles["order__info-text"]}`}>
                {product?.price?.toLocaleString()} ₽
            </p>
        </article>
    );
};

export default Product;
