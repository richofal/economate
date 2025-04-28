import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    User,
    Search,
    X,
    Phone,
    Mail,
    MapPin,
    Plus,
    Filter,
    ChevronDown,
    MoreHorizontal,
    FileText,
    Edit,
    Trash,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Sales, PageProps } from "@/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Badge } from "@/Components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

interface SalesPageProps extends PageProps {
    sales: Sales[];
    canViewSales: boolean;
    canCreateSales: boolean;
    canEditSales: boolean;
    canDeleteSales: boolean;
}

const SalesIndex = () => {
    const {
        sales,
        canViewSales,
        canCreateSales,
        canDeleteSales,
        canEditSales,
    } = usePage<SalesPageProps>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSalesId, setSelectedSalesId] = useState<number | null>(null);

    // Filter sales based on search term
    const filteredSales = sales.filter(
        (sale) =>
            sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Handle delete
    const handleDelete = (id: number) => {
        setSelectedSalesId(id);
        setDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        // Implement delete logic here using Inertia.delete
        setDeleteDialogOpen(false);
    };

    if (!canViewSales) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>
                            You don't have permission to view sales
                            representatives.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Sales Management" />

            <div className="container mx-auto py-6 space-y-6">
                {/* Breadcrumb Navigation */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route("dashboard")}>
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Sales</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card>
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-full">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Sales Representatives
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your sales team members
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <User className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Total:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {sales.length}
                                </span>
                            </Badge>
                            {canCreateSales && (
                                <Button asChild>
                                    <Link href={route("sales.create")}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Sales Rep
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle>All Sales Representatives</CardTitle>
                                <CardDescription>
                                    View and manage your sales team
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name, email, or phone..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {filteredSales.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Sales Rep</TableHead>
                                            <TableHead>
                                                Contact Information
                                            </TableHead>

                                            <TableHead>Member Since</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSales.map((sale) => (
                                            <TableRow key={sale.id}>
                                                <TableCell className="w-[50px] text-center font-medium text-muted-foreground">
                                                    {sale.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="font-medium">
                                                                {sale.name}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Sales Rep
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm">
                                                            <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                            <span>
                                                                {sale.email}
                                                            </span>
                                                        </div>
                                                        {sale.phone && (
                                                            <div className="flex items-center text-sm">
                                                                <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span>
                                                                    {sale.phone}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {sale.address && (
                                                            <div className="flex items-center text-sm">
                                                                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span>
                                                                    {
                                                                        sale.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {formatDate(
                                                        sale.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "sales.show",
                                                                        {
                                                                            id: sale.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    View Profile
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            {canEditSales && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "sales.edit",
                                                                            {
                                                                                id: sale.id,
                                                                            }
                                                                        )}
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canDeleteSales && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                sale.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-4">
                                    <User className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No sales representatives found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm
                                        ? "No sales reps match your search criteria. Try adjusting your search."
                                        : "There are no sales representatives in the system yet."}
                                </p>
                                {canCreateSales && !searchTerm && (
                                    <Button asChild>
                                        <Link href={route("sales.create")}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Sales Rep
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>

                    {filteredSales.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>{filteredSales.length}</strong> of{" "}
                                    <strong>{sales.length}</strong> sales
                                    representatives
                                </div>
                                {searchTerm && (
                                    <div className="flex items-center gap-1">
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Search: "{searchTerm}"
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the sales representative and remove their
                            data from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default SalesIndex;
