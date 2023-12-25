import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { getTotalProducts } from "@/actions/get-total-products";
import Overview from "@/components/overview";

interface DashBoardPageProps {
    params: { storeId: string }
};

const DashboardPage: React.FC<DashBoardPageProps> = async ({ params }) => {

    const totalRevenue = await getTotalRevenue(params.storeId);
    const totalSales = await getTotalSales(params.storeId);
    const totalProducts = await getTotalProducts(params.storeId);

    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between sapce-y-6">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between sapce-y-6">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalSales}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between sapce-y-6">
                            <CardTitle className="text-sm font-medium">
                                Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalProducts}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={[]} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;