import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();        

        const forgotPassword = await db.forgotPassword.findFirst({
            where: {
                token: body.token,
            },
        });

        if (!forgotPassword) {
            return NextResponse.json(
                { success: false, message: "Ссылка недействительна" },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова",
            error: e.message,
        }, { status: 500 });
    }
}
