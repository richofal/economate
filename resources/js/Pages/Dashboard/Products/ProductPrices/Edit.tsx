"use client";

import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ChevronLeft, Save, Clock } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
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
import { Badge } from "@/Components/ui/badge";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Product, ProductPrice } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ErrorBag {
    product_id?: string[];
    billing_cycle?: string[];
    price?: string[];
    term_months?: string[];
}

interface EditProductPricePageProps extends PageProps {
    errors: ErrorBag;
    product: Product;
    productPrice: ProductPrice;
    canEditProductPrice: boolean;
    billingCycleLabel: string;
    isDefaultPrice: boolean;
    formattedCreatedAt: string;
}

// Create schema for form validation
const formSchema = z.object({
    product_id: z.number(),
    billing_cycle: z.string().min(1, { message: "Billing cycle is required" }),
    price: z.string().min(1, { message: "Price is required" }),
    term_months: z.string().min(1, { message: "Term length is required" }),
});

export default function ProductPricesEdit() {
    const {
        product,
        productPrice,
        canEditProductPrice,
        billingCycleLabel,
        isDefaultPrice,
        formattedCreatedAt,
        errors,
    } = usePage<EditProductPricePageProps>().props;

    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log(productPrice.term_months);

    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product_id: product.id,
            billing_cycle: productPrice.billing_cycle,
            price: productPrice.price.toString(),
            term_months: productPrice.term_months.toString(),
        },
    });

    // Handle form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        router.put(
            route("products.productPrices.update", {
                product: product.id,
                productPrice: productPrice.id,
            }),
            values,
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    // Check for permission
    if (!canEditProductPrice) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <Alert variant="destructive">
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>
                            You don't have permission to edit product prices.
                        </AlertDescription>
                    </Alert>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Price Plan for ${product.name}`} />

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
                                <BreadcrumbLink>Edit Price Plan</BreadcrumbLink>
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

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                                <CardTitle>Edit Price Plan</CardTitle>
                                <CardDescription>
                                    Update pricing for {product.name} (
                                    {product.code})
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 px-3 py-1"
                            >
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {billingCycleLabel}
                            </Badge>
                        </div>
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
                                <input
                                    type="hidden"
                                    name="billing_cycle"
                                    value={productPrice.billing_cycle}
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
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={
                                                            billingCycleLabel
                                                        }
                                                        readOnly
                                                        disabled
                                                        className="bg-slate-50"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The billing cycle cannot be
                                                    changed once created.
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
                                                    The total price for the{" "}
                                                    {billingCycleLabel.toLowerCase()}{" "}
                                                    billing cycle.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {isDefaultPrice && (
                                    <Alert className="bg-amber-50 border-amber-200">
                                        <AlertTitle className="text-amber-800">
                                            Default Price Plan
                                        </AlertTitle>
                                        <AlertDescription className="text-amber-700">
                                            This is the only price plan for this
                                            product. Make sure to keep it
                                            active.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Display validation errors if any */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertTitle>
                                            Validation Error
                                        </AlertTitle>
                                        <AlertDescription>
                                            <div className="space-y-2 mt-2">
                                                {Object.entries(errors).map(
                                                    ([field, messages]) => (
                                                        <div
                                                            key={field}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                                                {field.replace(
                                                                    "_",
                                                                    " "
                                                                )}
                                                                :
                                                            </span>
                                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                                {Array.isArray(
                                                                    messages
                                                                ) &&
                                                                    messages.map(
                                                                        (
                                                                            message,
                                                                            i
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    i
                                                                                }
                                                                            >
                                                                                {
                                                                                    message
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                            </ul>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "products.show",
                                                    product.id
                                                )
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-slate-500 bg-slate-50 border-t">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Created: {formattedCreatedAt}</span>
                        </div>
                        <div>ID: {productPrice.id}</div>
                    </CardFooter>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
