import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Search, X, Eye, ChevronDown, FileText, Filter } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Offer, PageProps } from "@/types";

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
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface OfferPageProps extends PageProps {
    offers: Offer[];
    canViewOffers: boolean;
}

const OffersIndex = () => {
    const { offers, canViewOffers } = usePage<OfferPageProps>().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    console.log("Offers:", offers);

    // Filter offers based on search term and status
    const filteredOffers = offers.filter((offer) => {
        const matchesSearch =
            offer.offer_number
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            offer.user?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            offer.user?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            offer.product_price?.product?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            offer.created_by?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (offer.status &&
                offer.status.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
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

    // Get status badge
    const getStatusBadge = (status?: string) => {
        if (!status) return <Badge variant="outline">Unknown</Badge>;

        switch (status.toLowerCase()) {
            case "pending":
                return <Badge variant="destructive">Pending</Badge>;
            case "accepted":
                return <Badge variant="default">Accepted</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            case "expired":
                return <Badge variant="secondary">Expired</Badge>;
            case "converted":
                return <Badge variant="default">Converted</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate status counts
    const statusCounts = {
        all: offers.length,
        pending: offers.filter((o) => o.status === "pending").length,
        accepted: offers.filter((o) => o.status === "accepted").length,
        rejected: offers.filter((o) => o.status === "rejected").length,
        expired: offers.filter((o) => o.status === "expired").length,
        converted: offers.filter((o) => o.status === "converted").length,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Offers Management" />

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
                            <BreadcrumbLink>Offers</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-none shadow-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2.5 rounded-full">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Offers Management
                                    </h1>
                                    <p className="text-muted-foreground">
                                        View and manage customer offers
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 bg-white shadow-sm"
                                >
                                    <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    <span className="font-medium">
                                        Total Offers:
                                    </span>
                                    <span className="ml-1 text-primary font-semibold">
                                        {offers.length}
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card className="bg-white">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    Pending
                                </span>
                                <span className="text-2xl font-bold">
                                    {statusCounts.pending}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    Accepted
                                </span>
                                <span className="text-2xl font-bold">
                                    {statusCounts.accepted}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    Rejected
                                </span>
                                <span className="text-2xl font-bold">
                                    {statusCounts.rejected}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    Expired
                                </span>
                                <span className="text-2xl font-bold">
                                    {statusCounts.expired}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardContent className="p-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    Converted
                                </span>
                                <span className="text-2xl font-bold">
                                    {statusCounts.converted}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                                <CardTitle>All Offers</CardTitle>
                                <CardDescription>
                                    View all offers in the system
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
                                        All Statuses
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="accepted">
                                        Accepted
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="expired">
                                        Expired
                                    </SelectItem>
                                    <SelectItem value="converted">
                                        Converted
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
                                placeholder="Search offers by number, customer, product or sales rep..."
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

                        {filteredOffers.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Offer #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOffers.map((offer) => (
                                            <TableRow key={offer.id}>
                                                <TableCell className="font-medium">
                                                    {offer.offer_number}
                                                </TableCell>
                                                <TableCell>
                                                    {offer.user ? (
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {
                                                                    offer.user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {
                                                                    offer.user
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        "Unknown"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {offer.product_price
                                                        ?.product?.name ||
                                                        "Unknown"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(
                                                        offer.product_price
                                                            ?.price
                                                    )}
                                                    {offer.product_price
                                                        ?.billing_cycle && (
                                                        <span className="text-xs text-muted-foreground block">
                                                            {
                                                                offer
                                                                    .product_price
                                                                    .billing_cycle
                                                            }
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(
                                                        offer.status
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {offer.created_by?.name ||
                                                        "Unknown"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        offer.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <span>
                                                                    View
                                                                </span>
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "offers.show",
                                                                        offer.id
                                                                    )}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {/* Add more actions based on permissions */}
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
                                    <Search className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="mb-1 text-lg font-semibold">
                                    No offers found
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm || statusFilter !== "all"
                                        ? "No offers match your search criteria. Try adjusting your filters."
                                        : "There are no offers in the system yet."}
                                </p>
                            </div>
                        )}
                    </CardContent>

                    {offers.length > 0 && (
                        <CardFooter className="border-t px-6 py-4">
                            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
                                <div>
                                    Showing{" "}
                                    <strong>{filteredOffers.length}</strong> of{" "}
                                    <strong>{offers.length}</strong> offers
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
        </AuthenticatedLayout>
    );
};

export default OffersIndex;
