"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    PlusCircle,
    Search,
    Download,
    Upload,
    MoreHorizontal,
    ChevronDown,
    CheckCircle2,
    Edit,
    Trash2,
    Eye,
    Package,
    RefreshCw,
    Clock,
    Star,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
import { Product, PageProps, Category } from "@/types";

interface ProductsPageProps extends PageProps {
    products: Product[];
    categories: Category[];
    canCreateProduct: boolean;
    canEditProduct: boolean;
    canDeleteProduct: boolean;
}
export default function ProductsIndex() {
    const { products, canCreateProduct, canEditProduct, canDeleteProduct } =
        usePage<ProductsPageProps>().props;

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<string>("created_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(products);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Stats calculations
    const totalProducts = products.length;
    const activeProducts = products.filter(
        (product) => product.is_active
    ).length;
    const featuredProducts = products.filter(
        (product) => product.is_featured
    ).length;
    const recurringProducts = products.filter(
        (product) => product.is_recurring
    ).length;

    // Apply filters and search
    useEffect(() => {
        setIsLoading(true);

        // Simulate loading delay for better UX
        const timer = setTimeout(() => {
            let result = [...products];

            // Apply search
            if (searchTerm) {
                const lowerSearchTerm = searchTerm.toLowerCase();
                result = result.filter(
                    (product) =>
                        product.name.toLowerCase().includes(lowerSearchTerm) ||
                        product.description
                            .toLowerCase()
                            .includes(lowerSearchTerm) ||
                        product.code.toLowerCase().includes(lowerSearchTerm)
                );
            }

            // Apply category filter
            if (categoryFilter !== "all") {
                result = result.filter(
                    (product) => product.category.name === categoryFilter
                );
            }

            // Apply status filter
            if (statusFilter !== "all") {
                const isActive = statusFilter === "active";
                result = result.filter(
                    (product) => product.is_active === isActive
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
                    case "category":
                        aValue = a.category.name;
                        bValue = b.category.name;
                        break;
                    case "bandwidth":
                        aValue = a.bandwidth;
                        bValue = b.bandwidth;
                        break;
                    default:
                        // Default to created_at
                        aValue = new Date(a.created_at).getTime();
                        bValue = new Date(b.created_at).getTime();
                }

                // Compare based on direction
                if (sortDirection === "asc") {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });

            setFilteredProducts(result);
            setIsLoading(false);
        }, 300); // Small delay for better UX

        return () => clearTimeout(timer);
    }, [
        products,
        searchTerm,
        categoryFilter,
        statusFilter,
        sortField,
        sortDirection,
    ]);

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
        setProductToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            router.delete(
                route("products.destroy", { product: productToDelete }),
                {
                    onSuccess: () => {
                        setIsDeleteDialogOpen(false);
                        setProductToDelete(null);
                    },
                }
            );
        }
    };

    // Handle search submit
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("products.index"),
            {
                search: searchTerm,
                category: categoryFilter,
                status: statusFilter,
            },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Products Management" />

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
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        {canCreateProduct && (
                            <Button asChild>
                                <Link href={route("products.create")}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Product
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
                                    Import Products
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {products.length > 0
                                    ? `Last added on ${new Date(
                                          products[0].created_at
                                      ).toLocaleDateString()}`
                                    : "No products yet"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Products
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round(
                                    (activeProducts / totalProducts) * 100
                                ) || 0}
                                % of total products
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Featured Products
                            </CardTitle>
                            <Star className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {featuredProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round(
                                    (featuredProducts / totalProducts) * 100
                                ) || 0}
                                % of total products
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recurring Products
                            </CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {recurringProducts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round(
                                    (recurringProducts / totalProducts) * 100
                                ) || 0}
                                % of total products
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
                            placeholder="Search products..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <div className="flex flex-wrap gap-2">
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {/* Mengakses categories dari props, bukan dari products */}
                                {usePage<ProductsPageProps>().props.categories.map(
                                    (category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setCategoryFilter("all");
                                setStatusFilter("all");
                                setSortField("created_at");
                                setSortDirection("desc");
                                router.visit(route("products.index"));
                            }}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1
                                ? "product"
                                : "products"}{" "}
                            found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[1%] text-center">
                                            <div className="text-center">
                                                No.
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Product</span>
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
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("category")
                                            }
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Category</span>
                                                {sortField === "category" && (
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
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort("price")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Setup Fee</span>
                                                {sortField === "price" && (
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
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("bandwidth")
                                            }
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Bandwidth</span>
                                                {sortField === "bandwidth" && (
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
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center"
                                            >
                                                <div className="flex justify-center items-center">
                                                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                                                    <span className="ml-2">
                                                        Loading products...
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center"
                                            >
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                className="group"
                                            >
                                                <TableCell className="text-center">
                                                    <div className="text-center">
                                                        {product.id}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div>
                                                            <div className="font-medium">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Code:{" "}
                                                                {product.code}
                                                            </div>
                                                        </div>
                                                        {product.is_featured && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="ml-2 bg-amber-100 text-amber-800"
                                                            >
                                                                Featured
                                                            </Badge>
                                                        )}
                                                        {product.is_recurring && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="ml-2"
                                                            >
                                                                Recurring
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {product.category.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {product.setup_fee}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {product.bandwidth}{" "}
                                                        {product.bandwidth_type}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {
                                                            product.connection_type
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {product.is_active ? (
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                            Inactive
                                                        </Badge>
                                                    )}
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
                                                                                "products.show",
                                                                                {
                                                                                    product:
                                                                                        product.id,
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

                                                        {canEditProduct && (
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
                                                                                    "products.edit",
                                                                                    {
                                                                                        product:
                                                                                            product.id,
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
                                                                            Product
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}

                                                        {canDeleteProduct && (
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
                                                                                    product.id
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
                                                                            Product
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
                            Showing <strong>{filteredProducts.length}</strong>{" "}
                            of <strong>{totalProducts}</strong> products
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
                            Are you sure you want to delete this product?
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product and remove it from our servers.
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
