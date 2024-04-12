import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        let data:any = {}

        const getOrdersAll = await db.orderProducts.findMany({
            where: {
                product: {
                    idUser: session.user.id
                }
            },
            include: {
                order: {
                    include: {
                        status: true
                    }
                },
                product: true
            }
        });

        for(let i = 0; i < getOrdersAll.length; i++){
            let newData = getOrdersAll[i].order.date.toLocaleString()
            getOrdersAll[i]['date'] = newData
            getOrdersAll[i]['cost'] = getOrdersAll[i].order.cost
            getOrdersAll[i]['product_name'] = getOrdersAll[i].product.name
            
        }

        
        data['orders'] = getOrdersAll;


        return NextResponse.json({success: true, data});
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
