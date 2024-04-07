import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { schemaRegistr } from "@/validations/userSchema";

import nodemailer from "nodemailer";
import { env } from "process";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const mail = data.get("mail") as string;

        const transporter = nodemailer.createTransport({
            service: "mail",
            host: "smtp.mail.ru",
            port: 465,
            auth: {
                user: env.EMAIL_LOGIN,
                pass: env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: env.EMAIL_LOGIN, // sender address
            to: mail, // list of receivers "email1, email2"
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

        return NextResponse.json({ success: true, message: "Успешно" }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, message: "Что-то пошло не так...", error: e.message },
            { status: 500 }
        );
    }
}
