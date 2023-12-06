"use client";

import * as z from "zod";
import { Billboard, Category } from "@prisma/client";
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
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";


const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});

type CategoriesFormValues = z.infer<typeof formSchema>;

interface CategoriesFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({ initialData, billboards }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const params = useParams();
    const router = useRouter();

    const form = useForm<CategoriesFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });

    const title = initialData ? "Edit category" : "Create category";
    const description = initialData ? "Edit the category" : "Add a new category";
    const toastMessage = initialData ? "category updated successfully" : "category created successfully";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (data: CategoriesFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);

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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            toast.success("category deleted.");
        } catch (error) {
            toast.error("Make sure to remove all products using this category first.");
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
                                            <Input disabled={loading} placeholder="Category name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={
                                ({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Billboard
                                        </FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a billboard"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    billboards.map((billboard) => (
                                                        <SelectItem
                                                            value={billboard.id}
                                                            key={billboard.id}
                                                        >
                                                            {billboard.label}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>

                                        </Select>
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

export default CategoriesForm;