import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

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

        const userUpdated = await db.user.update({
            where: {
                id: session?.user?.id,
            },
            data: {
                deliveryCost: Number(data.deliverySityUser.cost),
                deliveryTime: Number(data.deliverySityUser.time)
            }
        });

        return NextResponse.json({ success: true, message: "Настройки доставки изменены!", user: userUpdated });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
