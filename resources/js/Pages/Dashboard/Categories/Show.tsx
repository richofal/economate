"use client";

import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    Pencil,
    Tag,
    Calendar,
    Hash,
    FileText,
    ArrowUpDown,
    Package,
    Search,
    ChevronDown,
    PlusCircle,
    Clock,
    DollarSign,
} from "lucide-react";

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Category, Product, PageProps } from "@/types";

interface ProductPrice {
    id: number;
    price: number;
    price_type: string;
    effective_date: string;
    formatted_price?: string;
    formatted_date?: string;
}

interface ShowCategoryPageProps extends PageProps {
    category: Category & {
        products: Product[];
        created_at_formatted: string;
        updated_at_formatted: string;
    };
}

export default function CategoriesShow() {
    const { category, canEditCategory = false } =
        usePage<ShowCategoryPageProps>().props;
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("details");
    const [expandedProducts, setExpandedProducts] = useState<Set<number>>(
        new Set()
    );

    // Function to toggle product expansion
    const toggleProductExpansion = (productId: number) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedProducts(newExpanded);
    };

    // Filter products based on search term
    const filteredProducts = category.products.filter((product) => {
        if (!productSearchTerm) return true;

        const searchLower = productSearchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchLower) ||
            (product.description || "").toLowerCase().includes(searchLower)
        );
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Category: ${category.name}`} />

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
                                <BreadcrumbLink>{category.name}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route("categories.index")}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Categories
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Page Title */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {category.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {category.description || "No description provided."}
                    </p>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <TabsList>
                        <TabsTrigger value="details">
                            Category Details
                        </TabsTrigger>
                        <TabsTrigger value="products">
                            Products
                            <Badge variant="secondary" className="ml-2">
                                {category.products.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    {/* Category Details Tab */}
                    <TabsContent value="details" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Information</CardTitle>
                                <CardDescription>
                                    Detailed information about this category
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <Hash className="mr-2 h-4 w-4" />
                                                ID
                                            </h3>
                                            <p className="mt-1">
                                                {category.id}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <Tag className="mr-2 h-4 w-4" />
                                                Name
                                            </h3>
                                            <p className="mt-1">
                                                {category.name}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Slug
                                            </h3>
                                            <p className="mt-1">
                                                {category.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Created At
                                            </h3>
                                            <p className="mt-1">
                                                {category.created_at_formatted}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Last Updated
                                            </h3>
                                            <p className="mt-1">
                                                {category.updated_at_formatted}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                                                <Package className="mr-2 h-4 w-4" />
                                                Product Count
                                            </h3>
                                            <p className="mt-1">
                                                {category.products.length}{" "}
                                                products
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {category.description && (
                                    <div className="pt-4 border-t">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Description
                                        </h3>
                                        <p className="text-sm whitespace-pre-line">
                                            {category.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products in this Category</CardTitle>
                                <CardDescription>
                                    {category.products.length} products in the{" "}
                                    {category.name} category. Click on a product
                                    to see pricing details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Search Products */}
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products by name or description..."
                                        className="pl-8"
                                        value={productSearchTerm}
                                        onChange={(e) =>
                                            setProductSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                {/* Products List with Collapsible Sections */}
                                <div className="space-y-3">
                                    {filteredProducts.length === 0 ? (
                                        <div className="text-center py-8 border rounded-md">
                                            <p className="text-muted-foreground">
                                                {category.products.length === 0
                                                    ? "No products found in this category."
                                                    : "No products match your search."}
                                            </p>
                                        </div>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <Collapsible
                                                key={product.id}
                                                open={expandedProducts.has(
                                                    product.id
                                                )}
                                                onOpenChange={() =>
                                                    toggleProductExpansion(
                                                        product.id
                                                    )
                                                }
                                                className="border rounded-md"
                                            >
                                                <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 hover:bg-gray-50 text-left">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {product.name}
                                                            </span>
                                                            {product.prices &&
                                                                product.prices
                                                                    .length >
                                                                    0 && (
                                                                    <span className="text-sm text-muted-foreground">
                                                                        Current
                                                                        price:{" "}
                                                                        {new Intl.NumberFormat(
                                                                            "en-US",
                                                                            {
                                                                                style: "currency",
                                                                                currency:
                                                                                    "USD",
                                                                            }
                                                                        ).format(
                                                                            // Use the first price if currentPrice is not available

                                                                            product
                                                                                .prices[0]
                                                                                .price
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            expandedProducts.has(
                                                                product.id
                                                            )
                                                                ? "transform rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="px-4 py-3 border-t space-y-3">
                                                        {/* Product Description */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                                Description
                                                            </h4>
                                                            <p className="mt-1 text-sm">
                                                                {product.description ||
                                                                    "No description available"}
                                                            </p>
                                                        </div>

                                                        {/* Product Prices Section */}
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
                                                                <DollarSign className="mr-1 h-4 w-4" />
                                                                Price History
                                                            </h4>

                                                            {!product.prices ||
                                                            product.prices
                                                                .length ===
                                                                0 ? (
                                                                <p className="text-sm text-muted-foreground italic">
                                                                    No price
                                                                    data
                                                                    available
                                                                </p>
                                                            ) : (
                                                                <div className="border rounded overflow-hidden">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>
                                                                                    Price
                                                                                </TableHead>
                                                                                <TableHead>
                                                                                    Type
                                                                                </TableHead>
                                                                                <TableHead>
                                                                                    <span className="flex items-center">
                                                                                        <Clock className="mr-1 h-4 w-4" />
                                                                                        Effective
                                                                                        Date
                                                                                    </span>
                                                                                </TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {product.prices.map(
                                                                                (
                                                                                    price
                                                                                ) => (
                                                                                    <TableRow
                                                                                        key={
                                                                                            price.id
                                                                                        }
                                                                                    >
                                                                                        <TableCell className="font-medium">
                                                                                            {price.price ||
                                                                                                new Intl.NumberFormat(
                                                                                                    "en-US",
                                                                                                    {
                                                                                                        style: "currency",
                                                                                                        currency:
                                                                                                            "USD",
                                                                                                    }
                                                                                                ).format(
                                                                                                    price.price
                                                                                                )}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Badge variant="outline">
                                                                                                {price.billing_cycle ||
                                                                                                    "Standard"}
                                                                                            </Badge>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* View Product Link */}
                                                        <div className="pt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "products.show",
                                                                        {
                                                                            product:
                                                                                product.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <PlusCircle className="mr-2 h-3 w-3" />
                                                                    View Product
                                                                    Details
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredProducts.length} of{" "}
                                    {category.products.length} products
                                </p>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={route(
                                                        "products.index",
                                                        {
                                                            category:
                                                                category.id,
                                                        }
                                                    )}
                                                >
                                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                                    Manage Products
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                View all products in this
                                                category
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
