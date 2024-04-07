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

        const data = await req.formData()
        const file: File | null = data.get('file') as unknown as File;
        const name = data.get('name') as string
        const price = data.get('price') as string
        const length = data.get('length') as string
        const width = data.get('width') as string
        const height = data.get('height') as string
        const weight = data.get('weight') as string
        const description = data.get('description') as string
        const status = data.get('status') as string
        const category = data.get('category') as string


        if(!name || !price || !length || !length || !width || !height || !weight || !description || !status || !category){
            return NextResponse.json({success: false, message: "Пожалуйста, заполните все поля!"});
        }
    
        if(file){
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
        
            let type = "." + file.type.replace('image/','');
            const nameimage = uuidv4();
    
            //Путь файла
            const path = `${process.cwd()}/public/products/${nameimage}${type}`;
            //Сохраняем файл
            await writeFile(path, buffer);

            console.log(Number(price))

            const userUpdate = await db.product.create({
                data: {
                    image: `${name}${type}`,
                    name: name,
                    price: Number(price),
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                    weight: Number(weight),
                    description: description,
                    idCategory: Number(category),
                    status: Boolean(status),
                    idUser: session.user.id
                }
            })

            return NextResponse.json({success: true, message: "Продукт создан!", profile: userUpdate});

        }else{
            const userUpdate = await db.product.create({
                data: {
                    name: name,
                    price: Number(price),
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                    weight: Number(weight),
                    description: description,
                    idCategory: Number(category),
                    status: Boolean(status),
                    idUser: session.user.id
                }
            })

            return NextResponse.json({success: true, message: "Продукт создан!", profile: userUpdate});
        }
    


    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}



// export async function GET(req: NextRequest) {
//     try{
//         const session = await getServerSession(authOptions)
//         if(!session){
//             return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
//         }

//         const profile = await db.user.findUnique({
//             where: {
//                 id: session.user.id
//             }
//         })

//         return NextResponse.json({profile});


//     }catch(e){
//         return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
//     }
// }
