import styles from "./Catalog.module.scss";
import Image from "next/image";

const CatalogItem = ({ title, image, isSmallImage, isRight, isMargin }: {
    title: string,
    image: string,
    isSmallImage: boolean,
    isRight: boolean,
    isMargin: boolean
}) => {
    return (
        <article className={styles["catalog-item"]}>
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
    )
}

export default CatalogItem