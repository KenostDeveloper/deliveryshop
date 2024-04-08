export type OrderType = {
    date: Date;
    number: number;
    status: string;
    deliveryMethod: string;
    products: ProductType[];
}

export type ProductType = {
    image: string;
    price: number;
}