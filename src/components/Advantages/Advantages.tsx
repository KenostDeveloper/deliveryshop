import styles from "./Advantages.module.scss";
import AdvantagesItem from "./AdvantagesItem";

const Advantages = () => {
    return (
        <section className={`${styles["advantages"]}`}>
            <AdvantagesItem title="Быстрая &#9; доставка" image="/top/1.svg" />
            <AdvantagesItem title="Отличное &#9; качество" image="/top/2.svg" />
            <AdvantagesItem title="Оплата товара &#9; при получении" image="/top/3.svg" />
            <AdvantagesItem title="Низкие &#9; цены" image="/top/4.svg" />
        </section>

        // TODO - Сделать перенос заголовка преимущества, отступ перед перенесенным словом
    )
}

export default Advantages;