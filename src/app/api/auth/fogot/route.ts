import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {hash} from "bcrypt";
import {schemaRegistr} from "@/validations/userSchema";


export async function POST(req: NextRequest){
    try{
        const data = await req.formData()
        const mail = data.get('mail') as string

        

    }catch (e){
        return NextResponse.json({success: false, message: "Что-то пошло не так..."}, {status: 500})
    }

}