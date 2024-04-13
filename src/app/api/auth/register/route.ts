import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {hash} from "bcrypt";
import {schemaRegistr} from "@/validations/userSchema";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";


export async function POST(req: NextRequest){
    try{
        const body = await req.json()
        const {username, email, password, role} = body;

        const cookiesList = cookies()
        const isBasketNull = cookiesList.has('basket-quick-shop')

        const validationResult = schemaRegistr.safeParse({username, email, password, confirmPassword: password})
        if(!validationResult.success){
            return NextResponse.json({success: false, message: "Некорректные данные"}, {status: 404})
        }

        //Проверка существует ли пользователь с таким email?
        const checkUserUsername = await db.user.findUnique({
            where: {username: username}
        });

        if(checkUserUsername){
            return NextResponse.json({success: false, message: "Пользователь с таким логином уже существует"}, {status: 409})
        }

        //Проверка существует ли пользователь с таким email?
        const checkUser = await db.user.findUnique({
            where: {email: email}
        });

        //Хешируем пароль
        const hashPassword = await hash(password, 10)

        if(checkUser){
            return NextResponse.json({success: false, message: "Пользователь с таким email уже существует"}, {status: 409})
        }else{
            const newUser = await db.user.create({
                data: {
                    username: username,
                    email: email,
                    role: role
                }
            });

            const newAccount = await db.account.create({
                data: {
                    userId: newUser.id,
                    provider: "credentials",
                    password: hashPassword
                }
            });

            if(isBasketNull){
                const token = cookiesList.get('basket-quick-shop');

                const getToken = await db.basketToken.findFirst({
                    where: {
                        token: token?.value
                    }
                })

                if(getToken){
                    const BasketToken = await db.basketToken.update({
                        where: {
                            id: getToken?.id
                        },
                        data: {
                            idUser: newUser.id
                        }
                    })
                }
            }

            return NextResponse.json({success: true, newAccount})
        }

    }catch (e:any){
        return NextResponse.json({success: false, message: "Что-то пошло не так...", e: e.message}, {status: 200})
    }

}
