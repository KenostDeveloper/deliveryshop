import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const forgotPassword = await db.forgotPassword.findFirst({
            where: {
                token: body.token,
            },
        });

        const account = await db.account.findFirst({
            where: {
                userId: forgotPassword?.idUser,
            },
        });

        // Обновление пароля пользователя
        const accountUpdated = await db.account.update({
            where: {
                id: account?.id,
            },
            data: {
                password: await hash(body.password, 10),
            },
        });

        // Удаление токена на восстановление пароля
        await db.forgotPassword.delete({
            where: {
                id: forgotPassword?.id,
            },
        });

        return NextResponse.json(
            { success: true, message: "Пароль успешно изменен" },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { success: false, message: "Произошла неизвестная ошибка, попробуйте снова", error: e },
            { status: 500 }
        );
    }
}
