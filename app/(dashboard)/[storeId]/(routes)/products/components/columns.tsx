"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { CellAction } from "./cell-action";


export type ProductColumn = {
    id: string;
    name: string;
    price: string;
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
