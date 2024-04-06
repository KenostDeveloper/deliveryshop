'use client'
import Image from 'next/image'
import CardPost from "@/components/CardPost/CardPost";
import Banner from "@/components/Banner/Banner";
import CardsSlider from "@/components/CardsSlider/CardsSlider";
import ProductsSwiper from "@/components/ProductsSwiper/ProductsSwiper.components";
import styles from '../style/Home.module.scss'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import Title from '@/components/UI/Title.components';
import Catalog from "@/components/Catalog/Catalog";
import Advantages from '@/components/Advantages/Advantages';


export default function Home() {

    const [loading, setLoading] = useState(true)
    const {data: session, update} = useSession();

    const [products, setProducts] = useState([
        {
            "id": 5,
            "acticle": "iPhone-15-white",
            "id_card": 11,
            "id_color": 1,
            "id_size": 3,
            "price": 109999,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 15 Pro Apple 256 GB Белый",
            "card": {
                "id": 11,
                "name": "iPhone 15 Pro",
                "description": "qwrt et ert",
                "id_company": 1,
                "id_category": 1,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 1,
                    "id_parent": null,
                    "product_name": "Смартфон",
                    "name": "Смартфоны"
                }
            },
            "color": {
                "id": 1,
                "name": "Белый",
                "code": "FFFFFF"
            },
            "size": {
                "id": 3,
                "name": "256 GB"
            },
            "image": [
                {
                    "id": 13,
                    "id_product": 5,
                    "name": "94d02106-4111-4787-9c72-9010a4a27670.webp"
                },
                {
                    "id": 14,
                    "id_product": 5,
                    "name": "5fbb204a-4a23-415f-b55c-6563e644938f.webp"
                },
                {
                    "id": 15,
                    "id_product": 5,
                    "name": "ff8e91d2-7756-487b-82b5-05e93b2ae92b.webp"
                },
                {
                    "id": 16,
                    "id_product": 5,
                    "name": "bb5fdd73-cd73-4975-8763-99f26bbe243b.webp"
                },
                {
                    "id": 17,
                    "id_product": 5,
                    "name": "f514840b-a251-43e9-a558-78c9b5564e5c.webp"
                },
                {
                    "id": 18,
                    "id_product": 5,
                    "name": "958ed36a-9674-4b33-bb66-3917b1ba92bc.webp"
                },
                {
                    "id": 19,
                    "id_product": 5,
                    "name": "365f1835-4ce5-472f-aa43-4262570d5ecb.webp"
                },
                {
                    "id": 20,
                    "id_product": 5,
                    "name": "fde366af-9314-4faf-9085-5dc1ba9adce0.webp"
                },
                {
                    "id": 21,
                    "id_product": 5,
                    "name": "ca720c3b-e4f4-4755-a54a-262d45deda2d.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        },
        {
            "id": 6,
            "acticle": "iPhone-pro-15",
            "id_card": 11,
            "id_color": 2,
            "id_size": 2,
            "price": 109999,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 15 Pro Apple 128 GB Чёрный",
            "card": {
                "id": 11,
                "name": "iPhone 15 Pro",
                "description": "qwrt et ert",
                "id_company": 1,
                "id_category": 1,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 1,
                    "id_parent": null,
                    "product_name": "Смартфон",
                    "name": "Смартфоны"
                }
            },
            "color": {
                "id": 2,
                "name": "Чёрный",
                "code": "000000"
            },
            "size": {
                "id": 2,
                "name": "128 GB"
            },
            "image": [
                {
                    "id": 22,
                    "id_product": 6,
                    "name": "2d18a2be-8d9e-499e-aaa1-19816cae4da9.webp"
                },
                {
                    "id": 23,
                    "id_product": 6,
                    "name": "ac853e72-1444-4146-a449-234f494b13ad.webp"
                },
                {
                    "id": 24,
                    "id_product": 6,
                    "name": "1c646bd1-89aa-49d8-99b6-7227dfe3fdfc.webp"
                },
                {
                    "id": 25,
                    "id_product": 6,
                    "name": "7c4fc014-288a-4de6-8ade-b95fc635ad6e.webp"
                },
                {
                    "id": 26,
                    "id_product": 6,
                    "name": "b7f8cb37-0bbf-4d7b-802f-f46054d13b3c.webp"
                },
                {
                    "id": 27,
                    "id_product": 6,
                    "name": "28e980f2-18c1-434c-a8ec-c929f9bd0f39.webp"
                },
                {
                    "id": 28,
                    "id_product": 6,
                    "name": "cb934d35-4f07-4fc9-bee5-e4076fd2b90d.webp"
                },
                {
                    "id": 29,
                    "id_product": 6,
                    "name": "8df6243b-701e-4084-b951-4c9ceeb3b117.webp"
                },
                {
                    "id": 30,
                    "id_product": 6,
                    "name": "7decb3e4-2379-4771-ad04-1377a363aec5.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        },
        {
            "id": 8,
            "acticle": "iPhone-15-test",
            "id_card": 11,
            "id_color": 1,
            "id_size": 3,
            "price": 109999,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 15 Pro Apple 256 GB Белый",
            "card": {
                "id": 11,
                "name": "iPhone 15 Pro",
                "description": "qwrt et ert",
                "id_company": 1,
                "id_category": 1,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 1,
                    "id_parent": null,
                    "product_name": "Смартфон",
                    "name": "Смартфоны"
                }
            },
            "color": {
                "id": 1,
                "name": "Белый",
                "code": "FFFFFF"
            },
            "size": {
                "id": 3,
                "name": "256 GB"
            },
            "image": [
                {
                    "id": 32,
                    "id_product": 8,
                    "name": "07f4b3eb-4b0d-440d-9cc7-31c4451ccc71.webp"
                },
                {
                    "id": 33,
                    "id_product": 8,
                    "name": "14633fef-b48c-4c73-a0ae-46a460eb6b75.webp"
                },
                {
                    "id": 34,
                    "id_product": 8,
                    "name": "a8f7e7d7-05e7-4593-a054-c5b79eba6f23.webp"
                },
                {
                    "id": 35,
                    "id_product": 8,
                    "name": "93315311-c2c1-4ed7-9142-90c388727ed1.webp"
                },
                {
                    "id": 36,
                    "id_product": 8,
                    "name": "0e039bf3-4ee9-4517-b148-57acbfb0cdd3.webp"
                },
                {
                    "id": 37,
                    "id_product": 8,
                    "name": "d587f49b-8920-4fe9-8b00-6908fcc35551.webp"
                },
                {
                    "id": 38,
                    "id_product": 8,
                    "name": "bbe1454b-fcc7-41e4-a965-82081061bb36.webp"
                },
                {
                    "id": 39,
                    "id_product": 8,
                    "name": "10cd227a-7f2a-4d9d-8189-690fb003e6c5.webp"
                },
                {
                    "id": 40,
                    "id_product": 8,
                    "name": "97f82a66-834d-4034-83d0-69eccc553908.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        },
        {
            "id": 9,
            "acticle": "iPhone-15-test",
            "id_card": 11,
            "id_color": 2,
            "id_size": 3,
            "price": 109999,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 15 Pro Apple 256 GB Чёрный",
            "card": {
                "id": 11,
                "name": "iPhone 15 Pro",
                "description": "qwrt et ert",
                "id_company": 1,
                "id_category": 1,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 1,
                    "id_parent": null,
                    "product_name": "Смартфон",
                    "name": "Смартфоны"
                }
            },
            "color": {
                "id": 2,
                "name": "Чёрный",
                "code": "000000"
            },
            "size": {
                "id": 3,
                "name": "256 GB"
            },
            "image": [
                {
                    "id": 41,
                    "id_product": 9,
                    "name": "07f4b3eb-4b0d-440d-9cc7-31c4451ccc71.webp"
                },
                {
                    "id": 42,
                    "id_product": 9,
                    "name": "14633fef-b48c-4c73-a0ae-46a460eb6b75.webp"
                },
                {
                    "id": 43,
                    "id_product": 9,
                    "name": "a8f7e7d7-05e7-4593-a054-c5b79eba6f23.webp"
                },
                {
                    "id": 44,
                    "id_product": 9,
                    "name": "93315311-c2c1-4ed7-9142-90c388727ed1.webp"
                },
                {
                    "id": 45,
                    "id_product": 9,
                    "name": "0e039bf3-4ee9-4517-b148-57acbfb0cdd3.webp"
                },
                {
                    "id": 46,
                    "id_product": 9,
                    "name": "d587f49b-8920-4fe9-8b00-6908fcc35551.webp"
                },
                {
                    "id": 47,
                    "id_product": 9,
                    "name": "bbe1454b-fcc7-41e4-a965-82081061bb36.webp"
                },
                {
                    "id": 48,
                    "id_product": 9,
                    "name": "10cd227a-7f2a-4d9d-8189-690fb003e6c5.webp"
                },
                {
                    "id": 49,
                    "id_product": 9,
                    "name": "97f82a66-834d-4034-83d0-69eccc553908.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        },
        {
            "id": 11,
            "acticle": "test",
            "id_card": 21,
            "id_color": 1,
            "id_size": 2,
            "price": 1111111111,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 13 Pro Apple 128 GB Белый",
            "card": {
                "id": 21,
                "name": "iPhone 13 Pro",
                "description": "iPhone 15 продолжает использовать впечатляющие Super Retina XDR дисплеи, но на этот раз они стали ярче и более улучшенными. С диагональю 6,1 дюйма и пиковой яркостью 2000 кд/м², экраны iPhone 15 обеспечивают великолепное качество изображения и яркие цвета, делая просмотр контента и работу с приложениями еще более приятными.",
                "id_company": 1,
                "id_category": 3,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 3,
                    "id_parent": 1,
                    "product_name": "Sumsung",
                    "name": "Sumsung"
                }
            },
            "color": {
                "id": 1,
                "name": "Белый",
                "code": "FFFFFF"
            },
            "size": {
                "id": 2,
                "name": "128 GB"
            },
            "image": [
                {
                    "id": 59,
                    "id_product": 11,
                    "name": "59da8c3e-496d-4604-b0e2-3ad8489d259f.webp"
                },
                {
                    "id": 60,
                    "id_product": 11,
                    "name": "1f2f5059-63e2-4cf0-bc39-2f9403de617e.webp"
                },
                {
                    "id": 61,
                    "id_product": 11,
                    "name": "7c23da20-e5f5-49ad-b764-a55277ffdd25.webp"
                },
                {
                    "id": 62,
                    "id_product": 11,
                    "name": "de3f7262-5710-4ac8-a189-b03d8325fde7.webp"
                },
                {
                    "id": 63,
                    "id_product": 11,
                    "name": "00bb40e6-5939-48c8-bb1f-a09c7afdf219.webp"
                },
                {
                    "id": 64,
                    "id_product": 11,
                    "name": "0db1d4e8-582a-45b7-ba2e-2a7282e6b269.webp"
                },
                {
                    "id": 65,
                    "id_product": 11,
                    "name": "5b0d2ab1-ee4d-482e-81e8-5e33ed9ba1eb.webp"
                },
                {
                    "id": 66,
                    "id_product": 11,
                    "name": "985d7f15-3994-45d4-b215-c4ca0461fd4f.webp"
                },
                {
                    "id": 67,
                    "id_product": 11,
                    "name": "e9452dd0-8ad6-4d61-9ccc-38a032ed1ff6.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        },
        {
            "id": 12,
            "acticle": "test",
            "id_card": 20,
            "id_color": 1,
            "id_size": 2,
            "price": 1111111111,
            "isShow": false,
            "id_tag": 1,
            "search": "Смартфоны Apple iPhone 15 Apple 128 GB Белый",
            "card": {
                "id": 20,
                "name": "iPhone 15",
                "description": "iPhone 15 продолжает использовать впечатляющие Super Retina XDR дисплеи, но на этот раз они стали ярче и более улучшенными. С диагональю 6,1 дюйма и пиковой яркостью 2000 кд/м², экраны iPhone 15 обеспечивают великолепное качество изображения и яркие цвета, делая просмотр контента и работу с приложениями еще более приятными.",
                "id_company": 1,
                "id_category": 2,
                "company": {
                    "id": 1,
                    "name": "Apple"
                },
                "category": {
                    "id": 2,
                    "id_parent": 1,
                    "product_name": "iPhone",
                    "name": "iPhone"
                }
            },
            "color": {
                "id": 1,
                "name": "Белый",
                "code": "FFFFFF"
            },
            "size": {
                "id": 2,
                "name": "128 GB"
            },
            "image": [
                {
                    "id": 68,
                    "id_product": 12,
                    "name": "59da8c3e-496d-4604-b0e2-3ad8489d259f.webp"
                },
                {
                    "id": 69,
                    "id_product": 12,
                    "name": "1f2f5059-63e2-4cf0-bc39-2f9403de617e.webp"
                },
                {
                    "id": 70,
                    "id_product": 12,
                    "name": "7c23da20-e5f5-49ad-b764-a55277ffdd25.webp"
                },
                {
                    "id": 71,
                    "id_product": 12,
                    "name": "de3f7262-5710-4ac8-a189-b03d8325fde7.webp"
                },
                {
                    "id": 72,
                    "id_product": 12,
                    "name": "00bb40e6-5939-48c8-bb1f-a09c7afdf219.webp"
                },
                {
                    "id": 73,
                    "id_product": 12,
                    "name": "0db1d4e8-582a-45b7-ba2e-2a7282e6b269.webp"
                },
                {
                    "id": 74,
                    "id_product": 12,
                    "name": "5b0d2ab1-ee4d-482e-81e8-5e33ed9ba1eb.webp"
                },
                {
                    "id": 75,
                    "id_product": 12,
                    "name": "985d7f15-3994-45d4-b215-c4ca0461fd4f.webp"
                },
                {
                    "id": 76,
                    "id_product": 12,
                    "name": "e9452dd0-8ad6-4d61-9ccc-38a032ed1ff6.webp"
                }
            ],
            "tag": {
                "id": 1,
                "name": "Новинки"
            }
        }
    ])

    useEffect(() => {
        console.log(session)
    })

    useEffect(() => {
        if(typeof(session) == "object"){
            setLoading(false)
        }
    }, [session]);


    if(loading){
        return <Loading/>
    }
    

    return (
        <div className={styles.ListPost}>
            <div className="container">
                <Banner/>

                <Title text="Популярные товары" margin={true}/>
                <ProductsSwiper products={products}/>

                <Title text="Каталог" margin={true}/>
                <Catalog />

                <Title text="Акции" margin={true}/>
                <ProductsSwiper products={products}/>

                <Title text="Наши преимущества" margin={true}/>
                <Advantages />

                <Title text="Отзывы клиентов" margin={true}/>
                {/* Здесь будут отзывы клиентов */}
            </div>

            {/*Изменить данные сессии*/}
            {/*<div onClick={() => update({ username: "kenostru" })}>Имя = kenostru</div>*/}

            {/*<div>{session?.user? `${session?.user?.username}` : ""}</div>*/}
        </div>
    )
}
