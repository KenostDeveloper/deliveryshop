import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
const fs = require('fs');
import { cookies } from 'next/headers'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest, res: NextResponse) {
    try{
        const session = await getServerSession(authOptions);

        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')

        if(!isBasketNull){
            return NextResponse.json({success: true});
        }else{
            cookies().delete({
                name: 'basket-quick-shop'
            })
            return NextResponse.json({success: true});
        }

    }catch(e){
        return NextResponse.json({success: false, message: "Произошла неизвестная ошибка, попробуйте снова :(", e});
    }
    
}
