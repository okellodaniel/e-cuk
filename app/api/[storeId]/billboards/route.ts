import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!label) {
            return new NextResponse("The label is required", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("The image url is required", { status: 400 });
        }

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        // Check if user has permissions to edit the store's billboard.
        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const billboard = await prismadb.billboard.create({
            data: {
                label: label,
                imageUrl: imageUrl,
                storeId: params.storeId
            }
        });

        console.log(billboard.id);


        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {


        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });


        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);
    } catch (error) {
        console.log('[BILLBOARDS_GET]', error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}

