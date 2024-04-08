import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const data = await req.json();

        const order_id = data.order_id;
        const message = data.message;

        const orderCancell = await db.orderCancells.create({
            data: {
                idUser: session.user.id,
                idOrder: order_id,
                message,
            },
        })

        return NextResponse.json({ success: true, message: "Успешно отменено!" });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
