import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            images,
            colorId,
            categoryId,
            sizeId,
            isFeatured,
            isArchived,
            price
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
        if (!name) {
            return new NextResponse("The name is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("The colorId is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("The colorId is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("The categoryId is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("The sizeId is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("The images is required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                colorId,
                categoryId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal server error", { status: 500 })
    }
};

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured") || undefined;

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });


        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                color: true,
                category: true,
                size: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal server error", { status: 500 })
    }
};

