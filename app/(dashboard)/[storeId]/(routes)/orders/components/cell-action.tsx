"use client";

import { OrderColumn } from './columns';
import { AlertModal } from '@/components/modals/alert-modal';


import toast from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

interface CellActionProps {
    data: OrderColumn
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [isOpen, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("OrderId copied to clipboard");
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
            router.refresh();
            router.push(`/${params.storeId}/orders/`);
            toast.success("Order deleted.");
        } catch (error) {
            toast.error("Make sure to remove all categories using this order.");
            console.log(error);
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <AlertModal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
        </>
    )
};