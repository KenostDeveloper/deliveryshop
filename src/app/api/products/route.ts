import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role != "SELLER") {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;
        const name = data.get("name") as string;
        const price = data.get("price") as string;
        const length = data.get("length") as string;
        const width = data.get("width") as string;
        const height = data.get("height") as string;
        const weight = data.get("weight") as string;
        const description = data.get("description") as string;
        const status = data.get("status") as string;
        const category = data.get("category") as string;
        const count = data.get("count") as string;

        if (
            !name ||
            !price ||
            !length ||
            !length ||
            !width ||
            !height ||
            !weight ||
            !description ||
            !status ||
            !category ||
            !count
        ) {
            return NextResponse.json({
                success: false,
                message: "Пожалуйста, заполните все поля!",
            });
        }

        let statusBool = true;

        if (status == "false") {
            statusBool = false;
        }

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            let type = "." + file.type.replace("image/", "");
            const nameimage = uuidv4();

            //Путь файла
            const path = `${process.cwd()}/public/products/${nameimage}${type}`;
            //Сохраняем файл
            await writeFile(path, buffer);

            console.log(Number(price));

            const userUpdate = await db.product.create({
                data: {
                    image: `${nameimage}${type}`,
                    name: name,
                    price: Number(price),
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                    weight: Number(weight),
                    description: description,
                    idCategory: Number(category),
                    status: statusBool,
                    idUser: session.user.id,
                    count: Number(count),
                },
            });

            return NextResponse.json({
                success: true,
                message: "Продукт создан!",
                product: userUpdate,
            });
        } else {
            const userUpdate = await db.product.create({
                data: {
                    name: name,
                    price: Number(price),
                    length: Number(length),
                    width: Number(width),
                    height: Number(height),
                    weight: Number(weight),
                    description: description,
                    idCategory: Number(category),
                    status: statusBool,
                    idUser: session.user.id,
                    count: Number(count),
                },
            });

            return NextResponse.json({
                success: true,
                message: "Продукт создан!",
                product: userUpdate,
            });
        }
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}

export async function GET(req: NextRequest) {
    try {
        let id = req.nextUrl.searchParams.get("id") as string;
        let user_id = req.nextUrl.searchParams.get("user_id") as string;
        let category_id = req.nextUrl.searchParams.get("category_id") as string;

        let page = req.nextUrl.searchParams.get("page") as string;
        let limit = req.nextUrl.searchParams.get("limit") as string;
        let tag = req.nextUrl.searchParams.get("tag") as string;

        let getPage = Number(page) || 1;
        let getLimit = Number(limit) || 9;
        let offset = getPage * getLimit - getLimit;

        if (user_id) {
            const session = await getServerSession(authOptions);

            const count = await db.product.count();
            const product = await db.product.findMany({
                where: {
                    idUser: session?.user.id,
                },
                take: getLimit,
                skip: offset,
            });

            return NextResponse.json({ count, product });
        }

        if (category_id) {
            if (category_id == "all") {
                const count = await db.product.count();
                const product = await db.product.findMany();

                return NextResponse.json({ count, product });
            }

            const count = await db.product.count({
                where: {
                    idCategory: Number(category_id),
                },
            });

            const product = await db.product.findMany({
                where: {
                    idCategory: Number(category_id),
                },
            });

            return NextResponse.json({ count, product });
        } else {
            if (!id) {
                const count = await db.product.count();

                const product = await db.product.findMany({
                    take: getLimit,
                    skip: offset,
                });

                return NextResponse.json({ count, product });
            } else {
                const product = await db.product.findUnique({
                    where: {
                        id: Number(id),
                    },
                });

                return NextResponse.json({ product });
            }
        }
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role != "SELLER") {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        const data = await req.formData();
        const id = data.get("id") as string;
        const name = data.get("name") as string;
        const price = data.get("price") as string;
        const length = data.get("length") as string;
        const width = data.get("width") as string;
        const height = data.get("height") as string;
        const weight = data.get("weight") as string;
        const description = data.get("description") as string;
        const status = data.get("status") as string;
        const category = data.get("category") as string;
        const count = data.get("count") as string;

        if (
            !name ||
            !price ||
            !length ||
            !length ||
            !width ||
            !height ||
            !weight ||
            !description ||
            !status ||
            !category ||
            !count
        ) {
            return NextResponse.json({
                success: false,
                message: "Пожалуйста, заполните все поля!",
            });
        }

        let statusBool = true;

        if (status == "false") {
            statusBool = false;
        }

        const productUpdate = await db.product.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name,
                price: Number(price),
                length: Number(length),
                width: Number(width),
                height: Number(height),
                weight: Number(weight),
                description: description,
                idCategory: Number(category),
                status: statusBool,
                count: Number(count),
            },
        });

        return NextResponse.json({ success: true, message: "Продукт обновлён!" });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role != "SELLER") {
            return NextResponse.json({
                success: false,
                message: "У вас нет доступа к данной функции!",
            });
        }

        let id = req.nextUrl.searchParams.get("id") as string;

        const product = await db.product.findUnique({
            where: {
                id: Number(id),
                idUser: session.user.id,
            },
        });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Вы не можете удалить не свой продукт!",
            });
        }

        const sellerCityProduct = await db.sellerCityProducts.deleteMany({
            where: {
                idProduct: Number(id),
            },
        });

        const productDelete = await db.product.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({ success: true, message: "Продукт удалён!" });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: "Произошла неизвестная ошибка, попробуйте снова :(",
            e,
        });
    }
}
