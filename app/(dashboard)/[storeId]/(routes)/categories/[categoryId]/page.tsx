import prismadb from "@/lib/prismadb";


const CategoryPage = async ({
    params }: { params: { categoryId: string } }
) => {

    const category = await prismadb.category.findUnique(
        {
            where: {
                id: params.categoryId
            }
        });
    return (
        <>
            <div>
                <div className="flex-col">
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <categoriesForm initialData={category}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryPage;