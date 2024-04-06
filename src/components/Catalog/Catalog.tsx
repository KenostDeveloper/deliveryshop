import styles from "./Catalog.module.scss";
import CatalogItem from "./CatalogItem";

const Catalog = () => {
    return (
        <section className={`${styles["catalog"]}`}>
            <CatalogItem title="Здоровье" image="/catalog/1.png" isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Красота" image="/catalog/2.png" isSmallImage={false} isRight={true} isMargin={true}/>
            <CatalogItem title="Спорт" image="/catalog/3.png" isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Отдых" image="/catalog/4.png" isSmallImage={false} isRight={false} isMargin={false}/>
            <CatalogItem title="Образование" image="/catalog/5.png" isSmallImage={true} isRight={true} isMargin={false}/>
            <CatalogItem title="Торжества" image="/catalog/6.png" isSmallImage={false} isRight={true} isMargin={true}/>
        </section>
    )
}

export default Catalog