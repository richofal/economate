import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    ChevronLeft,
    CreditCard,
    Clock,
    Edit,
    ShoppingCart,
    Building,
    CheckCircle,
    XCircle,
    Package,
    Users,
    DollarSign,
    Plus,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Customer, PageProps, Subscription } from "@/types";

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
import { Progress } from "@/Components/ui/progress";

interface CustomerShowProps extends PageProps {
    customer: Customer;
    canViewCustomers: boolean;
}

const CustomerShow = () => {
    const { customer, canViewCustomers } = usePage<CustomerShowProps>().props;
    const [activeTab, setActiveTab] = useState("overview");

    // Format date function
    const formatDate = (dateString?: string, includeTime: boolean = false) => {
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

    // Calculate customer statistics
    const calculateCustomerStats = () => {
        const subscriptions = customer.subscriptions || [];

        const totalSubscriptions = subscriptions.length;
        const activeSubscriptions = subscriptions.filter(
            (s) => s.status === "active"
        );
        const pendingSubscriptions = subscriptions.filter(
            (s) => s.status === "pending"
        );
        const cancelledSubscriptions = subscriptions.filter(
            (s) => s.status === "cancelled"
        );
        const expiredSubscriptions = subscriptions.filter(
            (s) => s.status === "expired"
        );

        // Calculate monthly recurring revenue from active subscriptions
        const monthlyRecurringRevenue = activeSubscriptions.reduce(
            (total, sub) => {
                // Check if billing cycle is monthly, otherwise convert to monthly equivalent
                let monthlyValue = sub.product_price?.price || 0;
                if (
                    sub.product_price?.billing_cycle === "annually" ||
                    sub.product_price?.billing_cycle === "yearly"
                ) {
                    monthlyValue = (sub.product_price?.price || 0) / 12;
                } else if (sub.product_price?.billing_cycle === "quarterly") {
                    monthlyValue = (sub.product_price?.price || 0) / 3;
                } else if (
                    sub.product_price?.billing_cycle === "semi-annually" ||
                    sub.product_price?.billing_cycle === "biannually"
                ) {
                    monthlyValue = (sub.product_price?.price || 0) / 6;
                }
                return total + monthlyValue;
            },
            0
        );

        // Calculate total contract value (sum of all active subscriptions for their full terms)
        const totalContractValue = activeSubscriptions.reduce((total, sub) => {
            const contractLength = sub.contract_length_months || 12; // Default to 12 if not specified
            let subscriptionValue = sub.product_price?.price || 0;

            // Multiply by the number of billing cycles in the contract
            if (sub.product_price?.billing_cycle === "monthly") {
                subscriptionValue *= contractLength;
            } else if (sub.product_price?.billing_cycle === "quarterly") {
                subscriptionValue *= contractLength / 3;
            } else if (
                sub.product_price?.billing_cycle === "semi-annually" ||
                sub.product_price?.billing_cycle === "biannually"
            ) {
                subscriptionValue *= contractLength / 6;
            } else if (
                sub.product_price?.billing_cycle === "annually" ||
                sub.product_price?.billing_cycle === "yearly"
            ) {
                subscriptionValue *= contractLength / 12;
            }

            return total + subscriptionValue;
        }, 0);

        const customerSince = customer.created_at
            ? formatDate(customer.created_at)
            : "-";

        return {
            totalSubscriptions,
            activeSubscriptionCount: activeSubscriptions.length,
            pendingSubscriptionCount: pendingSubscriptions.length,
            cancelledSubscriptionCount: cancelledSubscriptions.length,
            expiredSubscriptionCount: expiredSubscriptions.length,
            monthlyRecurringRevenue,
            totalContractValue,
            customerSince,
            nextBillingDate:
                activeSubscriptions.length > 0
                    ? activeSubscriptions.sort(
                          (a, b) =>
                              new Date(a.next_billing_date || "").getTime() -
                              new Date(b.next_billing_date || "").getTime()
                      )[0]?.next_billing_date
                    : null,
        };
    };

    const customerStats = calculateCustomerStats();

    if (!canViewCustomers) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>
                            You don't have permission to view customer details.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Customer: ${customer.name}`} />

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
                                Customers
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>{customer.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-none shadow-sm">
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {customer.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    Customer since {customerStats.customerSince}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className="flex space-x-2">
                                <Button variant="outline" asChild>
                                    <Link href={route("customers.index")}>
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle>Customer Profile</CardTitle>
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
                                            {customer.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div className="text-sm text-muted-foreground">
                                            {customer.phone || "Not provided"}
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
                                            {customer.address || "Not provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Subscription Summary */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    SUBSCRIPTION SUMMARY
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Monthly Recurring Revenue
                                        </span>
                                        <span className="font-semibold text-primary">
                                            {formatCurrency(
                                                customerStats.monthlyRecurringRevenue
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Total Contract Value
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(
                                                customerStats.totalContractValue
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                            Active Subscriptions
                                        </span>
                                        <span className="font-semibold">
                                            {
                                                customerStats.activeSubscriptionCount
                                            }
                                        </span>
                                    </div>

                                    {customerStats.nextBillingDate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">
                                                Next Billing Date
                                            </span>
                                            <span className="font-semibold">
                                                {formatDate(
                                                    customerStats.nextBillingDate
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />
                        </CardContent>
                    </Card>

                    {/* Main Content Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>
                                        Subscription Management
                                    </CardTitle>
                                    <CardDescription>
                                        View and manage customer subscriptions
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <TabsList>
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="active">
                                        Active
                                        {customerStats.activeSubscriptionCount >
                                            0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {
                                                    customerStats.activeSubscriptionCount
                                                }
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-4">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <Card className="bg-blue-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-blue-800">
                                                        Total
                                                    </div>
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-blue-900 mt-2">
                                                    {
                                                        customerStats.totalSubscriptions
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
                                                        customerStats.activeSubscriptionCount
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-amber-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-amber-800">
                                                        Pending
                                                    </div>
                                                    <Clock className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-amber-900 mt-2">
                                                    {
                                                        customerStats.pendingSubscriptionCount
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-red-50 border-none">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-red-800">
                                                        Cancelled
                                                    </div>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                </div>
                                                <div className="text-2xl font-bold text-red-900 mt-2">
                                                    {
                                                        customerStats.cancelledSubscriptionCount
                                                    }
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Revenue Card */}
                                    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-none mb-6">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold text-indigo-900">
                                                        Monthly Recurring
                                                        Revenue
                                                    </h3>
                                                    <p className="text-sm text-indigo-700">
                                                        Current MRR from all
                                                        active subscriptions
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-6 w-6 text-indigo-500" />
                                                    <span className="text-3xl font-bold text-indigo-900">
                                                        {formatCurrency(
                                                            customerStats.monthlyRecurringRevenue
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Active Subscriptions */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium mb-3">
                                            Active Subscriptions
                                        </h3>

                                        {customerStats.activeSubscriptionCount >
                                        0 ? (
                                            <div className="rounded-md border overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Subscription #
                                                            </TableHead>
                                                            <TableHead>
                                                                Product
                                                            </TableHead>
                                                            <TableHead>
                                                                Fee
                                                            </TableHead>
                                                            <TableHead>
                                                                Next Billing
                                                            </TableHead>
                                                            <TableHead>
                                                                Auto Renew
                                                            </TableHead>
                                                            <TableHead>
                                                                Status
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {customer.subscriptions
                                                            ?.filter(
                                                                (sub) =>
                                                                    sub.status ===
                                                                    "active"
                                                            )
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
                                                                            {subscription
                                                                                .product_price
                                                                                ?.product
                                                                                ?.name ||
                                                                                "Unknown"}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatCurrency(
                                                                                subscription
                                                                                    .product_price
                                                                                    ?.price
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatDate(
                                                                                subscription.next_billing_date
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {subscription.auto_renew ? (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="bg-green-50 text-green-700 border-green-200"
                                                                                >
                                                                                    Yes
                                                                                </Badge>
                                                                            ) : (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="bg-slate-50 text-slate-700 border-slate-200"
                                                                                >
                                                                                    No
                                                                                </Badge>
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
                                            <Card className="bg-slate-50 border">
                                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                                    <FileText className="h-8 w-8 text-slate-400 mb-2" />
                                                    <h4 className="text-base font-medium">
                                                        No Active Subscriptions
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        This customer doesn't
                                                        have any active
                                                        subscriptions yet.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Pending Subscriptions */}
                                    {customerStats.pendingSubscriptionCount >
                                        0 && (
                                        <div>
                                            <h3 className="text-sm font-medium mb-3">
                                                Pending Subscriptions
                                            </h3>
                                            <div className="rounded-md border overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Subscription #
                                                            </TableHead>
                                                            <TableHead>
                                                                Product
                                                            </TableHead>
                                                            <TableHead>
                                                                Fee
                                                            </TableHead>
                                                            <TableHead>
                                                                Start Date
                                                            </TableHead>
                                                            <TableHead>
                                                                Approval
                                                            </TableHead>
                                                            <TableHead>
                                                                Status
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {customer.subscriptions
                                                            ?.filter(
                                                                (sub) =>
                                                                    sub.status ===
                                                                    "pending"
                                                            )
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
                                                                            {subscription
                                                                                .product_price
                                                                                ?.product
                                                                                ?.name ||
                                                                                "Unknown"}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatCurrency(
                                                                                subscription
                                                                                    .product_price
                                                                                    ?.price
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatDate(
                                                                                subscription.start_date
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {subscription.approval_requested_at ? (
                                                                                <Badge
                                                                                    variant="destructive"
                                                                                    className="flex items-center gap-1"
                                                                                >
                                                                                    <Clock className="h-3 w-3" />{" "}
                                                                                    Awaiting
                                                                                    Approval
                                                                                </Badge>
                                                                            ) : (
                                                                                <span className="text-sm text-muted-foreground">
                                                                                    Not
                                                                                    requested
                                                                                </span>
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getSubscriptionStatusBadge(
                                                                                "pending"
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="active" className="mt-4">
                                    {customerStats.activeSubscriptionCount >
                                    0 ? (
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Subscription #
                                                        </TableHead>
                                                        <TableHead>
                                                            Product
                                                        </TableHead>
                                                        <TableHead>
                                                            Price
                                                        </TableHead>
                                                        <TableHead>
                                                            Start Date
                                                        </TableHead>
                                                        <TableHead>
                                                            End Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Next Billing
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {customer.subscriptions
                                                        ?.filter(
                                                            (sub) =>
                                                                sub.status ===
                                                                "active"
                                                        )
                                                        .map((subscription) => (
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
                                                                    {subscription
                                                                        .product_price
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Unknown"}
                                                                </TableCell>
                                                                <TableCell>
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
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        subscription.start_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        subscription.end_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        subscription.next_billing_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getSubscriptionStatusBadge(
                                                                        "active"
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border rounded-md bg-slate-50">
                                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Active Subscriptions
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                                This customer doesn't have any
                                                active subscriptions yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="all" className="mt-4">
                                    {customerStats.totalSubscriptions > 0 ? (
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Subscription #
                                                        </TableHead>
                                                        <TableHead>
                                                            Product
                                                        </TableHead>
                                                        <TableHead>
                                                            Price
                                                        </TableHead>
                                                        <TableHead>
                                                            Term
                                                        </TableHead>
                                                        <TableHead>
                                                            Approved By
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {customer.subscriptions?.map(
                                                        (subscription) => (
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
                                                                    {subscription
                                                                        .product_price
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Unknown"}
                                                                </TableCell>
                                                                <TableCell>
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
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="text-sm">
                                                                        <div>
                                                                            Start:{" "}
                                                                            {formatDate(
                                                                                subscription.start_date
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            End:{" "}
                                                                            {formatDate(
                                                                                subscription.end_date
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {subscription.approved_by ? (
                                                                        <div className="text-sm">
                                                                            {
                                                                                subscription
                                                                                    .approved_by
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Not
                                                                            approved
                                                                        </span>
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
                                        <div className="text-center py-12 border rounded-md bg-slate-50">
                                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Subscriptions Found
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                                This customer doesn't have any
                                                subscriptions yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="border-t bg-slate-50 text-sm text-muted-foreground">
                            Last updated:{" "}
                            {formatDate(customer.updated_at, true)}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CustomerShow;
