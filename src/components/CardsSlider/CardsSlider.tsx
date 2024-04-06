import styles from "./CardsSlider.module.scss";
import Card from "../Card/Card";

const CardsSlider = ({ title }: {
    title: string
}) => {

    return (
        <section className={`${styles["product-slider"]}`}>
            <h2 className={`${styles["product-slider__title"]}`}>{title}</h2>
        </section>
    );
}

export default CardsSlider;