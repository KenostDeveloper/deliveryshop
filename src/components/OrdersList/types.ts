export type OrderType = {
    id: number;
    date: string;
    status: string;
    deliveryMethod: string;
    user: string,
    paymentMethod: string,
    telephone: string;
    email: string;
    address: string;
    deliveryPrice: number;
    products: ProductType[];
}

export type ProductType = {
    id: number;
    name: string;
    image: string;
    price: number;
    count: number;
}