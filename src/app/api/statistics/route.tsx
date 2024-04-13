import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        let data:any = {};

        var date = new Date();
        let week = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
        let month = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

        data['day'] = date.getDate();
        data['week'] = month[date.getMonth()];
        data['month'] = week[date.getDay() - 1];

        let startDay = new Date();
        startDay.setHours(0, 0, 0, 1); // Начало дня.

        let endDay = new Date();
        endDay.setHours(23, 59, 59, 999); // Конец дня.


        const getOrders = await db.orderProducts.findMany({
            where: {
                order: {
                    date: {
                        gte: startDay,
                        lte: endDay,
                    }
                },
                product: {
                    idUser: session.user.id 
                }
            }
        })

        let sumCount = 0;
        let sumCost = 0;

        for(let i = 0; i < getOrders.length; i++){
            sumCost = sumCost + getOrders[i].price! * getOrders[i].quantity!
            sumCount += getOrders[i].quantity!
        }

        data['orders_today'] = {sumCount, sumCost}

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

        let sumCountAll = 0;
        let sumCostAll = 0;

        for(let i = 0; i < getOrdersAll.length; i++){
            sumCostAll = sumCostAll + getOrdersAll[i].price! * getOrdersAll[i].quantity!
            sumCountAll += getOrdersAll[i].quantity!
        }

        data['orders'] = {sumCount: sumCountAll, sumCost: sumCostAll}

        const city = await db.sellerCity.findMany({
            where: {
                idUser: session.user.id
            },
            include: {
                city: true
            }
        })

        const res = city.reduce((o: any, i: any) => {
            if (!o.find((v: { idCity: any; }) => v.idCity == i.idCity)) {
              o.push(i);
            }
            return o;
        }, []);

        const SellerCity = await db.sellerCity.findMany({
            where: {
                idUser: session.user.id 
            }
        });

        let Warehouse = 0; // Склад
        let PickPoint = 0; // Пункт выдачи
        let Transit = 0; //Транзитный

        for(let i = 0; i < SellerCity.length; i++){
            if(SellerCity[i].typePoint == "Warehouse"){
                Warehouse++;
            }else if(SellerCity[i].typePoint == "PickPoint"){
                PickPoint++;
            }else if(SellerCity[i].typePoint == "Transit"){
                Transit++;
            }
        }

        data['city'] = {cityCount: res.length, Warehouse, PickPoint, Transit}

        let sumLenght = 0;
        let sumDuration = 0;
        let sumDelivery = 0;
        let sumTotalCost = 0;

        for(let i = 0; i < getOrdersAll.length; i++){
            sumLenght += getOrdersAll[i].order.allLength!;
            sumDuration += getOrdersAll[i].order.allDuration!;
            sumDelivery += getOrdersAll[i].order.deliveryCost!;
            sumTotalCost += getOrdersAll[i].order.totalCost!;
        }
        
        data['medium_lenght'] = (sumLenght / getOrdersAll.length).toFixed(2)
        data['medium_duration'] = (sumDuration / getOrdersAll.length).toFixed(2)
        data['medium_delivery'] = (sumDelivery / getOrdersAll.length).toFixed(2)
        data['medium_cost'] = (sumTotalCost / getOrdersAll.length).toFixed(2)
        
        // data['orders_list'] = getOrdersAll;


        return NextResponse.json({success: true, data});
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
