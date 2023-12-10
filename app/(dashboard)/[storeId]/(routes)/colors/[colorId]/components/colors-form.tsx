"use client";

import * as z from "zod";
import { Color } from "@prisma/client";
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
    value: z.string().min(4).regex(/^#/, { message: 'String must be a valid Hexcode' })
});

type ColorsFormValues = z.infer<typeof formSchema>;


interface ColorsFormProps {
    initialData: Color | null
}


const ColorsForm: React.FC<ColorsFormProps> = ({ initialData }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const params = useParams();
    const router = useRouter();

    const form = useForm<ColorsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const title = initialData ? "Edit color" : "Create a color";
    const description = initialData ? "Edit the color" : "Add a new color";
    const toastMessage = initialData ? "Color updated successfully" : "Color created successfully";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (data: ColorsFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data);
            }

            router.refresh();

            toast.success(toastMessage);

            router.push(`/${params.storeId}/colors`);


        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };


    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            toast.success("Color deleted.");
            router.refresh();

        } catch (error: any) {
            toast.error("Make sure to remove all Products using this color.");
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
                onConfirm={onConfirm}
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
                        color="sm"
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
                                            <Input disabled={loading} placeholder="Product color name" {...field} />
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
                                            <div className="flex items-center gap-x-4">
                                                <Input disabled={loading} placeholder="Product color value" {...field} />
                                                <div className="border p-4 rounded-full" style={{ backgroundColor: field.value }} />
                                            </div>
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

export default ColorsForm;