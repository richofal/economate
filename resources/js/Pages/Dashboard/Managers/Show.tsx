"use client";

import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Shield,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ChevronLeft,
    Clock,
    CheckCircle,
    XCircle,
    Edit,
    CheckSquare,
    DollarSign,
    BarChart,
    AlertCircle,
    FilterX,
    X,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { Manager, PageProps } from "@/types";

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
import { Badge } from "@/Components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface ManagerShowProps extends PageProps {
    manager: Manager;
    canViewManagers: boolean;
    canEditManagers?: boolean;
}

const ManagerShow = () => {
    const { manager, canViewManagers, canEditManagers } =
        usePage<ManagerShowProps>().props;
    const [activeTab, setActiveTab] = useState("overview");
    const [statusFilter, setStatusFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");

    // Format date function
    const formatDate = (dateString?: string, includeTime = false) => {
        if (!dateString) return "-";

        if (includeTime) {
            return new Date(dateString).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

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
            case "pending":
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

    // Calculate manager approval statistics
    const calculateApprovalStats = () => {
        const approvals = manager.approvedSubscriptions || [];

        const totalApprovals = approvals.length;

        // Approval types by status
        const activeApprovals = approvals.filter(
            (s) => s.status === "active"
        ).length;
        const pendingApprovals = approvals.filter(
            (s) => s.status === "pending"
        ).length;
        const cancelledApprovals = approvals.filter(
            (s) => s.status === "cancelled"
        ).length;

        // Calculate approvals by time period
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);

        const thisYear = now.getFullYear();

        const lastThirtyDaysApprovals = approvals.filter((a) => {
            if (!a.approved_at) return false;
            return new Date(a.approved_at) >= thirtyDaysAgo;
        }).length;

        const lastNinetyDaysApprovals = approvals.filter((a) => {
            if (!a.approved_at) return false;
            return new Date(a.approved_at) >= ninetyDaysAgo;
        }).length;

        const thisYearApprovals = approvals.filter((a) => {
            if (!a.approved_at) return false;
            return new Date(a.approved_at).getFullYear() === thisYear;
        }).length;

        // Calculate total contract value of approved subscriptions
        const totalContractValue = approvals.reduce((total, sub) => {
            if (!sub.product_price?.price) return total;

            const contractLength = sub.contract_length_months || 12; // Default to 12 if not specified
            let subscriptionValue = sub.product_price.price;

            // Multiply by the number of billing cycles in the contract
            if (sub.product_price.billing_cycle === "monthly") {
                subscriptionValue *= contractLength;
            } else if (sub.product_price.billing_cycle === "quarterly") {
                subscriptionValue *= contractLength / 3;
            } else if (
                sub.product_price.billing_cycle === "semi-annually" ||
                sub.product_price.billing_cycle === "biannually"
            ) {
                subscriptionValue *= contractLength / 6;
            } else if (
                sub.product_price.billing_cycle === "annually" ||
                sub.product_price.billing_cycle === "yearly"
            ) {
                subscriptionValue *= contractLength / 12;
            }

            return total + subscriptionValue;
        }, 0);

        // Calculate approvals by product category
        const approvalsByCategory = {} as Record<string, number>;
        approvals.forEach((sub) => {
            const category =
                sub.product_price?.product?.category?.name || "Uncategorized";
            approvalsByCategory[category] =
                (approvalsByCategory[category] || 0) + 1;
        });

        return {
            totalApprovals,
            activeApprovals,
            pendingApprovals,
            cancelledApprovals,
            lastThirtyDaysApprovals,
            lastNinetyDaysApprovals,
            thisYearApprovals,
            totalContractValue,
            approvalsByCategory,
        };
    };

    const approvalStats = calculateApprovalStats();

    // Filter approvals based on status and time
    const getFilteredApprovals = () => {
        let filtered = [...(manager.approvedSubscriptions || [])];

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((a) => a.status === statusFilter);
        }

        // Apply time filter
        if (timeFilter !== "all") {
            const now = new Date();
            if (timeFilter === "30days") {
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(now.getDate() - 30);
                filtered = filtered.filter(
                    (a) =>
                        a.approved_at &&
                        new Date(a.approved_at) >= thirtyDaysAgo
                );
            } else if (timeFilter === "90days") {
                const ninetyDaysAgo = new Date(now);
                ninetyDaysAgo.setDate(now.getDate() - 90);
                filtered = filtered.filter(
                    (a) =>
                        a.approved_at &&
                        new Date(a.approved_at) >= ninetyDaysAgo
                );
            } else if (timeFilter === "thisyear") {
                const thisYear = now.getFullYear();
                filtered = filtered.filter(
                    (a) =>
                        a.approved_at &&
                        new Date(a.approved_at).getFullYear() === thisYear
                );
            }
        }

        return filtered;
    };

    const filteredApprovals = getFilteredApprovals();

    if (!canViewManagers) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>
                            You don't have permission to view manager details.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Manager: ${manager.name}`} />

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
                            <BreadcrumbLink href={route("managers.index")}>
                                Managers
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>{manager.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-none shadow-sm">
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {manager.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    System Manager • Member since{" "}
                                    {formatDate(manager.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <CheckSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Approvals:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {approvalStats.totalApprovals}
                                </span>
                            </Badge>
                            <div className="flex space-x-2">
                                <Button variant="outline" asChild>
                                    <Link href={route("managers.index")}>
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>
                                {canEditManagers && (
                                    <Button asChild>
                                        <Link
                                            href={route("managers.edit", {
                                                id: manager.id,
                                            })}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Manager Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle>Manager Profile</CardTitle>
                            <CardDescription>
                                Contact and account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    CONTACT INFORMATION
                                </h3>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Email</div>
                                        <div className="text-sm text-muted-foreground break-all">
                                            {manager.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div className="text-sm text-muted-foreground">
                                            {manager.phone || "Not provided"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">
                                            Address
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {manager.address || "Not provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Account Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    ACCOUNT DETAILS
                                </h3>

                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Role</div>
                                        <div className="text-sm text-muted-foreground">
                                            Manager
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">
                                            Member Since
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(manager.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">
                                            Last Updated
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(manager.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Approval Summary */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    APPROVAL SUMMARY
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Total Approvals
                                        </span>
                                        <span className="font-semibold text-primary">
                                            {approvalStats.totalApprovals}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Active Subscriptions
                                        </span>
                                        <span className="font-semibold">
                                            {approvalStats.activeApprovals}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Last 30 Days
                                        </span>
                                        <span className="font-semibold">
                                            {
                                                approvalStats.lastThirtyDaysApprovals
                                            }
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Total Value Approved
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(
                                                approvalStats.totalContractValue
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Card */}
                    <Card className="lg:col-span-2">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>
                                            Subscription Approvals
                                        </CardTitle>
                                        <CardDescription>
                                            View subscription approvals history
                                        </CardDescription>
                                    </div>
                                    <TabsList>
                                        <TabsTrigger value="overview">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="approvals">
                                            Approvals
                                            {approvalStats.totalApprovals >
                                                0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    {
                                                        approvalStats.totalApprovals
                                                    }
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <TabsContent value="overview" className="mt-0">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <Card className="bg-blue-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-blue-800">
                                                        Total
                                                    </div>
                                                    <CheckSquare className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-blue-900 mt-2">
                                                    {
                                                        approvalStats.totalApprovals
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-green-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-green-800">
                                                        Active
                                                    </div>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-green-900 mt-2">
                                                    {
                                                        approvalStats.activeApprovals
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-amber-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-amber-800">
                                                        Last 30 Days
                                                    </div>
                                                    <Calendar className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-amber-900 mt-2">
                                                    {
                                                        approvalStats.lastThirtyDaysApprovals
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-indigo-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-indigo-800">
                                                        This Year
                                                    </div>
                                                    <BarChart className="h-4 w-4 text-indigo-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-indigo-900 mt-2">
                                                    {
                                                        approvalStats.thisYearApprovals
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Value Card */}
                                    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-none mb-6">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold text-indigo-900">
                                                        Total Contract Value
                                                        Approved
                                                    </h3>
                                                    <p className="text-sm text-indigo-700">
                                                        Lifetime value of
                                                        approved subscription
                                                        contracts
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-6 w-6 text-indigo-500" />
                                                    <span className="text-3xl font-bold text-indigo-900">
                                                        {formatCurrency(
                                                            approvalStats.totalContractValue
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Approvals */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium mb-3">
                                            Recent Approvals
                                        </h3>

                                        {approvalStats.totalApprovals > 0 ? (
                                            <div className="rounded-md border overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Subscription #
                                                            </TableHead>
                                                            <TableHead>
                                                                Customer
                                                            </TableHead>
                                                            <TableHead>
                                                                Product
                                                            </TableHead>
                                                            <TableHead>
                                                                Approved
                                                            </TableHead>
                                                            <TableHead>
                                                                Status
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {manager.approvedSubscriptions
                                                            ?.slice(0, 5)
                                                            .map(
                                                                (
                                                                    subscription
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            subscription.id
                                                                        }
                                                                    >
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
                                                                                <span>
                                                                                    {subscription
                                                                                        .user
                                                                                        ?.name ||
                                                                                        "Unknown"}
                                                                                </span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {subscription
                                                                                .product_price
                                                                                ?.product
                                                                                ?.name ||
                                                                                "Unknown"}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getSubscriptionStatusBadge(
                                                                                subscription.status
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <Card className="bg-slate-50 border">
                                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                                    <CheckSquare className="h-8 w-8 text-slate-400 mb-2" />
                                                    <h4 className="text-base font-medium">
                                                        No Approvals Yet
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        This manager hasn't
                                                        approved any
                                                        subscriptions yet.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {approvalStats.totalApprovals > 5 && (
                                            <div className="text-center mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setActiveTab(
                                                            "approvals"
                                                        )
                                                    }
                                                >
                                                    View All Approvals
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Approval Categories */}
                                    {Object.keys(
                                        approvalStats.approvalsByCategory
                                    ).length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium mb-3">
                                                Approvals by Product Category
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {Object.entries(
                                                    approvalStats.approvalsByCategory
                                                ).map(([category, count]) => (
                                                    <Card
                                                        key={category}
                                                        className="border"
                                                    >
                                                        <CardContent className="p-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium truncate max-w-[150px]">
                                                                    {category}
                                                                </span>
                                                                <Badge variant="secondary">
                                                                    {count}
                                                                </Badge>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="approvals" className="mt-0">
                                    {approvalStats.totalApprovals > 0 ? (
                                        <>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                                <h3 className="text-sm font-medium">
                                                    All Approval History
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <Select
                                                        value={statusFilter}
                                                        onValueChange={
                                                            setStatusFilter
                                                        }
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
                                                            <SelectItem value="pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="cancelled">
                                                                Cancelled
                                                            </SelectItem>
                                                            <SelectItem value="expired">
                                                                Expired
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <Select
                                                        value={timeFilter}
                                                        onValueChange={
                                                            setTimeFilter
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue placeholder="Filter by time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">
                                                                All Time
                                                            </SelectItem>
                                                            <SelectItem value="30days">
                                                                Last 30 Days
                                                            </SelectItem>
                                                            <SelectItem value="90days">
                                                                Last 90 Days
                                                            </SelectItem>
                                                            <SelectItem value="thisyear">
                                                                This Year
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {filteredApprovals.length > 0 ? (
                                                <div className="rounded-md border overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Subscription
                                                                    #
                                                                </TableHead>
                                                                <TableHead>
                                                                    Customer
                                                                </TableHead>
                                                                <TableHead>
                                                                    Product
                                                                </TableHead>
                                                                <TableHead>
                                                                    Contract
                                                                    Value
                                                                </TableHead>
                                                                <TableHead>
                                                                    Approval
                                                                    Date
                                                                </TableHead>
                                                                <TableHead>
                                                                    Status
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {filteredApprovals.map(
                                                                (
                                                                    subscription
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            subscription.id
                                                                        }
                                                                    >
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
                                                                                    href={route(
                                                                                        "customers.show",
                                                                                        {
                                                                                            id: subscription
                                                                                                .user
                                                                                                ?.id,
                                                                                        }
                                                                                    )}
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
                                                                            <div className="flex flex-col">
                                                                                <span>
                                                                                    {subscription
                                                                                        .product_price
                                                                                        ?.product
                                                                                        ?.name ||
                                                                                        "Unknown"}
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    {formatCurrency(
                                                                                        subscription
                                                                                            .product_price
                                                                                            ?.price
                                                                                    )}{" "}
                                                                                    /{" "}
                                                                                    {
                                                                                        subscription
                                                                                            .product_price
                                                                                            ?.billing_cycle
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {(() => {
                                                                                if (
                                                                                    !subscription
                                                                                        .product_price
                                                                                        ?.price ||
                                                                                    !subscription.contract_length_months
                                                                                ) {
                                                                                    return "-";
                                                                                }

                                                                                let contractValue =
                                                                                    subscription
                                                                                        .product_price
                                                                                        .price;
                                                                                const contractLength =
                                                                                    subscription.contract_length_months;
                                                                                const billingCycle =
                                                                                    subscription
                                                                                        .product_price
                                                                                        .billing_cycle;

                                                                                // Calculate total contract value based on billing cycle
                                                                                if (
                                                                                    billingCycle ===
                                                                                    "monthly"
                                                                                ) {
                                                                                    contractValue *=
                                                                                        contractLength;
                                                                                } else if (
                                                                                    billingCycle ===
                                                                                    "quarterly"
                                                                                ) {
                                                                                    contractValue *=
                                                                                        contractLength /
                                                                                        3;
                                                                                } else if (
                                                                                    billingCycle ===
                                                                                        "semi-annually" ||
                                                                                    billingCycle ===
                                                                                        "biannually"
                                                                                ) {
                                                                                    contractValue *=
                                                                                        contractLength /
                                                                                        6;
                                                                                } else if (
                                                                                    billingCycle ===
                                                                                        "annually" ||
                                                                                    billingCycle ===
                                                                                        "yearly"
                                                                                ) {
                                                                                    contractValue *=
                                                                                        contractLength /
                                                                                        12;
                                                                                }

                                                                                return formatCurrency(
                                                                                    contractValue
                                                                                );
                                                                            })()}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {subscription.approval_notes && (
                                                                                <div className="group relative">
                                                                                    <AlertCircle className="inline-block h-3.5 w-3.5 ml-1 text-amber-500 cursor-help" />
                                                                                    <div className="absolute z-10 invisible group-hover:visible bg-slate-800 text-white text-xs rounded p-2 shadow-lg max-w-xs top-full left-0">
                                                                                        <div className="font-semibold mb-1">
                                                                                            Approval
                                                                                            Note:
                                                                                        </div>
                                                                                        {
                                                                                            subscription.approval_notes
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getSubscriptionStatusBadge(
                                                                                subscription.status
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="rounded-md border bg-slate-50 p-6 text-center">
                                                    <FilterX className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                                    <h4 className="text-base font-medium">
                                                        No matching approvals
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        No approvals match your
                                                        current filters.
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setStatusFilter(
                                                                "all"
                                                            );
                                                            setTimeFilter(
                                                                "all"
                                                            );
                                                        }}
                                                    >
                                                        Clear Filters
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 border rounded-md bg-slate-50">
                                            <CheckSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Approvals Found
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                This manager hasn't approved any
                                                subscriptions yet.
                                            </p>
                                        </div>
                                    )}

                                    {filteredApprovals.length > 0 &&
                                        (statusFilter !== "all" ||
                                            timeFilter !== "all") && (
                                            <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    {statusFilter !== "all" && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mr-2"
                                                        >
                                                            Status:{" "}
                                                            {statusFilter}
                                                        </Badge>
                                                    )}
                                                    {timeFilter !== "all" && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mr-2"
                                                        >
                                                            Time:{" "}
                                                            {timeFilter ===
                                                            "30days"
                                                                ? "Last 30 Days"
                                                                : timeFilter ===
                                                                  "90days"
                                                                ? "Last 90 Days"
                                                                : "This Year"}
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setStatusFilter(
                                                                "all"
                                                            );
                                                            setTimeFilter(
                                                                "all"
                                                            );
                                                        }}
                                                    >
                                                        <X className="h-3 w-3 mr-1" />
                                                        Clear
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                        <CardFooter className="border-t bg-slate-50 text-sm text-muted-foreground">
                            Last updated: {formatDate(manager.updated_at, true)}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ManagerShow;
