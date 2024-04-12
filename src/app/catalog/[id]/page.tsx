"use client";
import Link from "next/link";
import styles from "./product.module.css";
// import CatalogMenuItem from "@/components/CatalogMenuItem/CatalogMenuItem.component";
import ProductCard from "@/components/ProductCard/ProductCatd.components";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { useBasketContext } from "@/components/Helps/GlobalBasket";
// import CatalogMenu from "@/components/CatalogMenu/CatalogMenu.components";
import { Placeholder } from "rsuite";
import CatalogMenu from "@/components/CatalogMenu/CatalogMenu.components";
import { useBasketContext } from "@/components/Helps/GlobalBasket";

export default function Catalog({ params }: any) {
    const [products, setProducts] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    const [count, setCount] = useState(0);
    const [basketItems, setBasketItems] = useState<any>([]);
    const [productsCategory, setProductsCategory] = useState<any>([]);
    const [isFilter, setIsFilter] = useState(false);
    const [filter, setFilter] = useState(0);
    const rootEl = useRef<any>(null);

    const [totalCount, setTotalCount] = useState(1);
    const [fetching, setFetching] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [mobileCatalog, setMobuleCatalog] = useState(false);


    const { basket, setBasket } = useBasketContext();

    useEffect(() => {
        axios.get(`/api/basket`).then((res) => {
            // setBasketItems(res.data?.basket);
            setBasket(res.data?.basket);
        });
    }, []);

    //Подгрузка по скроллу
    const scrollHander = (e: any) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 750) {
            setFetching(true);
        }
    };

    useEffect(() => {
        if (fetching && products.length < totalCount) {
            axios
                .get(`/api/products?category_id=${params.id}&limit=24&page=${currentPage}`)
                .then((res) => {
                    setProducts([...products, ...res.data?.product]);
                    setCount(res.data?.count);
                    setTotalCount(res.data?.count);
                    setCurrentPage(currentPage + 1);
                })
                .finally(() => {
                    setFetching(false);
                    setLoading(false);
                });
        }
    }, [fetching]);

    useEffect(() => {
        window.addEventListener("scroll", scrollHander);
        return () => window.removeEventListener("scroll", scrollHander);
    }, []);

    useEffect(() => {
        const onClick = (e: any) => rootEl.current.contains(e.target) || setIsFilter(false);
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    // useEffect(() => {
    //     console.log(products);
        
    //     switch (filter) {
    //         case 0: // По популярности
    //             // Как-то фильтровать (никак)
    //             break;
    //         case 1: // Дешевле
    //             setProducts(products.sort((a: any, b: any) => a?.price - b?.price));
    //             break;
    //         case 2: // Дороже
    //             setProducts(products.sort((a: any, b: any) => a?.price - b?.price));
    //             break;
    //         case 3: // По алфавиту
    //             setProducts(products.sort((a: any, b: any) => a?.name.localCompare(b?.name)));
    //             break;
    //     }
    // }, [filter]);

    if (!products && !loading) {
        return <div>404 page</div>;
    }

    function declOfNum(n: any, text_forms: any) {
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) {
            return text_forms[2];
        }
        if (n1 > 1 && n1 < 5) {
            return text_forms[1];
        }
        if (n1 == 1) {
            return text_forms[0];
        }
        return text_forms[2];
    }


    return (
        <>
            <div className={`container ${styles.container}`}>
                <CatalogMenu active={mobileCatalog} setActive={setMobuleCatalog} params={params.id} />

                <div className={styles.contnent}>
                    <div className={styles.title}>
                        {!loading ? (
                            <div className={styles.mobileCatalogButton} onClick={() => setMobuleCatalog(!mobileCatalog)}>
                                <i className="pi pi-align-left"></i>
                                Каталог
                            </div>
                        ) : (
                            <Placeholder.Graph active style={{ height: 15, width: 300 }} />
                        )}
                        <div className={styles.titleInfo}>
                            {!loading ? (
                                <p>
                                    {count} {declOfNum(count, ["товар", "товара", "товаров"])}
                                </p>
                            ) : (
                                <Placeholder.Graph active style={{ height: 15, width: 150 }} />
                            )}
                            <div ref={rootEl} className={styles.filter}>
                                {!loading ? (
                                    <p onClick={() => setIsFilter(!isFilter)} className={styles.filterName}>
                                        {filter == 0 ? "По популярности" : filter == 1 ? "Дешевле" : filter == 2 ? "Дороже" : "По алфавиту"}
                                    </p>
                                ) : (
                                    <Placeholder.Graph active style={{ display: "flex", height: 15, width: 100 }} />
                                )}

                                <div className={isFilter ? `${styles.filterMenu} ${styles.active}` : `${styles.filterMenu}`}>
                                    <p
                                        onClick={() => {
                                            setFilter(0);
                                            setIsFilter(false);
                                        }}>
                                        По популярности
                                    </p>
                                    <p
                                        onClick={() => {
                                            setFilter(1);
                                            setIsFilter(false);
                                        }}>
                                        Дешевле
                                    </p>
                                    <p
                                        onClick={() => {
                                            setFilter(2);
                                            setIsFilter(false);
                                        }}>
                                        Дороже
                                    </p>
                                    <p
                                        onClick={() => {
                                            setFilter(3);
                                            setIsFilter(false);
                                        }}>
                                        По алфавиту
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!loading ? (
                        <div className={styles.catalog}>
                            {products.map((item: any) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.loadingCatalog}>
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                            <Placeholder.Graph active className={styles.loadingCatalogEl} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
