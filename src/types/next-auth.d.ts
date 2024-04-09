import NextAuth from "next-auth";

declare module "next-auth"{
    interface User{
        id: number,
        username: string,
        role: string,
        idCity: number
    }

    interface Session{
        user: User & {
            id: number,
            username: string,
            role: string,
            idCity: number
        }
        token: {
            id: number,
            username: string,
            role: string,
            idCity: number
        }
    }
}