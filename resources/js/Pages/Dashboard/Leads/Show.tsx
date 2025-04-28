"use client";

import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    User,
    Clock,
    CircleCheck,
    CircleX,
    FileText,
    Share2,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps, Lead, Offer } from "@/types";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Badge } from "@/Components/ui/badge";

interface LeadShowProps extends PageProps {
    lead: Lead;
    offers: Offer[];
    canCreateOffers: boolean;
}

const LeadShow = () => {
    const { lead, offers, canCreateOffers } = usePage<LeadShowProps>().props;
    const [activeTab, setActiveTab] = useState("overview");

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

    // Function to get initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Function to get offer status badge
    const getOfferStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <Clock className="h-3 w-3" /> Pending
                    </Badge>
                );
            case "accepted":
                return (
                    <Badge
                        variant="default"
                        className="flex items-center gap-1"
                    >
                        <CircleCheck className="h-3 w-3" /> Accepted
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <CircleX className="h-3 w-3" /> Rejected
                    </Badge>
                );
            case "expired":
                return (
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                    >
                        <Clock className="h-3 w-3" /> Expired
                    </Badge>
                );
            case "converted":
                return (
                    <Badge
                        variant="default"
                        className="flex items-center gap-1"
                    >
                        <Share2 className="h-3 w-3" /> Converted
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Helper function to safely get product name
    const getProductName = (offer: Offer) => {
        if (!offer.product_price) return "Unknown Product";
        if (!offer.product_price.product) return "Unknown Product";
        return offer.product_price.product.name || "Unknown Product";
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Lead: ${lead.name}`} />

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
                            <BreadcrumbLink href={route("leads.index")}>
                                Leads
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>{lead.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card>
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Lead Details
                                </h1>
                                <p className="text-muted-foreground">
                                    View lead information and related offers
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 bg-white shadow-sm"
                            >
                                <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                <span className="font-medium">Offers:</span>
                                <span className="ml-1 text-primary font-semibold">
                                    {offers.length}
                                </span>
                            </Badge>
                            <Button variant="outline" asChild>
                                <Link href={route("leads.index")}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back to Leads
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Lead Profile Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Basic contact details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center text-center mb-6">
                                <h2 className="text-xl font-bold">
                                    {lead.name}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Email</div>
                                        <div className="text-sm text-muted-foreground break-all">
                                            {lead.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div className="text-sm text-muted-foreground">
                                            {lead.phone || "Not provided"}
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
                                            {lead.address || "Not provided"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">
                                            Member Since
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(lead.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Lead Overview</CardTitle>
                                    <CardDescription>
                                        Offers and activity
                                    </CardDescription>
                                </div>
                                {canCreateOffers && (
                                    <Button asChild>
                                    <Link
                                            href={route(
                                                "leads.offers",
                                                lead.id
                                            )}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Create Offer
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="mb-4">
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="offers">
                                        Offers
                                        {offers.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {offers.length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Total Offers
                                                    </div>
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offers.length || 0}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Pending Offers
                                                    </div>
                                                    <Clock className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offers.filter(
                                                        (offer) =>
                                                            offer.status.toLowerCase() ===
                                                            "pending"
                                                    ).length || 0}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Accepted Offers
                                                    </div>
                                                    <CircleCheck className="h-4 w-4 text-green-500" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offers.filter(
                                                        (offer) =>
                                                            offer.status.toLowerCase() ===
                                                            "accepted"
                                                    ).length || 0}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {offers && offers.length > 0 ? (
                                        <div>
                                            <h3 className="text-lg font-medium mb-3">
                                                Recent Offers
                                            </h3>
                                            <div className="rounded-md border overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Offer #
                                                            </TableHead>
                                                            <TableHead>
                                                                Product
                                                            </TableHead>
                                                            <TableHead>
                                                                Status
                                                            </TableHead>
                                                            <TableHead>
                                                                Date
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {offers
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    offer: Offer
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            offer.id
                                                                        }
                                                                    >
                                                                        <TableCell className="font-medium">
                                                                            {
                                                                                offer.offer_number
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getProductName(
                                                                                offer
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getOfferStatusBadge(
                                                                                String(
                                                                                    offer.status
                                                                                )
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {formatDate(
                                                                                offer.created_at
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {offers.length > 5 && (
                                                <div className="text-center mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setActiveTab(
                                                                "offers"
                                                            )
                                                        }
                                                    >
                                                        View All Offers
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 border rounded-md bg-slate-50">
                                            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Offers Yet
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                                This lead doesn't have any
                                                offers yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="offers" className="mt-0">
                                    {offers && offers.length > 0 ? (
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Offer #
                                                        </TableHead>
                                                        <TableHead>
                                                            Product
                                                        </TableHead>
                                                        <TableHead>
                                                            Price
                                                        </TableHead>
                                                        <TableHead>
                                                            Billing
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Created By
                                                        </TableHead>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {offers.map(
                                                        (offer: Offer) => (
                                                            <TableRow
                                                                key={offer.id}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {
                                                                        offer.offer_number
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getProductName(
                                                                        offer
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {offer.product_price ? (
                                                                        <span className="font-medium">
                                                                            $
                                                                            {
                                                                                offer
                                                                                    .product_price
                                                                                    .price
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {offer.product_price ? (
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {
                                                                                    offer
                                                                                        .product_price
                                                                                        .billing_cycle
                                                                                }
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {
                                                                                    offer
                                                                                        .product_price
                                                                                        .term_months
                                                                                }{" "}
                                                                                month
                                                                                {offer
                                                                                    .product_price
                                                                                    .term_months !==
                                                                                1
                                                                                    ? "s"
                                                                                    : ""}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getOfferStatusBadge(
                                                                        offer.status
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {offer.created_by ? (
                                                                        <HoverCard>
                                                                            <HoverCardTrigger
                                                                                asChild
                                                                            >
                                                                                <span className="cursor-help underline underline-offset-4 text-sm">
                                                                                    {
                                                                                        offer
                                                                                            .created_by
                                                                                            .name
                                                                                    }
                                                                                </span>
                                                                            </HoverCardTrigger>
                                                                            <HoverCardContent className="w-80">
                                                                                <div className="flex justify-between space-x-4">
                                                                                    <div className="space-y-1">
                                                                                        <h4 className="text-sm font-semibold">
                                                                                            {
                                                                                                offer
                                                                                                    .created_by
                                                                                                    .name
                                                                                            }
                                                                                        </h4>
                                                                                        <p className="text-sm text-muted-foreground">
                                                                                            {
                                                                                                offer
                                                                                                    .created_by
                                                                                                    .email
                                                                                            }
                                                                                        </p>
                                                                                        <div className="flex items-center pt-2">
                                                                                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                Sales
                                                                                                Rep
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </HoverCardContent>
                                                                        </HoverCard>
                                                                    ) : (
                                                                        "Unknown"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatDate(
                                                                        offer.created_at
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
                                                No Offers Found
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                This lead doesn't have any
                                                offers yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="border-t bg-slate-50 text-sm text-muted-foreground">
                            Last updated: {formatDate(lead.updated_at, true)}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default LeadShow;
