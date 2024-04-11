import { useEffect, useState } from "react";
import styles from "./Catalog.module.scss";
import CatalogItem from "./CatalogItem";
import axios from "axios";

const Catalog = () => {

    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        axios.get('/api/products/category').then(res => {
            setCategories(res.data?.category);
        })
    }, []);

    const getIdCategoryByName = (name: string) => {
        const category: any = categories.find((category: any) => category?.name === name);
        return category ? category?.id : 1;
    }

    return (
        <section className={`${styles["catalog"]}`}>
            <CatalogItem title="Здоровье" image="/catalog/1.png" index={getIdCategoryByName("Здоровье")} isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Красота" image="/catalog/2.png" index={getIdCategoryByName("Красота")} isSmallImage={false} isRight={true} isMargin={true}/>
            <CatalogItem title="Спорт" image="/catalog/3.png" index={getIdCategoryByName("Спорт")} isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Отдых" image="/catalog/4.png" index={getIdCategoryByName("Отдых")} isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Образование" image="/catalog/5.png" index={getIdCategoryByName("Образование")} isSmallImage={true} isRight={true} isMargin={false}/>
            <CatalogItem title="Торжества" image="/catalog/6.png" index={getIdCategoryByName("Торжества")} isSmallImage={false} isRight={true} isMargin={true}/>
        </section>
    )
}

export default Catalog