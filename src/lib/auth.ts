import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {db} from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import {z} from "zod";
import {compare} from "bcrypt";
import TwitchProvider from "next-auth/providers/twitch";
import VkProvider from "next-auth/providers/vk"
import DiscordProvider from "next-auth/providers/discord"
import type { NextAuthOptions } from "next-auth"
import {NextResponse} from "next/server";
import {adapter} from "next/dist/server/web/adapter";
import YandexProvider from "next-auth/providers/yandex";

import { cookies } from "next/headers"
import { encode, decode } from "next-auth/jwt"

import { v4 as uuidv4 } from 'uuid';
import {User} from "@prisma/client";

// @ts-ignore
export const authOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'database',
        maxAge: 7 * 24 * 60 * 60, // 7 days - 7 * 24 * 60 * 60
        updateAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET!,
    pages: {
        signIn: '/?modalRegister=true',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                usernameOrEmail: {label: "Email", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any, req){

                const schemaLoginValid = z.object({
                    usernameOrEmail: z.string().min(5, "Длина должна быть не менее 5 символов"),
                    password: z.string().min(5, "Длина пароля должна быть от 5 до 50 символов").max(50, "Длина пароля должна быть от 5 до 50 символов")
                })

                const parsedInput = schemaLoginValid.safeParse(credentials)

                if(!parsedInput.success){
                    throw new Error("Вы ввели некореектные данные")
                }

                //Проверка существует ли пользователь с таким email?
                const checkUserEmail = await db.user.findUnique({
                    where: {email: credentials.usernameOrEmail}
                });

                //Если пользователь с введённый email найден, проверяем пароль
                if(checkUserEmail){
                    const checkUserEmailAccount = await db.account.findMany({
                        where: {userId: checkUserEmail.id, provider: "credentials"}
                    });

                    if(checkUserEmailAccount.length == 0){
                        throw new Error("Неверный логин или пароль")
                    }

                    let comparePassword = await compare(credentials.password, `${checkUserEmailAccount[0].password}`)
                    if(!comparePassword){
                        throw new Error("Неверный логин или пароль")
                    }

                    //Проверка подтверждена ли почта
                    return {
                        id: checkUserEmail.id,
                        name: checkUserEmail.name,
                        email: checkUserEmail.email,
                        image: checkUserEmail.image,
                        username: `${checkUserEmail.username}`,
                        role: checkUserEmail.role
                    }
                }

                //Проверка существует ли пользователь с таким username?
                const checkUserUsername = await db.user.findUnique({
                    where: {username: credentials.usernameOrEmail}
                });

                //Если пользователь с введённый username найден, проверяем пароль
                if(checkUserUsername){
                    const checkUserUsernameAccount = await db.account.findMany({
                        where: {userId: checkUserUsername.id, provider: "credentials"}
                    });

                    if(checkUserUsernameAccount.length == 0){
                        throw new Error("Неверный логин или пароль")
                    }

                    let comparePassword = await compare(credentials.password, `${checkUserUsernameAccount[0].password}`)
                    if(!comparePassword){
                        throw new Error("Неверный логин или пароль")
                    }

                    const getToken = await db.basketToken.findFirst({
                        where: {
                            idUser: checkUserUsername.id
                        }
                    })

                    if(getToken){
                        let time = 24*60*60*30*1000;
                        const maxAgeCokies = new Date(Date.now() + time);
    
                        cookies().set({
                            name: 'basket-quick-shop',
                            value: getToken?.token,
                            httpOnly: true,
                            expires: maxAgeCokies,
                            path: '/',
                        })
                    }

                    return {
                        id: checkUserUsername.id,
                        name: checkUserUsername.name,
                        email: checkUserUsername.email,
                        image: checkUserUsername.image,
                        username: `${checkUserUsername.username}`,
                        role: checkUserUsername.role
                    }
                }else{
                    throw new Error("Неверный логин или пароль")
                }

                return null
            }
        }),
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        })
    ],
    events: {
        async linkAccount({user}){
            //Верификация email, если заходишь через соц сеть
            await db.user.update({
                where: {id: user.id},
                data: {
                    emailVerified: new Date()
                }
            })

            //Задаём username
            try{
                if(user.username == null){
                    const isUsername = await db.user.findUnique({
                        where: {username: `${user.name}`}
                    })

                    if(isUsername){
                        await db.user.update({
                            where: {id: user.id},
                            data: {
                                username: "user" + (new Date()).getTime()
                            }
                        })
                    }else {
                        await db.user.update({
                            where: {id: user.id},
                            data: {
                                username: user.name
                            }
                        })
                    }
                }
            }catch (e){

            }



        }
    },
    callbacks: {
        async session({session, user}){
            session.user = user
            return session
        },

        async signIn({ user, account, profile, email, credentials }){
            //Авторизация через email
            if(account?.provider == "credentials"){

                //Проверка подтвержденна ли почта
                // const getUser = await db.user.findUnique({
                //     where: {id: user.id}
                // })
                // if(getUser?.emailVerified == null){
                //     throw new Error("Пожалуйста, подтвердите вашу почту, письмо с подтверждением повторно отправленно на ваш email")
                // }



                const sessionToken = uuidv4();
                const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) //7 * 24 * 60 * 60 * 1000

                await db.session.create({
                    data: {
                        sessionToken: sessionToken,
                        userId: user.id,
                        expires: sessionExpiry,
                    },
                })

                const AuthCookies = cookies()
                AuthCookies.set({
                    name: "next-auth.session-token",
                    value: sessionToken,
                    expires: sessionExpiry,
                    httpOnly: true,
                    secure: true
                })


            }else {
                // console.log("Авторизация через соц.сети")
            }

            return true;
        }

    },
    jwt: {
        async encode({token, secret, maxAge, }) {
            // console.log("encode")
            return ""
        },
        async decode({token, secret}) {
            // console.log("decode")
            return null;
        },
    },

} satisfies NextAuthOptions
