import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {

        if (!params.colorId) return new NextResponse("ColorId is required", { status: 400 });

        const color = await prismadb.color.findUnique(
            {
                where: {
                    id: params.colorId,
                }
            });

        return NextResponse.json(color);

    } catch (error) {
        console.log('COLOR_GET', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, colorId: string } }) {
    try {

        const { userId } = auth();

        const body = await req.json();

        const { name, value } = body;

        const storeId = params.storeId;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!name) {
            return new NextResponse("The color name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("The color value is required", { status: 400 });
        }

        if (!params.colorId) return new NextResponse("The colorId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const updatedSize = await prismadb?.color.updateMany(
            {
                where: {
                    id: params.colorId,
                },
                data: {
                    name,
                    value
                }
            }
        );

        return NextResponse.json(updatedSize);

    } catch (error) {
        console.log('COLOR_PATCH', error);

        console.log(error);


        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params }: { params: { colorId: string, storeId: string } }) {
    try {

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        if (!params.colorId) return new NextResponse("The sizeId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const deletedColor = await prismadb.color.delete(
            {
                where: {
                    id: params.colorId,
                }
            });

        return NextResponse.json(deletedColor);

    } catch (error) {
        console.log('COLOR_DELETE', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
