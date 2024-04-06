import jwt from "jsonwebtoken";
import IUser from "@/helps/interfaces";

export const generateJwt = (user: IUser) => {
    return jwt.sign(
        {id: user.id, username: user.username, email: user.email, role: user.role},
        process.env.SECRET_KET!,
        {expiresIn: 60*60*24*7} //Действует 7 дней
    )
}