import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    FileText,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    Plus,
    User,
    Shield,
    Package,
    Calendar,
    CalendarClock,
    BarChart,
    RefreshCw,
    Filter,
    DollarSign,
    Edit,
    Trash,
    Eye,
    ArrowUpDown,
    CalendarDays,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Subscription, PageProps } from "@/types";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface SubscriptionsPageProps extends PageProps {
    subscriptions: Subscription[];
    canViewSubscriptions: boolean;
    canCreateSubscriptions?: boolean;
    canApproveSubscriptions?: boolean;
    canEditSubscriptions?: boolean;
    canCancelSubscriptions?: boolean;
}

const SubscriptionsIndex = () => {
    const {
        subscriptions,
        canViewSubscriptions,
        canCreateSubscriptions,
        canApproveSubscriptions,
        canEditSubscriptions,
        canCancelSubscriptions,
    } = usePage<SubscriptionsPageProps>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");
    const [sortField, setSortField] = useState("start_date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
        number | null
    >(null);

    // Items per page
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

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

    // Get subscription status badge
    const getSubscriptionStatusBadge = (status?: string) => {
        if (!status) return <Badge variant="outline">Unknown</Badge>;

        switch (status.toLowerCase()) {
            case "active":
                return (
                    <Badge
                        variant="default"
                        className="flex items-center gap-1"
                    >
                        <CheckCircle className="h-3 w-3" /> Active
                    </Badge>
                );
            case "pending_approval":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <Clock className="h-3 w-3" /> Pending
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <XCircle className="h-3 w-3" /> Cancelled
                    </Badge>
                );
            case "expired":
                return (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        <Clock className="h-3 w-3" /> Expired
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate subscription statistics
    const calculateSubscriptionStats = () => {
        const totalSubscriptions = subscriptions.length;

        const activeSubscriptions = subscriptions.filter(
            (s) => s.status === "active"
        ).length;
        const approvedSubscriptions = subscriptions.filter(
            (s) => s.status === "approved"
        ).length;
        const pendingSubscriptions = subscriptions.filter(
            (s) => s.status === "pending_approval"
        ).length;
        const cancelledSubscriptions = subscriptions.filter(
            (s) => s.status === "cancelled"
        ).length;
        const expiredSubscriptions = subscriptions.filter(
            (s) => s.status === "expired"
        ).length;

        // Calculate MRR (Monthly Recurring Revenue)
        const monthlyRecurringRevenue = subscriptions
            .filter((s) => s.status === "active")
            .reduce((total, sub) => {
                if (!sub.product_price?.price) return total;

                let monthlyValue = sub.product_price.price;
                const billingCycle = sub.product_price.billing_cycle;

                // Convert to monthly equivalent
                if (billingCycle === "quarterly") {
                    monthlyValue /= 3;
                } else if (
                    billingCycle === "semi_annual" ||
                    billingCycle === "biannually"
                ) {
                    monthlyValue /= 6;
                } else if (
                    billingCycle === "annual" ||
                    billingCycle === "yearly"
                ) {
                    monthlyValue /= 12;
                }

                return total + monthlyValue;
            }, 0);

        // Calculate renewals due in the next 30 days
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const renewalsDueSoon = subscriptions.filter((s) => {
            if (s.status !== "active" || !s.next_billing_date) return false;
            const renewalDate = new Date(s.next_billing_date);
            return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
        }).length;

        // Calculate subscriptions that need approval
        const needApproval = subscriptions.filter(
            (s) =>
                s.status === "pending" &&
                s.approval_requested_at &&
                !s.approved_at
        ).length;

        return {
            totalSubscriptions,
            activeSubscriptions,
            approvedSubscriptions,
            pendingSubscriptions,
            cancelledSubscriptions,
            expiredSubscriptions,
            monthlyRecurringRevenue,
            renewalsDueSoon,
            needApproval,
        };
    };

    const stats = calculateSubscriptionStats();

    // Filter and sort subscriptions
    const getFilteredAndSortedSubscriptions = () => {
        // First, apply filters
        let filtered = [...subscriptions];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (sub) =>
                    sub.subscription_number
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    sub.user?.name?.toLowerCase().includes(searchLower) ||
                    sub.product_price?.product?.name
                        ?.toLowerCase()
                        .includes(searchLower)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((sub) => sub.status === statusFilter);
        }

        // Time filter
        if (timeFilter !== "all") {
            const today = new Date();

            if (timeFilter === "active") {
                filtered = filtered.filter((sub) => sub.status === "active");
            } else if (timeFilter === "pending-approval") {
                filtered = filtered.filter(
                    (sub) =>
                        sub.status === "pending" &&
                        sub.approval_requested_at &&
                        !sub.approved_at
                );
            } else if (timeFilter === "renewing-soon") {
                const thirtyDaysFromNow = new Date(today);
                thirtyDaysFromNow.setDate(today.getDate() + 30);

                filtered = filtered.filter((sub) => {
                    if (!sub.next_billing_date || sub.status !== "active")
                        return false;
                    const renewalDate = new Date(sub.next_billing_date);
                    return (
                        renewalDate >= today && renewalDate <= thirtyDaysFromNow
                    );
                });
            } else if (timeFilter === "ending-soon") {
                const thirtyDaysFromNow = new Date(today);
                thirtyDaysFromNow.setDate(today.getDate() + 30);

                filtered = filtered.filter((sub) => {
                    if (!sub.end_date || sub.status !== "active") return false;
                    const endDate = new Date(sub.end_date);
                    return (
                        endDate >= today &&
                        endDate <= thirtyDaysFromNow &&
                        !sub.auto_renew
                    );
                });
            }
        }

        // Then, sort the filtered results
        filtered.sort((a, b) => {
            let aValue: any = null;
            let bValue: any = null;

            // Get the appropriate values based on the sort field
            switch (sortField) {
                case "subscription_number":
                    aValue = a.subscription_number || "";
                    bValue = b.subscription_number || "";
                    break;
                case "customer_name":
                    aValue = a.user?.name || "";
                    bValue = b.user?.name || "";
                    break;
                case "product_name":
                    aValue = a.product_price?.product?.name || "";
                    bValue = b.product_price?.product?.name || "";
                    break;
                case "start_date":
                    aValue = a.start_date
                        ? new Date(a.start_date).getTime()
                        : 0;
                    bValue = b.start_date
                        ? new Date(b.start_date).getTime()
                        : 0;
                    break;
                case "end_date":
                    aValue = a.end_date ? new Date(a.end_date).getTime() : 0;
                    bValue = b.end_date ? new Date(b.end_date).getTime() : 0;
                    break;
                case "next_billing_date":
                    aValue = a.next_billing_date
                        ? new Date(a.next_billing_date).getTime()
                        : 0;
                    bValue = b.next_billing_date
                        ? new Date(b.next_billing_date).getTime()
                        : 0;
                    break;
                case "price":
                    aValue = a.product_price?.price || 0;
                    bValue = b.product_price?.price || 0;
                    break;
                default:
                    aValue = a.start_date
                        ? new Date(a.start_date).getTime()
                        : 0;
                    bValue = b.start_date
                        ? new Date(b.start_date).getTime()
                        : 0;
            }

            // Compare the values based on sort direction
            if (sortDirection === "asc") {
                if (typeof aValue === "string") {
                    return aValue.localeCompare(bValue);
                }
                return aValue - bValue;
            } else {
                if (typeof aValue === "string") {
                    return bValue.localeCompare(aValue);
                }
                return bValue - aValue;
            }
        });

        return filtered;
    };

    const filteredAndSortedSubscriptions = getFilteredAndSortedSubscriptions();

    // Calculate pagination
    const totalPages = Math.ceil(
        filteredAndSortedSubscriptions.length / itemsPerPage
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSubscriptions = filteredAndSortedSubscriptions.slice(
        startIndex,
        endIndex
    );

    // Handle sort
    const handleSort = (field: string) => {
        if (field === sortField) {
            // Toggle direction if clicking the same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new field and default to descending
            setSortField(field);
            setSortDirection("desc");
        }
    };

    // Handle cancel subscription
    const handleCancelSubscription = (id: number) => {
        setSelectedSubscriptionId(id);
        setCancelDialogOpen(true);
    };

    // Confirm cancel
    const confirmCancel = () => {
        // Implement cancel logic here using Inertia
        setCancelDialogOpen(false);
    };

    // Generate pagination items
    const getPaginationItems = () => {
        let items = [];

        // Always show first page
        items.push(
            <PaginationItem key="first">
                <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    isActive={currentPage === 1}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // Add ellipsis if needed
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Add pages around current page
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (i > 1 && i < totalPages) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => setCurrentPage(i)}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        // Add ellipsis if needed
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    if (!canViewSubscriptions) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>You don't have permission to view subscriptions.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Subscriptions Management" />

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
                            <BreadcrumbLink>Subscriptions</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card>
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2.5 rounded-full">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Subscriptions
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage customer subscriptions
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Total:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {stats.totalSubscriptions}
                                </span>
                            </Badge>
                            {canCreateSubscriptions && (
                                <Button asChild>
                                    <Link href={route("subscriptions.create")}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Subscription
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
                                        Active Subscriptions
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.activeSubscriptions}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Monthly Revenue
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(
                                            stats.monthlyRecurringRevenue
                                        )}
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-blue-500/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Renewals (30 Days)
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.renewalsDueSoon}
                                    </p>
                                </div>
                                <RefreshCw className="h-8 w-8 text-amber-500/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Awaiting Approval
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.needApproval}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-indigo-500/20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <CardTitle>All Subscriptions</CardTitle>
                                <CardDescription>
                                    View and manage all customer subscriptions
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Statuses
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            Approved
                                        </SelectItem>
                                        <SelectItem value="pending_approval">
                                            Pending Approval
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem value="expired">
                                            Expired
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by subscription number, customer, or product..."
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

                        {currentSubscriptions.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort(
                                                        "subscription_number"
                                                    )
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Subscription #</span>
                                                    {sortField ===
                                                        "subscription_number" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort("customer_name")
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Customer</span>
                                                    {sortField ===
                                                        "customer_name" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort("product_name")
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Product</span>
                                                    {sortField ===
                                                        "product_name" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort("price")
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Price</span>
                                                    {sortField === "price" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort("start_date")
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Start Date</span>
                                                    {sortField ===
                                                        "start_date" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleSort(
                                                        "next_billing_date"
                                                    )
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Next Billing</span>
                                                    {sortField ===
                                                        "next_billing_date" && (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className={
                                                                sortDirection ===
                                                                "asc"
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
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
                                        {currentSubscriptions.map(
                                            (subscription) => (
                                                <TableRow key={subscription.id}>
                                                    <TableCell className="font-medium">
                                                        <Link
                                                            href={route(
                                                                "subscriptions.show",
                                                                {
                                                                    id: subscription.id,
                                                                }
                                                            )}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {
                                                                subscription.subscription_number
                                                            }
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href=""
                                                                className="hover:underline"
                                                            >
                                                                {subscription
                                                                    .user
                                                                    ?.name ||
                                                                    "Unknown"}
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div
                                                            className="max-w-[200px] truncate"
                                                            title={
                                                                subscription
                                                                    .product_price
                                                                    ?.product
                                                                    ?.name
                                                            }
                                                        >
                                                            {subscription
                                                                .product_price
                                                                ?.product
                                                                ?.name ||
                                                                "Unknown"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {formatCurrency(
                                                                subscription
                                                                    .product_price
                                                                    ?.price
                                                            )}
                                                            <span className="text-xs text-muted-foreground block">
                                                                {
                                                                    subscription
                                                                        .product_price
                                                                        ?.billing_cycle
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            subscription.start_date
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {subscription.status ===
                                                        "active" ? (
                                                            <div className="flex items-center">
                                                                {formatDate(
                                                                    subscription.next_billing_date
                                                                )}
                                                                {subscription.auto_renew && (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <RefreshCw className="ml-1 h-3.5 w-3.5 text-green-500" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    Auto-renew
                                                                                    enabled
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getSubscriptionStatusBadge(
                                                            subscription.status
                                                        )}
                                                        {subscription.status ===
                                                            "pending" &&
                                                            subscription.approval_requested_at &&
                                                            !subscription.approved_at && (
                                                                <div className="text-xs text-amber-600 mt-1 flex items-center">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    Awaiting
                                                                    Approval
                                                                </div>
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
                                                                        Open
                                                                        menu
                                                                    </span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "subscriptions.show",
                                                                            {
                                                                                id: subscription.id,
                                                                            }
                                                                        )}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View
                                                                        Details
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                                {subscription.status ===
                                                                    "pending" &&
                                                                    subscription.approval_requested_at &&
                                                                    !subscription.approved_at &&
                                                                    canApproveSubscriptions && (
                                                                        <DropdownMenuItem
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={route(
                                                                                    "subscriptions.approve",
                                                                                    {
                                                                                        id: subscription.id,
                                                                                    }
                                                                                )}
                                                                            >
                                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                                Approve
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                {canEditSubscriptions &&
                                                                    subscription.status !==
                                                                        "cancelled" &&
                                                                    subscription.status !==
                                                                        "expired" && (
                                                                        <DropdownMenuItem
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={route(
                                                                                    "subscriptions.edit",
                                                                                    {
                                                                                        id: subscription.id,
                                                                                    }
                                                                                )}
                                                                            >
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                {canCancelSubscriptions &&
                                                                    subscription.status ===
                                                                        "active" && (
                                                                        <>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                className="text-red-600"
                                                                                onClick={() =>
                                                                                    handleCancelSubscription(
                                                                                        subscription.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                                Cancel
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-slate-100 rounded-full p-3 mb-4">
                                    <FileText className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No subscriptions found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm ||
                                    statusFilter !== "all" ||
                                    timeFilter !== "all"
                                        ? "No subscriptions match your search criteria. Try adjusting your filters."
                                        : "There are no subscriptions in the system yet."}
                                </p>
                                {canCreateSubscriptions &&
                                    !searchTerm &&
                                    statusFilter === "all" &&
                                    timeFilter === "all" && (
                                        <Button asChild>
                                            <Link
                                                href={route(
                                                    "subscriptions.create"
                                                )}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                New Subscription
                                            </Link>
                                        </Button>
                                    )}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredAndSortedSubscriptions.length > 0 &&
                            totalPages > 1 && (
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.max(prev - 1, 1)
                                                    )
                                                }
                                                className={
                                                    currentPage === 1
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>

                                        {getPaginationItems()}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.min(
                                                            prev + 1,
                                                            totalPages
                                                        )
                                                    )
                                                }
                                                className={
                                                    currentPage === totalPages
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                    </CardContent>

                    {filteredAndSortedSubscriptions.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>
                                        {Math.min(
                                            startIndex + 1,
                                            filteredAndSortedSubscriptions.length
                                        )}
                                        -
                                        {Math.min(
                                            endIndex,
                                            filteredAndSortedSubscriptions.length
                                        )}
                                    </strong>{" "}
                                    of{" "}
                                    <strong>
                                        {filteredAndSortedSubscriptions.length}
                                    </strong>{" "}
                                    subscriptions
                                </div>
                                <div className="flex items-center gap-1">
                                    {statusFilter !== "all" && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Status: {statusFilter}
                                        </span>
                                    )}
                                    {timeFilter !== "all" && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Filter:{" "}
                                            {timeFilter === "active"
                                                ? "Active Only"
                                                : timeFilter ===
                                                  "pending-approval"
                                                ? "Pending Approval"
                                                : timeFilter === "renewing-soon"
                                                ? "Renewing Soon"
                                                : "Ending Soon"}
                                        </span>
                                    )}
                                    {searchTerm && (
                                        <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100">
                                            Search: "{searchTerm}"
                                        </span>
                                    )}
                                    {(searchTerm ||
                                        statusFilter !== "all" ||
                                        timeFilter !== "all") && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setStatusFilter("all");
                                                setTimeFilter("all");
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

            {/* Cancel Subscription Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this subscription?
                            This action can be undone by an administrator, but
                            will immediately stop billing and service for this
                            customer.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Cancellation Reason
                            </label>
                            <Input placeholder="Enter reason for cancellation" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmCancel}>
                            Confirm Cancellation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default SubscriptionsIndex;
