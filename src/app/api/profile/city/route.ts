import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try{
        let way = req.nextUrl.searchParams.get('way') as string
        let id = req.nextUrl.searchParams.get('id') as string

        if(id) {
            const session = await getServerSession(authOptions)
            if(!session){
                const city = await db.city.findFirst();

                return NextResponse.json({ success: true, city });
            }

            const user = await db.user.findUnique({
                where: {
                    id: session.user.id
                },
                include: {
                    city: true
                }
            })

            return NextResponse.json({success: true, city: user!.city});
        }
        else if(way){
            const session = await getServerSession(authOptions)
            if(!session){
                return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
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

            return NextResponse.json({success: true, city: res});
        }else{
            const city = await db.city.findMany()
            return NextResponse.json({success: true, city});
        }
        
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
