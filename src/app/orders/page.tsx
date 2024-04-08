import OrdersList from "@/components/OrdersList/OrdersList";
import { OrderType } from "@/components/OrdersList/types";

export default function Orders() {

    // Тестовые данные
    const orders: OrderType[] = [
        {
            date: new Date(),
            number: 1,
            status: "В обработке",
            deliveryMethod: "Доставка в пункт выдачи",
            products: [
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
            ],
        },
        {
            date: new Date(),
            number: 2,
            status: "Новый",
            deliveryMethod: "Самовывоз",
            products: [
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
            ],
        },
        {
            date: new Date(),
            number: 3,
            status: "Готов к выдаче",
            deliveryMethod: "Самовывоз",
            products: [
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
                {
                    image: "/quickshopimage.png",
                    price: 200,
                },
            ],
        },
    ];

    return <OrdersList orders={orders} />;
}