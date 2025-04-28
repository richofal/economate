"use client";

import React, { useState } from "react";
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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Product {
    id: number;
    name: string;
    code: string;
}

interface ErrorBag {
    product_id?: string[];
    billing_cycle?: string[];
    price?: string[];
    term_months?: string[];
}
interface BillingCycle {
    value: string;
    label: string;
}

interface CreateProductPricePageProps extends PageProps {
    errors: ErrorBag;
    product: Product;
    canCreateProductPrice: boolean;
    availableBillingCycles: BillingCycle[];
}

// Create schema for form validation
const formSchema = z.object({
    product_id: z.number(),
    billing_cycle: z.string().min(1, { message: "Billing cycle is required" }),
    price: z.string().min(1, { message: "Price is required" }),
    term_months: z.string().min(1, { message: "Term length is required" }),
});

export default function ProductPricesCreate() {
    const { product, canCreateProductPrice, availableBillingCycles, errors } =
        usePage<CreateProductPricePageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product_id: product.id,
            billing_cycle: "",
            price: "",
            term_months: "",
        },
    });

    // Handle form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        router.post(
            route("products.productPrices.store", { product: product.id }),
            values,
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    // Check for permission
    if (!canCreateProductPrice) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <Alert variant="destructive">
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>
                            You don't have permission to create product prices.
                        </AlertDescription>
                    </Alert>
                </div>
            </AuthenticatedLayout>
        );
    }
    if (availableBillingCycles.length === 0) {
        return (
            <AuthenticatedLayout>
                <Head title={`Add Price Plan for ${product.name}`} />
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
                                    <BreadcrumbLink
                                        href={route("products.index")}
                                    >
                                        Products
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route(
                                            "products.show",
                                            product.id
                                        )}
                                    >
                                        {product.name}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
                                        Add Price Plan
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <Button variant="outline" asChild>
                            <Link href={route("products.show", product.id)}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Product
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Price Plan</CardTitle>
                            <CardDescription>
                                Create a new pricing plan for {product.name} (
                                {product.code})
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertTitle>
                                    No Available Billing Cycles
                                </AlertTitle>
                                <AlertDescription>
                                    This product already has price plans for all
                                    available billing cycles. You can edit
                                    existing price plans instead of creating new
                                    ones.
                                </AlertDescription>
                            </Alert>
                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route(
                                            "products.show",
                                            product.id
                                        )}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back to Product
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Add Price Plan for ${product.name}`} />

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
                                <BreadcrumbLink
                                    href={route("products.show", product.id)}
                                >
                                    {product.name}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Add Price Plan</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Price Plan</CardTitle>
                        <CardDescription>
                            Create a new pricing plan for {product.name} (
                            {product.code})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <input
                                    type="hidden"
                                    name="product_id"
                                    value={product.id}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="billing_cycle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Billing Cycle
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select billing cycle" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableBillingCycles.map(
                                                            (cycle) => (
                                                                <SelectItem
                                                                    key={
                                                                        cycle.value
                                                                    }
                                                                    value={
                                                                        cycle.value
                                                                    }
                                                                >
                                                                    {
                                                                        cycle.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    How often the customer will
                                                    be billed for this product.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="term_months"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Term Length (Months)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="1"
                                                        placeholder="e.g. 12"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The contract length in
                                                    months.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The total price for the
                                                    selected billing cycle.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Display validation errors if any */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertTitle>
                                            Validation Error
                                        </AlertTitle>
                                        <AlertDescription>
                                            Please correct the errors and try
                                            again.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting
                                            ? "Creating..."
                                            : "Create Price Plan"}
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
