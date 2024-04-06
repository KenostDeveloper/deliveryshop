import styles from "./Footer.module.scss";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className={`${styles["footer"]}`}>
            <div className={`${styles["footer__container"]} container`}>
                <div className={`${styles["footer__contacts"]} ${styles["footer-contacts"]}`}>
                    <Link href="/" className={`${styles["nav__title-container"]}`}>
                        <div className={styles.logo}>quick<span>shop</span></div>
                    </Link>
                    <p className={`${styles["footer-contacts__title"]}`}>для связи вы можете использовать любые соцсети или номер телефона</p>
                    <p className={`${styles["footer-contacts__text"]}`}>+7(812)214-19-30</p>
                    <p className={`${styles["footer-contacts__text"]}`}>Воронежская обл, г Богучар, ул Шолохова, д 4</p>
                </div>
                <nav className={`${styles["footer__nav"]} ${styles["footer-nav"]}`}>
                    <div className={`${styles["footer-nav__block"]}`}>
                        <h3 className={`${styles["footer-nav__title"]}`}>МЕНЮ</h3>
                        <ul className={`${styles["footer-nav__list"]}`}>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/">Главная</Link>
                            </li>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/catalog">Каталог</Link>
                            </li>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/contacts">Контакты</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={`${styles["footer-nav__block"]}`}>
                        <h3 className={`${styles["footer-nav__title"]}`}>СОЦСЕТИ</h3>
                        <ul className={`${styles["footer-nav__list"]}`}>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/whatsapp">WhatsApp</Link>
                            </li>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/telegram">Telegram</Link>
                            </li>
                            <li className={`${styles["footer-nav__item"]}`}>
                                <Link href="/vk">Вконтакте</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <p className={`${styles["footer__author"]}`}>by kenost</p>
            </div>
        </footer>
    )
}

// export default Footer;