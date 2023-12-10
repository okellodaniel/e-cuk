"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown } from "lucide-react";
import { CellAction } from "./cell-action";

export type OrderColumn = {
    id: string;
    isPaid: boolean;
    phone: string;
    address: string;
    createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [

    {
        accessorKey: "label",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Label
                    <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
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
