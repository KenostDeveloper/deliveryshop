/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

'use client'
import Link from "next/link";
import styles from "./product.module.css";
// import CatalogMenuItem from "@/components/CatalogMenuItem/CatalogMenuItem.component";
import ProductCard from "@/components/ProductCard/ProductCatd.components";
// import Counter from "@/components/Counter/Counter.components";
import { useEffect, useState } from "react";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import axios from "axios";
import Loading from "@/components/Helps/Loading";
// import { useBasketContext } from "@/components/Helps/GlobalBasket";
import Title from "@/components/UI/Title.components";
import ProductsSwiper from "@/components/ProductsSwiper/ProductsSwiper.components";
import { Placeholder } from "rsuite";
import Counter from "@/components/Counter/Counter.components";

export default function Catalog({params}:any) {

  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const [product, setProduct] = useState<any>();
  const [cardProduct, setCardProduct] = useState<any>([]);
  const [photo, setPhoto] = useState<any>([]);
  const [isBasket, setIsBasket] = useState(false);
  const [newProducts, setNewProducts] = useState([]);


  useEffect(() => {
    axios.get(`/api/products?id=${params.id}`).then((res) => {
      setProduct(res.data?.product);
    }).finally(() => setLoading(false));
  }, [])

  //swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // if (loading) {
  //   return <Loading />;
  // }

  if(!product){
    return (
      <div>404 page</div>
    )
  }

  return(
    <main className={styles.main}>
      <div className={`container ${styles.container}`}>
        <div className={styles.photo}>
          <img src={`/products/${product.image}`} alt="" />
        </div>
        
        <div className={styles.product}>
          <h1>{product?.name}</h1>

          <hr className={styles.hr}/>
          <p className={styles.price}>{(product.price).toLocaleString()} ₽</p>
          <div className={styles.flex}>

            {!isBasket? 
            <>
            <Counter count={count} setCount={setCount}/>
            <button className={styles.button}>В корзину</button>
            </>
            :
            <>
            {/* {!loading? <Counter count={count} setCount={changeCount}/> : <Placeholder.Graph active style={{ height: 42, width: 114, borderRadius: 8}} />} */}
            <button className={`${styles.button} ${styles.btnActive}`}>В корзине</button>
            </>
            }
          </div>
          {/* <span className={styles.priceCredit}>Товар доступен в <p>рассрочку</p> от 15 999₽</span> */}
          {/* {!loading? <span className={styles.priceCredit}>Скоро товар будет доступен в <p>рассрочку</p> (в разработке)</span> : <Placeholder.Graph active style={{ height: 15, width: 380, marginTop: 14 }} />} */}
          
          <hr className={styles.hr}/>

          <h2>Описание</h2>
          <p className={styles.description}>{product.description}</p>
          
          <h2>Характеристики</h2>
        
          <div className={styles.property}>
              <span>Длинна</span>
              <span>{product.weight} миллиметров</span>
          </div>
          <div className={styles.property}>
              <span>Ширина</span>
              <span>{product.weight} грамм</span>
          </div>
          <div className={styles.property}>
              <span>Высота</span>
              <span>{product.weight} грамм</span>
          </div>
          <div className={styles.property}>
              <span>Вес</span>
              <span>{product.weight} грамм</span>
          </div>
          
        </div>
      </div>
      <div className={`container`}>
        <Title text="Похожие товары"/>
        <ProductsSwiper products={newProducts}/>
      </div>
    </main>
  )
}