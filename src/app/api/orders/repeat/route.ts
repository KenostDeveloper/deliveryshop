import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

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
        const isBasketNull = !cookiesList.has("basket-quick-shop");

        const data = await req.json();

        const products = data.products;


        const basketToken = await db.basketToken.findFirst({
            where: {
                token: cookiesList.get('basket-quick-shop')?.value
            }
        })

        if (!basketToken) {
            return NextResponse.json({
                success: false,
                message: "Корзина не найдена!",
            });
        }

        // Удалить содержимое корзины, если есть
        if (!isBasketNull) {
            await db.basket.deleteMany({
                where: {
                    id_token: basketToken?.id
                },
            })            
        }

        // Добавление новых товаров в корзину
        // products.forEach(async (product: any) => {
        //     await db.basket.create({
        //         data: {
        //             id_token: Number(basketToken?.id),
        //             id_product: product?.product?.id,
        //             quantity: product?.count
        //         }
        //     })
        //     console.log("Продукт добавлен", product);
            
        // })
        const basket = await db.basket.createMany({
            data: products.map((product: any) => ({
                id_token: basketToken?.id,
                id_product: product?.product?.id,
                quantity: product?.quantity
            })),
        })

        return NextResponse.json({ success: true, message: "Корзина пересоздана!", basket });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
