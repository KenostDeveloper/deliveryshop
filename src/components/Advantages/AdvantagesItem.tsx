import styles from "./Advantages.module.scss";

const AdvantagesItem = ({ title, image }: { title: string; image: string }) => {
    return (
        <article className={`${styles["advantages-item"]}`}>
            <p className={`${styles["advantages-item__title"]}`}>{title}</p>
            <img
                src={image}
                alt="advantages item image"
                className={`${styles["advantages-item__image"]}`}
            />
        </article>
    );
};

export default AdvantagesItem;
