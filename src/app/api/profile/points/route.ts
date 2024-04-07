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


        for(let i = 0; i < info.shopSelected.length; i++){
            let isPoint = null;

            if(Number.isInteger(info.shopSelected[i].id)){
                isPoint = await db.sellerCity.findFirst({
                    where: {
                        id: info.shopSelected[i].id
                    }
                })
            }

            
            if(isPoint != null){
                const update = await db.sellerCity.update({
                    where: {
                        id: isPoint.id
                    },
                    data: {
                        idCity: info.shopSelected[i].idCity,
                        typePoint: info.shopSelected[i].typePoint
                    }
                })
            }else{
                const create = await db.sellerCity.create({
                    data: {
                        idUser: session.user.id,
                        idCity: info.shopSelected[i].idCity,
                        typePoint: info.shopSelected[i].typePoint
                    }
                })
            }
        }

        const points = await db.sellerCity.findMany({
            where: {
                idUser: Number(session.user.id)
            }
        })

        return NextResponse.json({success: true, message: "Города вашего магазина успешно обновлены!", points});

    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}



export async function GET(req: NextRequest) {
    try{
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }

        let count = req.nextUrl.searchParams.get('count') as string

    
        let points:any = await db.sellerCity.findMany({
            where: {
                idUser: Number(session.user.id)
            },
            include: {
                city: true
            }
        })


        if(count){
            for(let i = 0; i < points.length; i++){
                points[i].count = 0;
            }
        }

        return NextResponse.json({points});


    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
