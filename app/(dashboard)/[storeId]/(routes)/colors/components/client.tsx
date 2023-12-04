"use client"
import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ColorColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ColorClientProps {
    data: ColorColumn[]
}

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {

    const router = useRouter();

    const params = useParams();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Colors (${data.length})`}
                    description="Manage Colors of your products"
                />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading title="API reference" description="Colors API reference" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}