import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {

        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 });

        const product = await prismadb.product.findUnique(
            {
                where: {
                    id: params.productId,
                },
                include: {
                    images: true,
                    category: true,
                    color: true,
                    size: true
                }
            });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, productId: string } }) {
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
        if (!params.productId) return new NextResponse("product ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        await prismadb?.product.update(
            {
                where: {
                    id: params.productId,
                },
                data: {
                    name: name,
                    categoryId: categoryId,
                    sizeId: sizeId,
                    colorId: colorId,
                    price: price,
                    images: {
                        deleteMany: {}
                    },
                    isFeatured: isFeatured,
                    isArchived: isArchived
                }
            }
        );

        const updatedproduct = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(updatedproduct);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);

        console.log(error);

        return new NextResponse('Internal Error', { status: 500 });
    }
};

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {

        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorised", { status: 401 });

        if (!params.productId) return new NextResponse("product ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const deletedproduct = await prismadb.product.delete(
            {
                where: {
                    id: params.productId,
                }
            });

        return NextResponse.json(deletedproduct);

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};
