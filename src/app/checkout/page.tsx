/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useState } from 'react';
import styles from './checkout.module.css'
import axios from 'axios';
import { useBasketContext } from '@/components/Helps/GlobalBasket';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


export default function Checkout() {
  const [methodDelivert, setMetodDelivery] = useState(0);
  const router = useRouter()
  const {basket, setBasket} = useBasketContext();
  const [amount, setAmount] = useState(0);
  const [load, setLoad] = useState(false);


  useEffect(() => {
    if(basket){
        let temp = 0;

        for(let i = 0; i < basket?.length; i++){
            temp = temp + basket[i]?.quantity * basket[i]?.product?.price;
        }
        setAmount(temp);
    }
  }, [basket])

  useEffect(() => {
    axios.get(`/api/basket`).then((res) => {
        // setBasketItems(res.data?.basket);
        setBasket(res.data?.basket)
    });
  }, [])

  function placeOrder() {
    setLoad(true)
    axios.post(`/api/orders`).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        router.push(`/orders/${res.data.order.id}`)
      } else {
        toast.error(res.data.message);
      }
    }).finally(() => setLoad(false));
  }

  return (
    <main className={styles.main}>
      <div className={`${styles.container} container`}>
        <h1>Офомление заказа</h1>
        <div className={styles.containerChekout}>
          <div className={styles.left}>
              {/* <div className={styles.data}>
                  <input type="text" placeholder='Фамилия'/>
                  <input type="text" placeholder='Имя'/>
                  <input type="text" placeholder='Отчество'/>
                  <input type="text" placeholder='Номер телефона'/>
                  <input type="text" placeholder='email'/>
              </div> */}
              <h2>Способы получения</h2>
              <div className={styles.methodDelivery}>
                  <div className={methodDelivert == 1? `${styles.active} ${styles.delivery}` : `${styles.delivery}`} onClick={() => {
                      setMetodDelivery(1)
                    }}>
                      <div className={styles.deliveryTitle}><p>Доставка</p> <img src="/order/1.svg" alt="" /></div>
                      <div className={styles.deliveryBody}><p>По России</p><span>Выбрать</span></div>
                  </div>
                  <div className={methodDelivert == 2? `${styles.active} ${styles.delivery}` : `${styles.delivery}`} onClick={() => setMetodDelivery(2)}>
                      <div className={styles.deliveryTitle}><p>Доставка</p> <img src="/order/2.svg" alt="" /></div>
                      <div className={styles.deliveryBody}><p>По СПб</p><span>Выбрать</span></div>
                  </div>
                  <div className={methodDelivert == 3? `${styles.active} ${styles.delivery}` : `${styles.delivery}`} onClick={() => setMetodDelivery(3)}>
                      <div className={styles.deliveryTitle}><p>Самовывоз</p> <img src="/order/3.svg" alt="" /></div>
                      <div className={styles.deliveryBody}><p>В магазине</p><span>Выбрать</span></div>
                  </div>
              </div>
          </div>
          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.products}>
                {basket.map((item:any) => 
                  <div key={item.id} className={styles.item}>
                    {item?.product?.image != null ?
                        <img src={`/products/${item?.product?.image}`} alt={`${item?.product?.name}`} />
                    :
                        <img src="/quickshopimage.png" alt={`${item?.product?.name}`} />
                    }
                    <div className={styles.itemText}>
                      <div className={styles.itemTextTitle}>
                        <p>{item.quantity} х {item?.product?.name} </p>
                        <span>{(item?.product?.price)?.toLocaleString()}₽</span>
                      </div>
                      <p className={styles.itemInfo}>«{item?.product?.category?.name}»</p>
                    </div>
                  </div>
                )}

              </div>

              <div className={styles.sale}>
                  <div className={styles.saleEl}>
                    <p>Стоимость товаров</p>
                    <p>{amount?.toLocaleString()}₽</p>
                  </div>
                  <div className={styles.saleEl}>
                    <p>Доставка</p>
                    <span>{methodDelivert == 0? "Не выбрано" : methodDelivert == 1? "Бесплатно" : methodDelivert == 2? "Стоимость уточнит менеджер" : "Бесплатно"}</span>
                  </div>
                  {methodDelivert == 1?
                  <div className={styles.saleEl}>
                    <p>Адрес доставки</p>
                    {/* <span>{codeCdek.city? `${codeCdek?.city}, ${codeCdek?.address}` : "Не выбрано"}</span> */}
                  </div>
                  :
                  ""
                  }
              </div>

              <div className={styles.itog}>
                <p>Итого</p>
                <p>{amount?.toLocaleString()}₽</p>
              </div>

              <button onClick={() => placeOrder()} className={styles.buttonOrder}>{!load? "Оформить заказ" : <i className='pi pi-spin pi-spinner'></i>}</button>
              

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}