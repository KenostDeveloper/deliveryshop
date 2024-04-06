import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth/next"
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try{

        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
        }


        const data = await req.formData()
        const file: File | null = data.get('file') as unknown as File;
        const nameShop = data.get('name') as string
        const descriptionShop = data.get('description') as string
    
        if(file){
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
        
            //Получаем тип файла
            //let type = "." + file.type.replace('image/','');
        
            let type = "." + file.type.replace('image/','');
            const name = uuidv4();
    
            //Путь файла
            const path = `${process.cwd()}/public/users/${name}${type}`;
            //Сохраняем файл
            await writeFile(path, buffer);


            const userUpdate = await db.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    image: `${name}${type}`,
                    nameShop: nameShop,
                    description: descriptionShop
                }
            })

            return NextResponse.json({success: true, message: "Данные обновлены!", profile: userUpdate});

        }else{
            const userUpdate = await db.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    nameShop: nameShop,
                    description: descriptionShop
                }
            })

            return NextResponse.json({success: true, message: "Данные обновлены!", profile: userUpdate});
        }
    


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

        const profile = await db.user.findUnique({
            where: {
                id: session.user.id
            }
        })

        return NextResponse.json({profile});


    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
