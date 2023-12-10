"use client";

import * as z from "zod";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
});

type SizesFormValues = z.infer<typeof formSchema>;


interface SizesFormProps {
    initialData: Size | null
}


const SizesForm: React.FC<SizesFormProps> = ({ initialData }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const params = useParams();
    const router = useRouter();

    const form = useForm<SizesFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const title = initialData ? "Edit size" : "Create a size";
    const description = initialData ? "Edit the size" : "Add a new size";
    const toastMessage = initialData ? "Size updated successfully" : "Size created successfully";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (data: SizesFormValues) => {
        try {
            setLoading(true);

            if (initialData) {

                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            }
            else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            toast.success(toastMessage);
            router.push(`/${params.storeId}/sizes`);

        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };


    const onDelete = async () => {
        try {

            setLoading(true);

            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

            router.refresh();
            toast.success("Size deleted.");

            router.push(`/${params.storeId}/sizes`);

        } catch (error) {
            toast.error("Make sure to remove all Products using this size.");
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
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />

                {initialData && (

                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Product size name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Value
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Product size value" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
            <Separator />
        </>
    );
};

export default SizesForm;