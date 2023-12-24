import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface DashBoardPageProps {
    params: { storeId: string }
};

const DashboardPage: React.FC<DashBoardPageProps> = async ({ params }) => {

    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
            </div>
        </div>
    );
}

export default DashboardPage;