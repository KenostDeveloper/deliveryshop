import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try{
        const transport = await db.transport.findMany()
        return NextResponse.json({transport});
        
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
