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
    totalPrice: string;
    products: string;
    createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [

    {
        accessorKey: "products",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        accessorKey: "totalPrice",
        header: "Total Price",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
