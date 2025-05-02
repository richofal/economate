"use client";

import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    PlusCircle,
    Search,
    Download,
    Upload,
    MoreHorizontal,
    ChevronDown,
    Edit,
    Trash2,
    Eye,
    FolderTree,
    RefreshCw,
    Tag,
    Layers,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Category, PageProps } from "@/types";
import { FlashMessage } from "@/Components/ui/flash-message";

// Define the props for the CategoriesIndex component
interface CategoriesIndexProps extends PageProps {
    categories: Category[];
    canCreateCategory: boolean;
    canEditCategory: boolean;
    canDeleteCategory: boolean;
    flash: {
        success: string | null;
        error: string | null;
        warning?: string;
        info?: string;
    };
}

export default function CategoriesIndex() {
    const {
        categories,
        canCreateCategory,
        canEditCategory,
        canDeleteCategory,
        flash = { success: null, error: null }, // Default value to prevent undefined
    } = usePage<CategoriesIndexProps>().props;

    const [flashMessages, setFlashMessages] = useState<{
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    }>({
        success: flash?.success || undefined, // Use optional chaining
        error: flash?.error || undefined, // Use optional chaining
        warning: flash?.warning, // Use optional chaining
        info: flash?.info, // Use optional chaining
    });

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<string>("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [filteredCategories, setFilteredCategories] =
        useState<Category[]>(categories);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);

    // Stats calculations
    const totalCategories = categories.length;
    const totalProducts = categories.reduce(
        (acc, category) => acc + (category.products?.length || 0),
        0
    );
    const averageProductsPerCategory =
        totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;

    // Apply filters and search
    useEffect(() => {
        setIsLoading(true);

        // Simulate loading delay for better UX
        const timer = setTimeout(() => {
            let result = [...categories];

            // Apply search
            if (searchTerm) {
                const lowerSearchTerm = searchTerm.toLowerCase();
                result = result.filter(
                    (category) =>
                        category.name.toLowerCase().includes(lowerSearchTerm) ||
                        category.description
                            .toLowerCase()
                            .includes(lowerSearchTerm)
                );
            }

            // Apply sorting
            result.sort((a, b) => {
                let aValue: any, bValue: any;

                switch (sortField) {
                    case "name":
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    default:
                        // Default to created_at
                        aValue = new Date(a.created_at || "").getTime();
                        bValue = new Date(b.created_at || "").getTime();
                }

                // Compare based on direction
                if (sortDirection === "asc") {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            setFilteredCategories(result);
            setIsLoading(false);
        }, 300); // Small delay for better UX

        return () => clearTimeout(timer);
    }, [categories, searchTerm, sortField, sortDirection]);

    // Handle sort change
    const handleSort = (field: string) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new field and default to ascending
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Handle delete
    const handleDeleteClick = (id: number) => {
        setCategoryToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (categoryToDelete) {
            router.delete(
                route("categories.destroy", { category: categoryToDelete }),
                {
                    onSuccess: () => {
                        setIsDeleteDialogOpen(false);
                        setCategoryToDelete(null);
                    },
                }
            );
        }
    };

    // Handle search submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("categories.index"),
            { search: searchTerm },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Categories Management" />

            {flashMessages.success && (
                <FlashMessage
                    variant="success"
                    message={flashMessages.success}
                    onClose={() =>
                        setFlashMessages((prev) => ({
                            ...prev,
                            success: undefined,
                        }))
                    }
                />
            )}

            {flashMessages.error && (
                <FlashMessage
                    variant="error"
                    message={flashMessages.error}
                    onClose={() =>
                        setFlashMessages((prev) => ({
                            ...prev,
                            error: undefined,
                        }))
                    }
                />
            )}

            {flashMessages.warning && (
                <FlashMessage
                    variant="warning"
                    message={flashMessages.warning}
                    onClose={() =>
                        setFlashMessages((prev) => ({
                            ...prev,
                            warning: undefined,
                        }))
                    }
                />
            )}

            {flashMessages.info && (
                <FlashMessage
                    variant="info"
                    message={flashMessages.info}
                    onClose={() =>
                        setFlashMessages((prev) => ({
                            ...prev,
                            info: undefined,
                        }))
                    }
                />
            )}

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
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {canCreateCategory && (
                            <Button asChild>
                                <Link href={route("categories.create")}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Category
                                </Link>
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import Categories
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Categories
                            </CardTitle>
                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalCategories}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {categories.length > 0
                                    ? `Last added on ${new Date(
                                          categories[0].created_at || ""
                                      ).toLocaleDateString()}`
                                    : "No categories yet"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Tag className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all categories
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Average Products
                            </CardTitle>
                            <Layers className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {averageProductsPerCategory}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Products per category
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search categories..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setSortField("created_at");
                                setSortDirection("desc");
                                router.get(route("categories.index"));
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            {filteredCategories.length}{" "}
                            {filteredCategories.length === 1
                                ? "category"
                                : "categories"}{" "}
                            found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] text-center">
                                            <div className="text-center">
                                                ID
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Name</span>
                                                {sortField === "name" && (
                                                    <ChevronDown
                                                        className={`h-4 w-4 ${
                                                            sortDirection ===
                                                            "desc"
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <div className="flex justify-center items-center">
                                                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                                    <span className="ml-2">
                                                        Loading categories...
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <TableRow
                                                key={category.id}
                                                className="group"
                                            >
                                                <TableCell className="text-center">
                                                    {category.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {category.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="truncate max-w-md">
                                                        {category.description ||
                                                            "No description"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={route(
                                                                                "categories.show",
                                                                                {
                                                                                    category:
                                                                                        category.id,
                                                                                }
                                                                            )}
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                View
                                                                            </span>
                                                                        </Link>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        View
                                                                        Details
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {canEditCategory && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={route(
                                                                                    "categories.edit",
                                                                                    {
                                                                                        category:
                                                                                            category.id,
                                                                                    }
                                                                                )}
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                                <span className="sr-only">
                                                                                    Edit
                                                                                </span>
                                                                            </Link>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Edit
                                                                            Category
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}

                                                        {canDeleteCategory && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleDeleteClick(
                                                                                    category.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Delete
                                                                            </span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Delete
                                                                            Category
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                            Showing <strong>{filteredCategories.length}</strong>{" "}
                            of <strong>{totalCategories}</strong> categories
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Are you sure you want to delete this category?
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the category and may affect related products.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
