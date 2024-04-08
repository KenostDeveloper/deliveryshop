import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";

//Маршруты от города до города
export async function POST(req: NextRequest, res: NextResponse) {
    try{

        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        const info = await req.json()
        console.log(info)


        const cityWay = info.cityWay
        const cityWayTransport = info.cityWayTransport

        if(!cityWay.city1 || !cityWay.city2 || !cityWay.length){
            return NextResponse.json({success: false, message: "Пожалуйста, заполните все поля!"});
        }
        if(cityWayTransport[0].transport == "" || cityWayTransport[0].duration == 0 || cityWayTransport[0].cost == 0){
            return NextResponse.json({success: false, message: "Пожалуйста, заполните хотя бы тип транспорта"});
        }
        if(cityWay.city1 == cityWay.city2){
            return NextResponse.json({success: false, message: "Вы не можете указать одинаковые города"});
        }

        const newCityWay = await db.cityWay.create({
            data: {
                idCity1: cityWay.city1,
                idCity2: cityWay.city2,
                length: cityWay.length,
                idUser: session.user.id
            }
        })

        for(let i = 0; i < cityWayTransport.length; i++){
            const isCityWayTransport = await db.cityWayTransport.findFirst({
                where: {
                    idCityWay: newCityWay.id,
                    idTransport: cityWayTransport[i].transport
                }
            })

            console.log(isCityWayTransport)

            if(isCityWayTransport == null){
                // console.log(cityWayTransport[i].duration, cityWayTransport[i].cost, newCityWay.id, cityWayTransport[i].transport)
                const newCityWayTransport = await db.cityWayTransport.create({
                    data: {
                        duration: Number(cityWayTransport[i].duration),
                        cost: Number(cityWayTransport[i].cost),
                        idCityWay: newCityWay.id,
                        idTransport: cityWayTransport[i].transport
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
        const session = await getServerSession(authOptions)
        if(!session || session.user.role != "SELLER"){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        let graph = req.nextUrl.searchParams.get('graph') as string


        const data = {
            nodes: [
                { id: "Harry" },
                { id: "Sally" },
                { id: "Alice" },
            ],
            // links: [
            //     { source: "Harry", target: "Sally", label: "Москва" },
            //     { source: "Harry", target: "Alice", label: "Пермь" },
            // ],
        }
    

        if(graph){

            let cityway: any = {
                nodes: [],
                links: []
            }

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

            for(let i = 0; i < res.length; i++){
                cityway.nodes.push({id: res[i].city.name})
            }

            const getCityWay = await db.cityWay.findMany({
                where: {
                    idUser: session.user.id
                },
                include: {
                    city1: true,
                    city2: true
                }
            })

            for(let i = 0; i < getCityWay.length; i++){
                cityway.links.push({source: getCityWay[i].city1.name, target: getCityWay[i].city2.name})
            }
            
            return NextResponse.json({success: true, cityway});
        }else{
            const cityway = await db.cityWay.findMany({
                where: {
                    idUser: session.user.id
                }
            })
    
            return NextResponse.json({success: true, cityway});
        }

        
        
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
