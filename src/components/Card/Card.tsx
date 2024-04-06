import styles from "./Card.module.css";

const Card = ({ image, description, price }: {
    image: string,
    title: string,
    description: string,
    price: number
}) => {

    return (
        <article className={`${styles.card}`}>
            <img src={image} alt="card image" className={`${styles.card__image}`} />
            <div className={`${styles.card__content}`}>
                <p className={`${styles.card__description}`}>{description}</p>
                <div className={`${styles["card__bottom-container"]}`}>
                    <p className={`${styles.card__price}`}>{price}₽</p>
                    <button className={`${styles.card__button}`}>В корзину</button>
                </div>
            </div>
        </article>
    )
}

export default Card