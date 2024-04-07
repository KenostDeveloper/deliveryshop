/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

'use client'

import styles from "./product.module.css";

// import Counter from "@/components/Counter/Counter.components";
import { useEffect, useState } from "react";
import { useBasketContext } from '@/components/Helps/GlobalBasket';


import axios from "axios";
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

  const {basket, setBasket} = useBasketContext();
    
  useEffect(() => {
    axios.get(`/api/basket`).then((res) => {
        // setBasketItems(res.data?.basket);
        setBasket(res.data?.basket)
    });
  }, [])

  const changeCount = async (countValue: number) => {
    if(countValue != 0){
        const formData = new FormData();
        formData.append("id_product", params.id);
        formData.append("quantity", `${countValue}`);

        axios.post(`/api/basket`, formData).then((res) => {
            if (res.data.success) {
                setCount(countValue)
                const updateBasket = basket.map((basket: any) => {
                    if (basket.id_product != params.id) {
                      // No change
                      return basket;
                    } else {
                      // Return a new circle 50px below
                      return {
                        ...basket,
                        quantity: countValue,
                      };
                    }
                });
                setBasket(updateBasket);
            }
        });
    }else{
      deleteProductBasket(params.id)
    }
    axios.get(`/api/basket`).then((res) => {
      setBasket(res.data?.basket)
    });
  }

  useEffect(() => {
    //Проверка товара в корзине пользователя
    let temp = false;
    let countTemp;
    for(let i = 0; i<basket?.length; i++){
      if(basket[i].id_product == params.id){
        temp = true;
        countTemp = basket[i]?.quantity;
        break;
      }
    }
    if(temp){
      setIsBasket(true)
      setCount(countTemp)
    }else{
      setIsBasket(false)
    }
  }, [basket])

  const deleteProductBasket = async (id: number) => {
    axios.delete(`/api/basket?id=${id}`).then((res) => {
        if (res.data.success) {
            // deleteProduct
            setBasket(
                basket.filter((bask: any) => bask?.id_product !== id)
            );
        }
    });
  }

  useEffect(() => {
    axios.get(`/api/products?id=${params.id}`).then((res) => {
      setProduct(res.data?.product);
    }).finally(() => setLoading(false));
  }, [])

  //swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  //Добавление в корзину
  const addToBasket = async () => {
    const formData = new FormData();
    formData.append("id_product", params.id);
    formData.append("quantity", `${count}`);

    axios.post(`/api/basket`, formData).then((res) => {
        if (res.data.success) {
          setIsBasket(true)
          axios.get(`/api/basket`).then((res) => {
            setBasket(res.data?.basket)
          });
        }
    });
  };

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
            <button className={styles.button} onClick={() => addToBasket()}>В корзину</button>
            </>
            :
            <>
            {/* {!loading? <Counter count={count} setCount={changeCount}/> : <Placeholder.Graph active style={{ height: 42, width: 114, borderRadius: 8}} />} */}
            <Counter count={count} setCount={changeCount}/>
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