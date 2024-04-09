import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(req: NextRequest, res: NextResponse) {
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

        if (!isBasketNull) {
            return NextResponse.json({
                success: false,
                message: "Вы не можете оформить пустой заказ!",
            });
        } else {
            //Получаем токен
            const token = cookiesList.get("basket-quick-shop");

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
                        // user: {
                        //     include: {
                        //         cityWay: {
                        //             include: {
                        //                 city1: true,
                        //                 city2: true
                        //             }
                        //         }
                        //     }
                        // },
                        sellerCityProducts: {
                            include: {
                                sellerCity: true
                            }
                        }
                      }  
                    },
                },
            });

            for(let i = 0; i < basket.length; i++){

            }

            return NextResponse.json({ success: true, message: "Маршрут построен!", basket });
        }
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}