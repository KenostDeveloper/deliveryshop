import {NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth/next"
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";


export async function GET(req: NextRequest) {
    try{
        const status = await db.orderStatus.findMany();

        return NextResponse.json({success: true, status});
    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
}
