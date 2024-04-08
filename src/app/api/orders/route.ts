import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth/next"
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from 'next/headers'
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')
        
        if(!isBasketNull){
            return NextResponse.json({success: false, message: "Вы не можете оформить пустой заказ!"});
        }else{
            //Получаем токен
            const token = cookiesList.get('basket-quick-shop');

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
                    token: token?.value
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

            //Считаем сумму заказа
            let cost = 0;
            for(let i = 0; i < basket.length; i++){
                cost = cost + basket[i]?.product?.price! * basket[i]?.quantity
            }

            //Создаём заказ
            const order = await db.orders.create({
                data: {
                    idUser: session.user.id,
                    date: new Date(Date.now()),
                    cost: cost
                }
            })

            //Добавляем товары в заказ
            for(let i = 0; i < basket.length; i++){
                const orderProduct = db.orderProducts.create({
                    data: {
                        idOrder: order.id,
                        idProduct: basket[i].product.id,
                        price: basket[i].product.price,
                        count: basket[i].product.count
                    }
                })

                //Удаляем всё содержимое корзины
                await axios.delete(`/api/basket?id=${basket[i].product.id}`);
            }

            
            return NextResponse.json({success: true, message: "Заказ оформлен!", order});
        }

    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}



export async function GET(req: NextRequest) {
    try{
        let id = req.nextUrl.searchParams.get('id') as string
        let user_id = req.nextUrl.searchParams.get('user_id') as string
        let category_id = req.nextUrl.searchParams.get('category_id') as string

        let page = req.nextUrl.searchParams.get('page') as string
        let limit = req.nextUrl.searchParams.get('limit') as string
        let tag = req.nextUrl.searchParams.get('tag') as string

        let getPage = Number(page) || 1;
        let getLimit = Number(limit) || 9;
        let offset = getPage * getLimit - getLimit;


        if(user_id){

            const session = await getServerSession(authOptions)

            const count = await db.product.count();
            const product = await db.product.findMany({
                where: {
                    idUser: session?.user.id
                },
                take: getLimit,
                skip: offset,
            });

            return NextResponse.json({count, product});
        }

        if(!id){
            const count = await db.product.count();

            const product = await db.product.findMany({
                take: getLimit,
                skip: offset,
            });

            return NextResponse.json({count, product});

        }else{
            const product = await db.product.findUnique({
                where: {
                    id: Number(id)
                }
            });

            return NextResponse.json({product});
        }



    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}



export async function PUT(req: NextRequest, res: NextResponse) {
    try{
        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        const data = await req.formData()
        const id = data.get('id') as string
        const name = data.get('name') as string
        const price = data.get('price') as string
        const length = data.get('length') as string
        const width = data.get('width') as string
        const height = data.get('height') as string
        const weight = data.get('weight') as string
        const description = data.get('description') as string
        const status = data.get('status') as string
        const category = data.get('category') as string
        const count = data.get('count') as string
        

        if(!name || !price || !length || !length || !width || !height || !weight || !description || !status || !category || !count){
            return NextResponse.json({success: false, message: "Пожалуйста, заполните все поля!"});
        }

        let statusBool = true;

        if(status == "false"){
            statusBool = false;
        }
    
        const productUpdate = await db.product.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name,
                price: Number(price),
                length: Number(length),
                width: Number(width),
                height: Number(height),
                weight: Number(weight),
                description: description,
                idCategory: Number(category),
                status: statusBool,
                count: Number(count)
            }
        })

        return NextResponse.json({success: true, message: "Продукт обновлён!"});
    
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}