import NextAuth from "next-auth";

declare module "next-auth"{
    interface User{
        id: number,
        username: string,
        role: string
    }

    interface Session{
        user: User & {
            id: number,
            username: string,
            role: string
        }
        token: {
            id: number,
            username: string,
            role: string
        }
    }
}