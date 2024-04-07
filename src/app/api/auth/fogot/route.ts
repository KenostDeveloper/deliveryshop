import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { schemaRegistr } from "@/validations/userSchema";

import nodemailer from "nodemailer";
import { env } from "process";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const transporter = nodemailer.createTransport({
            service: "mail",
            host: "smtp.mail.ru",
            port: 465,
            auth: {
                user: env.EMAIL_LOGIN,
                pass: env.EMAIL_PASSWORD,
            },
        });

        // Генерация уникального ключа для восстановления пароля
        const hash_id = uuidv4();

        const info = await transporter.sendMail({
            from: env.EMAIL_LOGIN, // sender address
            to: body.email as string, // list of receivers "email1, email2"
            subject: "Восстановление пароля", // Subject line
            text: `Recover password`, // plain text body
            html: `Перейдите по <a href="http://127.0.0.1:3000/fogot/${hash_id}">ссылке</a>, чтобы восстановить пароль`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        const user = await db.user.findFirst({ where: { email: body.email } });
        if(user === null) {
            return NextResponse.json({ success: false, message: "Пользователь не найден" }, { status: 404 });
        }

        // Сохранения ключа в БД
        const forgotPasswordCreate = await db.forgotPassword.create({
            data: {
                token: hash_id,
                idUser: user.id,
            },
        });

        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, message: "Что-то пошло не так...", error: e.message },
            { status: 500 }
        );
    }
}
