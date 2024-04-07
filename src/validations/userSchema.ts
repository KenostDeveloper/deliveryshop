import {z} from "zod";

export const schemaRegistr = z.object({
    username: z.string().min(5, "Длина логина должна быть от 5 до 30 символов").max(30, "Длина логина должна быть от 5 до 30 символов"),
    email: z.string().email("Пожалуйста, введите корректный email-адрес"),
    password: z.string().min(5, "Длина пароля должна быть от 5 до 50 символов").max(50, "Длина пароля должна быть от 5 до 50 символов"),
    confirmPassword: z.string().min(5, "Длина пароля должна быть от 5 до 50 символов").max(50, "Длина пароля должна быть от 5 до 50 символов")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"], // path of error
});

export const schemaLogin = z.object({
    usernameOrEmail: z.string().min(5, "Длина должна быть не менее 5 символов"),
    password: z.string().min(5, "Длина пароля должна быть от 5 до 50 символов").max(50, "Длина пароля должна быть от 5 до 50 символов")
});

export const schemaFogotPassword = z.object({
    email: z.string().email("Пожалуйста, введите корректный email-адрес"),
});