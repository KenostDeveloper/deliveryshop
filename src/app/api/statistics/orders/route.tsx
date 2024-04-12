import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        const json = await req.json();


        if(json.filtrs){
            let data:any = {}

            let date1 = new Date(json.filtrs.date[0]);
            let date2 = new Date(json.filtrs.date[1]);

            let getOrdersAll: any;

            if(json.filtrs.status){
                getOrdersAll = await db.orderProducts.findMany({
                    where: {
                        product: {
                            idUser: session.user.id
                        },
                        order: {
                            date: {
                                gte: date1,
                                lte: date2,
                            },
                            status: {
                                id: json.filtrs.status
                            }
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
            }else{
                getOrdersAll = await db.orderProducts.findMany({
                    where: {
                        product: {
                            idUser: session.user.id
                        },
                        order: {
                            date: {
                                gte: date1,
                                lte: date2,
                            }
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
            }

            for(let i = 0; i < getOrdersAll.length; i++){
                let newData = getOrdersAll[i].order.date?.toLocaleString()
                getOrdersAll[i]['date'] = newData
                getOrdersAll[i]['cost'] = getOrdersAll[i].order.cost
                getOrdersAll[i]['product_name'] = getOrdersAll[i].product.name
                getOrdersAll[i]['deliveryCost'] = getOrdersAll[i].order.deliveryCost
                getOrdersAll[i]['allDuration'] = getOrdersAll[i].order.allDuration
                getOrdersAll[i]['allLength'] = getOrdersAll[i].order.allLength
            }

            data['orders'] = getOrdersAll;

            data['text'] = `Заказы за период ${date1.toLocaleString().split(',')[0]} по ${date2.toLocaleString().split(',')[0]}`;

            return NextResponse.json({success: true, data});
        }

        let data:any = {}

        const getOrdersAll: any = await db.orderProducts.findMany({
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
            let newData = getOrdersAll[i].order.date?.toLocaleString()
            getOrdersAll[i]['date'] = newData
            getOrdersAll[i]['cost'] = getOrdersAll[i].order.cost
            getOrdersAll[i]['product_name'] = getOrdersAll[i].product.name
            getOrdersAll[i]['deliveryCost'] = getOrdersAll[i].order.deliveryCost
            getOrdersAll[i]['allDuration'] = getOrdersAll[i].order.allDuration
            getOrdersAll[i]['allLength'] = getOrdersAll[i].order.allLength
        }

        data['text'] = "Заказы за весь период";
        data['orders'] = getOrdersAll;
        return NextResponse.json({success: true, data});

    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e: e.message,
        });
    }
}
