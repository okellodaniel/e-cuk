import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const billboard = await prismadb.billboard.findUnique(
            {
                where: {
                    id: params.billboardId,
                }
            });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('BILLBOARD_GET', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, billboardId: string } }) {
    try {

        const { userId } = auth();

        const body = await req.json();

        const { label, imageUrl } = body;

        const storeId = params.storeId;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const updatedBillboard = await prismadb?.billboard.updateMany(
            {
                where: {
                    id: params.billboardId,
                },
                data: {
                    label: label,
                    imageUrl: imageUrl,
                }
            }
        );

        return NextResponse.json(updatedBillboard);

    } catch (error) {
        console.log('BILLBOARD_PATCH', error);

        console.log(error);


        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const deletedBillboard = await prismadb.billboard.deleteMany(
            {
                where: {
                    id: params.billboardId,
                }
            });

        return NextResponse.json(deletedBillboard);

    } catch (error) {
        console.log('BILLBOARD_DELETE', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
