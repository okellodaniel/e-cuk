import prismadb from "@/lib/prismadb";
import CategoriesForm from "./components/categories-form";

const CategoryPage = async ({
    params }: { params: { categoryId: string, storeId: string } }
) => {

    const category = await prismadb.category.findUnique(
        {
            where: {
                id: params.categoryId
            },
            include: {
                billboard: true
            }
        });

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <>
            <div>
                <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <CategoriesForm initialData={category} billboards={billboards} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryPage;