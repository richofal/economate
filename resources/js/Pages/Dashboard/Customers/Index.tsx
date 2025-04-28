import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Users,
    Search,
    X,
    Phone,
    Mail,
    MapPin,
    Plus,
    Filter,
    ChevronDown,
    MoreHorizontal,
    User,
    FileText,
    CreditCard,
    Calendar,
    Edit,
    Trash,
    ShoppingCart,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Customer, PageProps } from "@/types";

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
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface CustomersPageProps extends PageProps {
    customers: Customer[];
    canViewCustomers: boolean;
    canCreateCustomers?: boolean;
    canEditCustomers?: boolean;
    canDeleteCustomers?: boolean;
}

const CustomersIndex = () => {
    const {
        customers,
        canViewCustomers,
        canCreateCustomers,
        canEditCustomers,
        canDeleteCustomers,
    } = usePage<CustomersPageProps>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
        null
    );

    // Filter customers based on search term and status
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Format date function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Format currency
    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return "-";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Get initials for avatar
    const getInitials = (name: string) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Handle delete
    const handleDelete = (id: number) => {
        setSelectedCustomerId(id);
        setDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        // Implement delete logic here using Inertia.delete
        setDeleteDialogOpen(false);
    };

    if (!canViewCustomers) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>You don't have permission to view customers.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Customers Management" />

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
                            <BreadcrumbLink href={route("customers.index")}>
                                Users
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Customers</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-none shadow-sm">
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-full">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Customers
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your customer accounts
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Total:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {customers.length}
                                </span>
                            </Badge>
                            {canCreateCustomers && (
                                <Button asChild>
                                    <Link href={route("customers.create")}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Customer
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Customers
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {customers.length}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-primary/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        New This Month
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            customers.filter((c) => {
                                                if (!c.created_at) return false;
                                                const date = new Date(
                                                    c.created_at
                                                );
                                                const now = new Date();
                                                return (
                                                    date.getMonth() ===
                                                        now.getMonth() &&
                                                    date.getFullYear() ===
                                                        now.getFullYear()
                                                );
                                            }).length
                                        }
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-blue-500/20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle>All Customers</CardTitle>
                                <CardDescription>
                                    View and manage your customer accounts
                                </CardDescription>
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Customers
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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

                        {filteredCustomers.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>
                                                Contact Information
                                            </TableHead>
                                            <TableHead>
                                                Customer Since
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCustomers.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="font-medium">
                                                                {customer.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm">
                                                            <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                            <span>
                                                                {customer.email}
                                                            </span>
                                                        </div>
                                                        {customer.phone && (
                                                            <div className="flex items-center text-sm">
                                                                <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span>
                                                                    {
                                                                        customer.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {customer.address && (
                                                            <div className="flex items-center text-sm">
                                                                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span className="truncate max-w-[200px]">
                                                                    {
                                                                        customer.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {formatDate(
                                                        customer.created_at
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
                                                                        "customers.show",
                                                                        {
                                                                            id: customer.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    View Profile
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "customers.show",
                                                                        {
                                                                            id: customer.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    View
                                                                    Subscriptions
                                                                </Link>
                                                            </DropdownMenuItem>
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
                                    <Users className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No customers found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm || statusFilter !== "all"
                                        ? "No customers match your search criteria. Try adjusting your filters."
                                        : "There are no customers in the system yet."}
                                </p>
                                {canCreateCustomers && !searchTerm && (
                                    <Button asChild>
                                        <Link href={route("customers.create")}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Customer
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>

                    {filteredCustomers.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>{filteredCustomers.length}</strong>{" "}
                                    of <strong>{customers.length}</strong>{" "}
                                    customers
                                </div>
                                <div className="flex items-center gap-1">
                                    {statusFilter !== "all" && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Status: {statusFilter}
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Search: "{searchTerm}"
                                        </span>
                                    )}
                                    {(searchTerm || statusFilter !== "all") && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setStatusFilter("all");
                                            }}
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
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
                            delete the customer account and remove their data
                            from the system.
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

export default CustomersIndex;
