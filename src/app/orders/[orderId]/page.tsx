import Order from "@/components/OrdersList/Order"

export default function OrderPage() {

    // Тестовые данные
    const order = {
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
    }

    return (
        <Order order={order} />
    )
}