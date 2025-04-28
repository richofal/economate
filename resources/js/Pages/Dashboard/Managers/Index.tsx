import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Shield,
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
    Edit,
    Trash,
    CheckSquare,
    Users,
    Calendar,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Manager, PageProps } from "@/types";

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

interface ManagersPageProps extends PageProps {
    managers: Manager[];
    canViewManagers: boolean;
    canCreateManagers?: boolean;
    canEditManagers?: boolean;
    canDeleteManagers?: boolean;
}

const ManagersIndex = () => {
    const {
        managers,
        canViewManagers,
        canCreateManagers,
        canEditManagers,
        canDeleteManagers,
    } = usePage<ManagersPageProps>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
        null
    );

    // Filter managers based on search term
    const filteredManagers = managers.filter((manager) => {
        const matchesSearch =
            manager.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.phone?.toLowerCase().includes(searchTerm.toLowerCase());

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

    // Calculate manager stats
    const calculateManagerStats = () => {
        const totalManagers = managers.length;
        const totalApprovals = managers.reduce(
            (sum, manager) =>
                sum + (manager.approvedSubscriptions?.length || 0),
            0
        );
        const newlyJoinedManagers = managers.filter((m) => {
            if (!m.created_at) return false;
            const createdDate = new Date(m.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return createdDate > thirtyDaysAgo;
        }).length;

        return {
            totalManagers,
            totalApprovals,
            newlyJoinedManagers,
        };
    };

    const stats = calculateManagerStats();

    // Handle delete
    const handleDelete = (id: number) => {
        setSelectedManagerId(id);
        setDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        // Implement delete logic here using Inertia.delete
        setDeleteDialogOpen(false);
    };

    if (!canViewManagers) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>You don't have permission to view managers.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Managers Management" />

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
                            <BreadcrumbLink>Managers</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-none shadow-sm">
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-full">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Managers</h1>
                                <p className="text-muted-foreground">
                                    Manage your system administrators
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <Shield className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Total:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {managers.length}
                                </span>
                            </Badge>
                            {canCreateManagers && (
                                <Button asChild>
                                    <Link href={route("managers.create")}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Manager
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Managers
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalManagers}
                                    </p>
                                </div>
                                <Shield className="h-8 w-8 text-primary/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Approvals
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalApprovals}
                                    </p>
                                </div>
                                <CheckSquare className="h-8 w-8 text-green-500/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        New (Last 30 Days)
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.newlyJoinedManagers}
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
                                <CardTitle>All Managers</CardTitle>
                                <CardDescription>
                                    View and manage your system administrators
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

                        {filteredManagers.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Manager</TableHead>
                                            <TableHead>
                                                Contact Information
                                            </TableHead>
                                            <TableHead>Manager Since</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredManagers.map((manager) => (
                                            <TableRow key={manager.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="font-medium">
                                                                {manager.name}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Manager
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm">
                                                            <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                            <span>
                                                                {manager.email}
                                                            </span>
                                                        </div>
                                                        {manager.phone && (
                                                            <div className="flex items-center text-sm">
                                                                <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span>
                                                                    {
                                                                        manager.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {manager.address && (
                                                            <div className="flex items-center text-sm">
                                                                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                <span className="truncate max-w-[200px]">
                                                                    {
                                                                        manager.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        manager.created_at
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
                                                                        "managers.show",
                                                                        {
                                                                            id: manager.id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    View Profile
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            {canEditManagers && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "managers.edit",
                                                                            {
                                                                                id: manager.id,
                                                                            }
                                                                        )}
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {canDeleteManagers && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                manager.id
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
                                    <Shield className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No managers found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm
                                        ? "No managers match your search criteria. Try adjusting your search."
                                        : "There are no managers in the system yet."}
                                </p>
                                {canCreateManagers && !searchTerm && (
                                    <Button asChild>
                                        <Link href={route("managers.create")}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Manager
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>

                    {filteredManagers.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>{filteredManagers.length}</strong>{" "}
                                    of <strong>{managers.length}</strong>{" "}
                                    managers
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
                            delete the manager account and remove their data
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

export default ManagersIndex;
