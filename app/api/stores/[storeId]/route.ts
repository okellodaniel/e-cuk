import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params }: { params: { storeId: string } }) {
    try {

        const { userId } = auth();

        const body = await req.json();

        const { name } = body;

        const storeId = params.storeId;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!storeId) {
            return new NextResponse("StoreId is required", { status: 400 });
        }

        const updatedStore = await prismadb?.store.updateMany(
            {
                where: {
                    id: params.storeId,
                    userId: userId
                },
                data: {
                    name: name
                }
            }
        );

        return NextResponse.json(updatedStore);

    } catch (error) {
        console.log('STORE_PATCH', error);

        console.log(error);


        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        if (!params.storeId) return new NextResponse("StoreId is required", { status: 400 });

        const deletedStore = await prismadb.store.deleteMany(
            {
                where: {
                    id: params.storeId,
                    userId: userId
                }
            });

        return NextResponse.json(deletedStore);

    } catch (error) {
        console.log('STORE_DELETE', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
