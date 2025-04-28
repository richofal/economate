"use client";

import { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ChevronLeft, Save } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CategoryCollection, PageProps, Product } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ErrorBag {
    name?: string[];
    description?: string[];
    category_id?: string[];
    code?: string[];
    setup_fee?: string[];
    bandwidth?: string[];
    bandwidth_type?: string[];
    connection_type?: string[];
    minimum_contract_months?: string[];
    is_recurring?: string[];
    is_active?: string[];
    uptime_guarantee?: string[];
    is_featured?: string[];
}

interface EditProductPageProps extends PageProps {
    errors: ErrorBag;
    categories: CategoryCollection;
    product: Product;
    canEditProduct: boolean;
}

// Create schema for form validation
const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Product name must be at least 2 characters.",
        })
        .max(100, {
            message: "Product name must not exceed 100 characters.",
        }),
    description: z
        .string()
        .max(1000, {
            message: "Description must not exceed 1000 characters.",
        })
        .optional(),
    category_id: z.string().min(1, { message: "Category is required" }),
    code: z
        .string()
        .min(1, { message: "Product code is required" })
        .max(50, { message: "Product code must not exceed 50 characters" }),
    setup_fee: z.string().min(1, { message: "Setup fee is required" }),
    bandwidth: z.string().min(1, { message: "Bandwidth is required" }),
    bandwidth_type: z
        .string()
        .min(1, { message: "Bandwidth type is required" }),
    connection_type: z
        .string()
        .min(1, { message: "Connection type is required" }),
    minimum_contract_months: z
        .string()
        .min(1, { message: "Minimum contract months is required" }),
    is_recurring: z.boolean(),
    is_active: z.boolean(),
    uptime_guarantee: z
        .string()
        .min(1, { message: "Uptime guarantee is required" }),
    is_featured: z.boolean(),
});

export default function ProductsEdit() {
    const { categories, product, canEditProduct } =
        usePage<EditProductPageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category_id: "",
            code: "",
            setup_fee: "",
            bandwidth: "",
            bandwidth_type: "",
            connection_type: "",
            minimum_contract_months: "",
            is_recurring: false,
            is_active: true,
            uptime_guarantee: "",
            is_featured: false,
        },
    });

    // Populate form with product data when component mounts
    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description || "",
                category_id: product.category?.id.toString() || "",
                code: product.code,
                setup_fee: product.setup_fee.toString(),
                bandwidth: product.bandwidth.toString(),
                bandwidth_type: product.bandwidth_type,
                connection_type: product.connection_type,
                minimum_contract_months:
                    product.minimum_contract_months.toString(),
                is_recurring: product.is_recurring,
                is_active: product.is_active,
                uptime_guarantee: product.uptime_guarantee.toString(),
                is_featured: product.is_featured,
            });
        }
    }, [product, form]);

    // Handle form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        router.put(route("products.update", product.id), values, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    // Check for permission
    if (!canEditProduct) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <Alert variant="destructive">
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>
                            You don't have permission to edit products.
                        </AlertDescription>
                    </Alert>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Product: ${product.name}`} />

            <div className="container mx-auto py-6 space-y-6">
                {/* Breadcrumb */}
                <div className="flex justify-between items-center">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={route("dashboard")}>
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={route("products.index")}>
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Edit</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <Button variant="outline" asChild>
                        <Link href={route("products.index")}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Product: {product.name}</CardTitle>
                        <CardDescription>
                            Update the details of this product.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Product Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter product name"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The name of the product as
                                                    it will be displayed to
                                                    customers.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Product Code
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. PROD-001"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    A unique identifier for this
                                                    product.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value || ""}
                                                    defaultValue={product?.category?.id.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories &&
                                                        categories.data &&
                                                        categories.data.length >
                                                            0 ? (
                                                            categories.data.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        value={category.id.toString()}
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        ) : (
                                                            <SelectItem
                                                                value=""
                                                                disabled
                                                            >
                                                                No categories
                                                                available
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    The category this product
                                                    belongs to.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="setup_fee"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Setup Fee</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="0.00"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    One-time setup fee for this
                                                    product.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bandwidth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bandwidth</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. 100"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The bandwidth amount for
                                                    this product.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bandwidth_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Bandwidth Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select bandwidth type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="mbps">
                                                            Mbps
                                                        </SelectItem>
                                                        <SelectItem value="gbps">
                                                            Gbps
                                                        </SelectItem>
                                                        <SelectItem value="tb">
                                                            TB
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Unit of measurement for
                                                    bandwidth.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="connection_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Connection Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select connection type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="fiber">
                                                            Fiber
                                                        </SelectItem>
                                                        <SelectItem value="wireless">
                                                            Wireless
                                                        </SelectItem>
                                                        <SelectItem value="copper">
                                                            Copper
                                                        </SelectItem>
                                                        <SelectItem value="satellite">
                                                            Satellite
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Type of network connection.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="minimum_contract_months"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Minimum Contract (Months)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="e.g. 12"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Minimum contract duration in
                                                    months.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="uptime_guarantee"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Uptime Guarantee (%)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. 99.9"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Guaranteed uptime
                                                    percentage.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter product description"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A detailed description of this
                                                product's features and benefits.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="is_recurring"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Recurring Payment
                                                    </FormLabel>
                                                    <FormDescription>
                                                        This product requires
                                                        recurring payments.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Active Product
                                                    </FormLabel>
                                                    <FormDescription>
                                                        This product is active
                                                        and available for sale.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Featured Product
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Highlight this product
                                                        in featured sections.
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting
                                            ? "Updating..."
                                            : "Update Product"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
