import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";

// export async function GET(req: NextRequest, res: NextResponse) {
//     try {
//         const session = await getServerSession(authOptions)
//         if(!session){
//             return NextResponse.json({success: false, message: "У вас нет доступа к данной функции!"});
//         }

//         const userRates = await db.productRating.findMany({
//             where: {
//                 idUser: session.user.id,
//             },
//         });

//         return NextResponse.json({ userRates });
//     } catch (e) {
//         return NextResponse.json({
//             success: false,
//             message: "Произошла неизвестная ошибка, попробуйте снова :(",
//             e,
//         });
//     }
// }

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const data = await req.json();

        const user_id = data.user_id;
        const product_id = data.product_id;
        const rate = data.rate;
        const advantages = data.advantages;
        const disAdvantages = data.disAdvantages;
        const comment = data.comment;

        if (!user_id || !product_id || !rate || !advantages || !disAdvantages || !comment) {
            return NextResponse.json({
                success: false,
                message: "Пожалуйста, заполните все поля!",
            });
        }

        const userRates = await db.productRating.create({
            data: {
                idUser: Number(user_id),
                idProduct: Number(product_id),
                rate: Number(rate),
                Dignities: advantages as string,
                Disadvantages: disAdvantages as string,
                Comment: comment as string,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Отзыв отправлен!",
            userRate: userRates,
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
