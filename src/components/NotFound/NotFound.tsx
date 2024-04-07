"use client";

import { useRouter } from "next/navigation";
import styles from "./NotFound.module.scss";

const NotFound = () => {
    const router = useRouter();

    return (
        <div className={styles["not-found"]}>
            {/* Изображения */}
            {/* <img
                src="/not-found/big-ellipse1.svg"
                alt="not-found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--big-ellipse--big"]}`}
            />
            <img
                src="/not-found/big-ellipse1.svg"
                alt="not-found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--big-ellipse--small"]}`}
            />

            <img
                src="/not-found/power-socket.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--socket"]}`}
            />

            <img
                src="/not-found/ellipse1.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--ellipse"]}`}
            />
            <img
                src="/not-found/ellipse2.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--ellipse"]}`}
            />
            <img
                src="/not-found/ellipse3.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--ellipse"]}`}
            />

            <img
                src="/not-found/x1.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--x"]}`}
            />
            <img
                src="/not-found/x2.svg"
                alt="not found image"
                className={`${styles["not-found__image"]} ${styles["not-found__image--x"]}`}
            /> */}

            <img src="/not-found/403.png" alt="not found image" className={`${styles["not-found__image"]}`} />

            <div className={`${styles["not-found__content"]}`}>
                <h1 className={`${styles["not-found__title"]}`}>У вас нет доступа</h1>
                <button
                    className={`${styles["not-found__button"]}`}
                    onClick={() => router.push("/")}>
                    На главную
                </button>
            </div>
        </div>
    );
};

export default NotFound;
