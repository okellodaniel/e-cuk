import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const BillboardPage = async ({
    params }: { params: { billboardId: string } }
) => {

    const billboard = await prismadb.billboard.findUnique(
        {
            where: {
                id: params.billboardId
            }
        });
    return (
        <>
            <div>
                <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <ProductForm initialData={billboard}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillboardPage;