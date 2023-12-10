"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { CellAction } from "./cell-action";


export type ProductColumn = {
    id: string;
    name: string;
    price: string;
    size: string;
    category: string;
    color: string;
    isFeatured: boolean;
    isArchived: boolean;
    createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [

    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.color}
                <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }}>
                </div>
            </div>
        )
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },

    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
