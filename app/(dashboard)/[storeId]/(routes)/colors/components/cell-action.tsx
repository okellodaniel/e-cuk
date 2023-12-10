"use client";

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColorColumn } from './columns';
import { AlertModal } from '@/components/modals/alert-modal';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

interface CellActionProps {
    data: ColorColumn
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ColorId copied to clipboard");
    };

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
            toast.success("Color deleted.");
            router.refresh();

        } catch (error) {
            toast.error("Make sure to remove all Products using this color.");
        }
        finally {
            setOpen(false);
            setLoading(false);
        }
    };


    return (
        <div>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='h-8 w-8 p-0'>
                        <span className="sr-only"> Open Menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)} >
                        <Copy className='mr-2 h-4 w-4' />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)} >
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    )
};