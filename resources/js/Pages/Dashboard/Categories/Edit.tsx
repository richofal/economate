"use client";

import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ChevronLeft, Save } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Category, PageProps } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ErrorBag {
    name?: string[];
    description?: string[];
}

interface EditCategoryPageProps extends PageProps {
    category: Category;
    errors: ErrorBag;
}

// Create schema for form validation
const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Category name must be at least 2 characters.",
        })
        .max(50, {
            message: "Category name must not exceed 50 characters.",
        }),
    description: z
        .string()
        .max(500, {
            message: "Description must not exceed 500 characters.",
        })
        .optional(),
});

export default function CategoriesEdit() {
    const { category, errors } = usePage<EditCategoryPageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category.name,
            description: category.description || "",
        },
    });

    // Handle form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        router.patch(
            route("categories.update", { category: category.id }),
            values,
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Category: ${category.name}`} />

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
                                    href={route("categories.index")}
                                >
                                    Categories
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Edit</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <Button variant="outline" asChild>
                        <Link href={route("categories.index")}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Categories
                        </Link>
                    </Button>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Category</CardTitle>
                        <CardDescription>
                            Update details for category: {category.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter category name"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This name will be displayed to
                                                users. If you change the name, a
                                                new slug will be automatically
                                                generated.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Enter category description (optional)"
                                                    rows={4}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A brief description of this
                                                category.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.visit(
                                                route("categories.index")
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
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
