/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import styles from "./Catalog.module.scss";
import Image from "next/image";

const CatalogItem = ({ title, image, index, isSmallImage, isRight, isMargin }: any) => {
    const router = useRouter();

    return (
        <article
            className={styles["catalog-item"]}
            onClick={() => router.push(`/catalog/${index}`)}>
            <p className={styles["catalog-item__title"]}>{title}</p>
            <img
                src={image}
                alt="catalog-item__image"
                className={`${styles["catalog-item__image"]} 
                    ${isSmallImage && styles["catalog-item__image--small"]} 
                    ${isRight && styles["catalog-item__image--right"]} 
                    ${isMargin && styles["catalog-item__image--margin"]}`}
            />
        </article>
    );
};

export default CatalogItem;
