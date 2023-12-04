import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {

        if (!params.sizeId) return new NextResponse("SizeId is required", { status: 400 });

        const size = await prismadb.size.findUnique(
            {
                where: {
                    id: params.sizeId,
                }
            });

        return NextResponse.json(size);

    } catch (error) {
        console.log('SIZE_GET', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, sizeId: string } }) {
    try {

        const { userId } = auth();

        const body = await req.json();

        const { name, value } = body;

        const storeId = params.storeId;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!name) {
            return new NextResponse("The size name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("The size value is required", { status: 400 });
        }

        if (!params.sizeId) return new NextResponse("The sizeId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const updatedSize = await prismadb?.size.updateMany(
            {
                where: {
                    id: params.sizeId,
                },
                data: {
                    name,
                    value
                }
            }
        );

        return NextResponse.json(updatedSize);

    } catch (error) {
        console.log('SIZE_PATCH', error);

        console.log(error);


        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params }: { params: { sizeId: string, storeId: string } }) {
    try {

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        if (!params.sizeId) return new NextResponse("The sizeId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const deletedSize = await prismadb.size.delete(
            {
                where: {
                    id: params.sizeId,
                }
            });

        return NextResponse.json(deletedSize);

    } catch (error) {
        console.log('SIZE_DELETE', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
