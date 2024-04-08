import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
const fs = require('fs');
import { cookies } from 'next/headers'

export async function POST(req: NextRequest, res: NextResponse) {
    try{
        const data = await req.formData()
        const id_product = data.get('id_product') as string;
        const quantity = data.get('quantity') as string;
    
        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')

        const thisData = new Date(Date.now());

        //Удаляем все просроченые токены
        const deleteExpiresTokenBasket = await db.basket.deleteMany({
            where: {
                token: {
                    expires: {
                        lt: thisData
                    }
                }
            }
        })

        const deleteExpiresToken = await db.basketToken.deleteMany({
            where: {
                expires: {
                    lt: thisData
                }
            }
        })
        
    
        if(!isBasketNull){
            //Созаём токен
            const token = uuidv4();

            let time = 24*60*60*30*1000;
            const maxAgeCokies = new Date(Date.now() + time);

            cookies().set({
                name: 'basket-quick-shop',
                value: token,
                httpOnly: true,
                expires: maxAgeCokies,
                path: '/',
            })

            const BasketToken = await db.basketToken.create({
                data: {
                    token: token,
                    expires: maxAgeCokies
                }
            })
            
            const basket = await db.basket.create({
                data: {
                    id_token: BasketToken.id,
                    id_product: Number(id_product),
                    quantity: Number(quantity)
                }
            });

            return NextResponse.json({success: true, basket});
        }else{
            //Получаем токен
            const token = cookiesList.get('basket-quick-shop');

            let time = 24*60*60*30*1000;
            const maxAgeCokies = new Date(Date.now() + time);

            cookies().set({
                name: 'basket-quick-shop',
                value: `${token?.value}`,
                httpOnly: true,
                expires: maxAgeCokies,
                path: '/',
            })

            const getToken = await db.basketToken.findFirst({
                where: {
                    token: token?.value
                }
            })

            const updateExpires = await db.basketToken.update({
                where: {
                    id: getToken?.id
                },
                data: {
                    expires: maxAgeCokies
                }
            })

            const isProduct = await db.basket.findFirst({
                where: {
                    id_token: getToken?.id,
                    id_product: Number(id_product)
                }
            })


            if(isProduct == null){
                const basket = await db.basket.create({
                    data: {
                        id_token: getToken?.id!,
                        id_product: Number(id_product),
                        quantity: Number(quantity)
                    }
                });

                return NextResponse.json({success: true, basket});
            }else{
                const basket = await db.basket.update({
                    where: {
                        id: isProduct.id
                    },
                    data: {
                        id_token: getToken?.id,
                        id_product: Number(id_product),
                        quantity: Number(quantity)
                    }
                });
                return NextResponse.json({success: true, basket});
            }
        }
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
    
}


export async function GET(req: NextRequest) {
    try{
        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')
        
        if(!isBasketNull){
            return NextResponse.json({success: false, basket: null});
        }else{
            //Получаем токен
            const token = cookiesList.get('basket-quick-shop');

            let time = 24*60*60*30*1000;
            const maxAgeCokies = new Date(Date.now() + time);

            cookies().set({
                name: 'basket-quick-shop',
                value: `${token?.value}`,
                httpOnly: true,
                expires: maxAgeCokies,
                path: '/',
            })

            const getToken = await db.basketToken.findFirst({
                where: {
                    token: token?.value
                }
            })

            const updateExpires = await db.basketToken.update({
                where: {
                    id: getToken?.id
                },
                data: {
                    expires: maxAgeCokies
                }
            })

            const basket = await db.basket.findMany({
                where: {
                    id_token: getToken?.id
                },
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            })

            


            return NextResponse.json({success: false, basket});
        }
    
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}

export async function DELETE(req: NextRequest) {
    try{
        let id = req.nextUrl.searchParams.get('id') as string
        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')
        
        if(!isBasketNull){
            return NextResponse.json({success: false, basket: null});
        }else{
            //Получаем токен
            const token = cookiesList.get('basket-quick-shop');

            const maxAgeCokies = new Date(Date.now() + 24*60*60*30);

            cookies().set({
                name: 'basket-quick-shop',
                value: `${token?.value}`,
                httpOnly: true,
                expires: maxAgeCokies,
                path: '/',
            })

            const getToken = await db.basketToken.findFirst({
                where: {
                    token: token?.value
                }
            })

            const deleteProduct = await db.basket.deleteMany({
                where: {
                    id_token: getToken?.id,
                    id_product: Number(id)
                }
            })

            return NextResponse.json({success: true, deleteProduct});
        }
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }

    
}