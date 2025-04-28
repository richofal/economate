import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    FileText,
    ChevronLeft,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock8,
    Users,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Sales, PageProps, Offer } from "@/types";

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
import { Progress } from "@/Components/ui/progress";

interface SalesShowProps extends PageProps {
    sales: Sales;
}

const SalesShow = () => {
    const { sales, canViewSales } = usePage<SalesShowProps>().props;
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
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Get offer status badge
    const getOfferStatusBadge = (status?: string) => {
        if (!status) return <Badge variant="outline">Unknown</Badge>;

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
                        <CheckCircle className="h-3 w-3" /> Accepted
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                    >
                        <XCircle className="h-3 w-3" /> Rejected
                    </Badge>
                );
            case "expired":
                return (
                    <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        <Clock8 className="h-3 w-3" /> Expired
                    </Badge>
                );
            case "converted":
                return (
                    <Badge
                        variant="default"
                        className="flex items-center gap-1"
                    >
                        <CheckCircle className="h-3 w-3" /> Converted
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate offer statistics
    const calculateOfferStats = () => {
        const createdOffers = sales.created_offers || [];

        const totalOffers = createdOffers.length;
        const pendingOffers = createdOffers.filter(
            (o: { status: string }) => o.status === "pending"
        ).length;
        const acceptedOffers = createdOffers.filter(
            (o: { status: string }) => o.status === "accepted"
        ).length;
        const rejectedOffers = createdOffers.filter(
            (o: { status: string }) => o.status === "rejected"
        ).length;
        const expiredOffers = createdOffers.filter(
            (o: { status: string }) => o.status === "expired"
        ).length;
        const convertedOffers = createdOffers.filter(
            (o: { status: string }) => o.status === "converted"
        ).length;

        const acceptanceRate = totalOffers
            ? Math.round((acceptedOffers / totalOffers) * 100)
            : 0;

        const conversionRate = acceptedOffers
            ? Math.round((convertedOffers / acceptedOffers) * 100)
            : 0;

        // Calculate total value of ACCEPTED and CONVERTED offers only
        let totalValue = 0;
        createdOffers.forEach(
            (offer: { status: string; product_price: { price: any } }) => {
                if (
                    (offer.status === "accepted" ||
                        offer.status === "converted") &&
                    offer.product_price?.price
                ) {
                    totalValue += parseFloat(String(offer.product_price.price));
                }
            }
        );

        return {
            totalOffers,
            pendingOffers,
            acceptedOffers,
            rejectedOffers,
            expiredOffers,
            convertedOffers,
            acceptanceRate,
            conversionRate,
            totalValue,
        };
    };

    const offerStats = calculateOfferStats();

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
                            representative details.
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Sales Rep: ${sales.name}`} />

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
                            <BreadcrumbLink href={route("sales.index")}>
                                Sales
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>{sales.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Card */}
                <Card className="">
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {sales.name}
                                </h1>
                                <p className="text-muted-foreground">Sales</p>
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
                                    {offerStats.totalOffers}
                                </span>
                            </Badge>
                            <div className="flex space-x-2">
                                <Button variant="outline" asChild>
                                    <Link href={route("sales.index")}>
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle>Profile Information</CardTitle>
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
                                            {sales.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">Phone</div>
                                        <div className="text-sm text-muted-foreground">
                                            {sales.phone || "Not provided"}
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
                                            {sales.address || "Not provided"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                    ACCOUNT INFORMATION
                                </h3>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <div className="font-medium">
                                            Member Since
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(sales.created_at)}
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
                                            {formatDate(sales.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>
                                            Sales Representative Overview
                                        </CardTitle>
                                        <CardDescription>
                                            Performance metrics and offer
                                            history
                                        </CardDescription>
                                    </div>
                                    <TabsList>
                                        <TabsTrigger value="overview">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="offers">
                                            Offers
                                            {offerStats.totalOffers > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    {offerStats.totalOffers}
                                                </Badge>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="overview" className="mt-0">
                                    {/* Performance Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Total Offers
                                                    </div>
                                                    <FileText className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offerStats.totalOffers}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Accepted Offers
                                                    </div>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offerStats.acceptedOffers}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-medium text-sm text-muted-foreground">
                                                        Converted Offers
                                                    </div>
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <div className="text-2xl font-bold mt-2">
                                                    {offerStats.convertedOffers}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Performance Metrics */}
                                    <div className="space-y-6 mb-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-medium">
                                                    Acceptance Rate
                                                </h3>
                                                <span className="text-sm font-medium">
                                                    {offerStats.acceptanceRate}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    offerStats.acceptanceRate
                                                }
                                                className="h-2"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Percentage of offers that were
                                                accepted by leads
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-medium">
                                                    Conversion Rate
                                                </h3>
                                                <span className="text-sm font-medium">
                                                    {offerStats.conversionRate}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    offerStats.conversionRate
                                                }
                                                className="h-2"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Percentage of accepted offers
                                                that were converted to customers
                                            </p>
                                        </div>
                                    </div>

                                    {/* Offer Status Breakdown */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium mb-3">
                                            Offer Status Breakdown
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-blue-700 font-medium">
                                                    Pending
                                                </div>
                                                <div className="text-lg font-bold text-blue-700">
                                                    {offerStats.pendingOffers}
                                                </div>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-green-700 font-medium">
                                                    Accepted
                                                </div>
                                                <div className="text-lg font-bold text-green-700">
                                                    {offerStats.acceptedOffers}
                                                </div>
                                            </div>
                                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-red-700 font-medium">
                                                    Rejected
                                                </div>
                                                <div className="text-lg font-bold text-red-700">
                                                    {offerStats.rejectedOffers}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-gray-700 font-medium">
                                                    Expired
                                                </div>
                                                <div className="text-lg font-bold text-gray-700">
                                                    {offerStats.expiredOffers}
                                                </div>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                                                <div className="text-xs text-purple-700 font-medium">
                                                    Converted
                                                </div>
                                                <div className="text-lg font-bold text-purple-700">
                                                    {offerStats.convertedOffers}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Value */}
                                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 p-2 rounded-full">
                                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-blue-800 font-medium">
                                                        Total Value of Offers
                                                    </div>
                                                    <div className="text-xl font-bold text-blue-900">
                                                        {formatCurrency(
                                                            offerStats.totalValue
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Offer Activity */}
                                    {offerStats.totalOffers > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-medium mb-3">
                                                Recent Offer Activity
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
                                                        {sales.created_offers
                                                            ?.slice(0, 5)
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
                                                                            {offer
                                                                                .product_price
                                                                                ?.product
                                                                                ?.name ||
                                                                                "Unknown Product"}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {getOfferStatusBadge(
                                                                                offer.status
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
                                            {offerStats.totalOffers > 5 && (
                                                <div className="text-center mt-3">
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
                                    )}
                                </TabsContent>

                                <TabsContent value="offers" className="mt-0">
                                    {offerStats.totalOffers > 0 ? (
                                        <div className="rounded-md border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Offer #
                                                        </TableHead>
                                                        <TableHead>
                                                            Customer
                                                        </TableHead>
                                                        <TableHead>
                                                            Product
                                                        </TableHead>
                                                        <TableHead>
                                                            Price
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
                                                    {sales.created_offers?.map(
                                                        (offer: Offer) => (
                                                            <TableRow
                                                                key={offer.id}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    <Link
                                                                        href={route(
                                                                            "offers.show",
                                                                            offer.id
                                                                        )}
                                                                        className="text-blue-600 hover:underline"
                                                                    >
                                                                        {
                                                                            offer.offer_number
                                                                        }
                                                                    </Link>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {offer.user
                                                                        ?.name ||
                                                                        "Unknown"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {offer
                                                                        .product_price
                                                                        ?.product
                                                                        ?.name ||
                                                                        "Unknown"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatCurrency(
                                                                        offer
                                                                            .product_price
                                                                            ?.price
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getOfferStatusBadge(
                                                                        offer.status
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
                                                No Offers Created Yet
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                                                This sales representative hasn't
                                                created any offers yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            {/* The content is now moved into TabsContent components inside the Tabs component */}
                        </CardContent>
                        <CardFooter className="border-t bg-slate-50 text-sm text-muted-foreground">
                            Last updated: {formatDate(sales.updated_at, true)}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SalesShow;
