import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const cookiesList = cookies();
        const isBasketNull = cookiesList.has("basket-quick-shop");

        const data = await req.json();
        const deliveryCost = data.deliveryCost;
        const cities = data.cities;        

        if (!isBasketNull) {
            return NextResponse.json({
                success: false,
                message: "Вы не можете оформить пустой заказ!",
            });
        } else {
            //Получаем токен
            const token = cookiesList.get("basket-quick-shop");

            // let time = 24*60*60*30*1000;
            // const maxAgeCokies = new Date(Date.now() + time);

            // cookies().set({
            //     name: 'basket-quick-shop',
            //     value: `${token?.value}`,
            //     httpOnly: true,
            //     expires: maxAgeCokies,
            //     path: '/',
            // })

            const getToken = await db.basketToken.findFirst({
                where: {
                    token: token?.value,
                },
            });

            const basket = await db.basket.findMany({
                where: {
                    id_token: getToken?.id,
                },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });

            //Считаем сумму заказа
            let cost = 0;
            for (let i = 0; i < basket.length; i++) {
                cost += basket[i]?.product?.price! * basket[i]?.quantity;
            }

            //Создаём заказ
            const order = await db.orders.create({
                data: {
                    idUser: session.user.id,
                    date: new Date(Date.now()),
                    cost: cost,
                    idStatus: 1,
                    deliveryCost: deliveryCost,
                    totalCost: cost + deliveryCost,
                },
            });

            //Добавляем товары в заказ
            for (let i = 0; i < basket.length; i++) {
                //Добавляем товары к заказу 
                const orderProduct = await db.orderProducts.create({
                    data: {
                        idOrder: order.id,
                        idProduct: basket[i].product.id,
                        price: basket[i].product.price,
                        quantity: basket[i].quantity,
                    },
                });

                //Списываем товары из складов
                let quantityToReduce = basket[i].quantity;    //Количество товара к списыванию
                cities[i].forEach(async (city: any) => {
                    //Поиск города склада
                    const cityWarehouse = await db.sellerCityProducts.findFirst({
                        where: {
                            sellerCity: {
                                city: {
                                    name: city
                                }
                            }
                        }
                    });

                    //Если город не найден, пропускать
                    if(!cityWarehouse) return;

                    //Количество к списанию со склада
                    const countToReduce = quantityToReduce > cityWarehouse!.count! ? cityWarehouse!.count! : quantityToReduce;

                    //Списывание товара с найденного склада
                    await db.sellerCityProducts.update({
                        where: {
                            id: cityWarehouse!.id,
                        },
                        data: {
                            count: cityWarehouse!.count! - countToReduce
                        }
                    });

                    quantityToReduce -= countToReduce;
                });


                //Удаляем всё содержимое корзины
                const deleteProduct = await db.basket.deleteMany({
                    where: {
                        id_token: getToken?.id,
                        id_product: basket[i].product.id,
                    },
                });
            }

            return NextResponse.json({ success: true, message: "Заказ оформлен!", order });
        }
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e: e.message,
        });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        let id = req.nextUrl.searchParams.get("id") as string;

        if (id) {
            let order: any = await db.orders.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    status: true,
                    user: true,
                },
            });

            const dateFormated = new Intl.DateTimeFormat("ru-RU", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
            }).format(new Date(order.date));

            order["date"] = dateFormated;

            const productsOrder: any = await db.orderProducts.findMany({
                where: {
                    idOrder: order.id,
                },
                include: {
                    product: true,
                    // product: {
                    //     p
                    //     // include: {
                    //     //     productRating: true
                    //     // }
                    // }
                },
            });

            order["products"] = productsOrder;

            for (let i = 0; i < order.products.length; i++) {
                const getRating = await db.productRating.findFirst({
                    where: {
                        idProduct: order.products[i].product.id,
                        idUser: session.user.id,
                    },
                });

                order["products"][i]["product"]["rating"] = getRating;
            }

            return NextResponse.json({ success: true, order });
        } else {
            let orders: any = await db.orders.findMany({
                where: {
                    idUser: session.user.id,
                },
            });

            for (let i = 0; i < orders.length; i++) {
                const dateFormated = new Intl.DateTimeFormat("ru-RU", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }).format(new Date(orders[i].date));

                orders[i]["date"] = dateFormated;

                const productsOrder = await db.orderProducts.findMany({
                    where: {
                        idOrder: orders[i].id,
                    },
                    include: {
                        product: true,
                    },
                });

                orders[i]["products"] = productsOrder;
            }

            return NextResponse.json({ success: true, orders });
        }
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const data = await req.json();
        
        const id = data.id;
        const status_id = data.status_id;

        if (
            !status_id
        ) {
            return NextResponse.json({
                success: false,
                message: "Пожалуйста, заполните все поля!",
            });
        }

        const order = await db.orders.update({
            where: {
                id: id,
            },
            data: {
                idStatus: status_id,
            },
        });

        return NextResponse.json({ success: true, message: "Статус заказа обновлен!" });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
