import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth/next"
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";



export async function POST(req: NextRequest, res: NextResponse) {
    try{

        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        const info = await req.json()


        for(let i = 0; i < info.warehouse.length; i++){
            if(info.warehouse[i].typePoint == "Warehouse" && info.warehouse[i].count > 0){
                const createSellerCityProducts = await db.sellerCityProducts.create({
                    data: {
                        idSellerCity: info.warehouse[i].id,
                        idProduct: info.product.id,
                        count: info.warehouse[i].count,
                    }   
                })
            }
        }

        return NextResponse.json({success: true, message: "Продукт успешно создан!"});

    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}


export async function GET(req: NextRequest) {
    try{
        const category = await db.category.findMany();

        return NextResponse.json({category});
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
