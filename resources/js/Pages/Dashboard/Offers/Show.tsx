import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    User,
    Package,
    Calendar,
    DollarSign,
    Clock,
    FileText,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    Building,
    CalendarClock,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Offer, PageProps } from "@/types";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Separator } from "@/Components/ui/separator";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Textarea } from "@headlessui/react";

interface OfferShowProps extends PageProps {
    offer: Offer;
    canViewOffers: boolean;
    canManageOffers: boolean;
}

const OfferShow = () => {
    const { offer, canViewOffers, canManageOffers } =
        usePage<OfferShowProps>().props;

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
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const { data, post, processing } = useForm({
        rejection_reason: "",
    });
    const handleAccept = () => {
        post(route("offers.accept", offer.id), {
            onSuccess: () => {
                setShowAcceptDialog(false);
            },
        });
    };

    const handleReject = () => {
        post(route("offers.reject", offer.id), {
            onSuccess: () => {
                setShowRejectDialog(false);
            },
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
                return (
                    <Badge
                        variant="default"
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
                        <AlertCircle className="h-3 w-3" /> Expired
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

    // Calculate pricing details
    const calculatePricing = () => {
        const basePrice = offer.product_price?.price || 0;
        const subtotal = basePrice;
        const total = subtotal;

        // Calculate monthly price if applicable
        let monthlyPrice = 0;
        if (offer.product_price?.billing_cycle === "monthly") {
            monthlyPrice = subtotal;
        } else if (offer.product_price?.billing_cycle === "annual") {
            monthlyPrice = subtotal / 12;
        } else if (offer.product_price?.billing_cycle === "quarterly") {
            monthlyPrice = subtotal / 3;
        } else if (offer.product_price?.billing_cycle === "semi-annual") {
            monthlyPrice = subtotal / 6;
        }

        // Calculate contract value if term_months is available
        const termMonths = offer.product_price?.term_months || 0;
        const contractValue = termMonths * monthlyPrice;

        return {
            basePrice,
            subtotal,
            total,
            monthlyPrice,
            contractValue,
        };
    };

    const pricing = calculatePricing();

    if (!canViewOffers) {
        return (
            <AuthenticatedLayout>
                <Head title="Unauthorized" />
                <div className="container mx-auto py-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                        <h3 className="text-lg font-medium">
                            Unauthorized Access
                        </h3>
                        <p>You don't have permission to view offers.</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Offer: ${offer.offer_number}`} />

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
                            <BreadcrumbLink href={route("offers.index")}>
                                Offers
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>
                                {offer.offer_number}
                            </BreadcrumbLink>
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
                                    Offer: {offer.offer_number}
                                </h1>
                                <p className="text-muted-foreground">
                                    {offer.product_price?.product?.name
                                        ? `Offer for ${offer.product_price.product.name}`
                                        : "Offer details"}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            {getStatusBadge(offer.status)}

                            {/* Action buttons for pending offers */}
                            {canManageOffers && offer.status === "pending" && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        onClick={() =>
                                            setShowAcceptDialog(true)
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Accept
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            setShowRejectDialog(true)
                                        }
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            )}

                            <Button variant="outline" asChild>
                                <Link href={route("offers.index")}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back to Offers
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Offer Details Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Offer Details</CardTitle>
                            <CardDescription>
                                Complete information about this offer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Product Information */}
                            <div>
                                <h3 className="text-lg font-semibold flex items-center mb-3">
                                    <Package className="mr-2 h-5 w-5 text-primary" />
                                    Product Information
                                </h3>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Product
                                                    </p>
                                                    <p className="font-medium">
                                                        {offer.product_price
                                                            ?.product?.name ||
                                                            "Unknown"}
                                                    </p>
                                                </div>
                                                {offer.product_price?.product
                                                    ?.code && (
                                                    <Badge
                                                        variant="outline"
                                                        className="self-start"
                                                    >
                                                        Code:{" "}
                                                        {
                                                            offer.product_price
                                                                .product.code
                                                        }
                                                    </Badge>
                                                )}
                                            </div>

                                            {offer.product_price?.product
                                                ?.description && (
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            offer.product_price
                                                                .product
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Billing Cycle
                                                    </p>
                                                    <p className="font-medium capitalize">
                                                        {offer.product_price
                                                            ?.billing_cycle ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Term Length
                                                    </p>
                                                    <p className="font-medium">
                                                        {offer.product_price
                                                            ?.term_months
                                                            ? `${
                                                                  offer
                                                                      .product_price
                                                                      .term_months
                                                              } ${
                                                                  offer
                                                                      .product_price
                                                                      .term_months ===
                                                                  1
                                                                      ? "month"
                                                                      : "months"
                                                              }`
                                                            : "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Auto Renew
                                                    </p>
                                                    <p className="font-medium">
                                                        {offer.auto_renew
                                                            ? "Yes"
                                                            : "No"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Pricing Information */}
                            <div>
                                <h3 className="text-lg font-semibold flex items-center mb-3">
                                    <DollarSign className="mr-2 h-5 w-5 text-primary" />
                                    Pricing Details
                                </h3>
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Base Price
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(
                                                            pricing.basePrice
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow className="bg-muted/50">
                                                    <TableCell className="font-bold">
                                                        Total{" "}
                                                        {offer.product_price
                                                            ?.billing_cycle
                                                            ? `(${offer.product_price.billing_cycle})`
                                                            : ""}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatCurrency(
                                                            pricing.total
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                {pricing.monthlyPrice > 0 && (
                                                    <TableRow>
                                                        <TableCell className="font-medium">
                                                            Monthly Equivalent
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {formatCurrency(
                                                                pricing.monthlyPrice
                                                            )}
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                /month
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {pricing.contractValue > 0 && (
                                                    <TableRow className="border-t">
                                                        <TableCell className="font-medium">
                                                            Total Contract Value
                                                            {offer.product_price
                                                                ?.term_months
                                                                ? ` (${offer.product_price.term_months} months)`
                                                                : ""}
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">
                                                            {formatCurrency(
                                                                pricing.contractValue
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Timeline and Dates */}
                            <div>
                                <h3 className="text-lg font-semibold flex items-center mb-3">
                                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                                    Timeline
                                </h3>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Created
                                                    </p>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            offer.created_at,
                                                            true
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Last Updated
                                                    </p>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            offer.updated_at,
                                                            true
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-sm">
                                                        Status
                                                    </p>
                                                    <div>
                                                        {getStatusBadge(
                                                            offer.status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Timeline */}
                                            <div className="pt-2">
                                                <div className="relative">
                                                    <Separator className="my-6" />
                                                    <div className="absolute inset-0 flex items-center justify-between">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <div
                                                                        className={`h-4 w-4 rounded-full border-2 ${
                                                                            offer.status
                                                                                ? "bg-primary border-primary"
                                                                                : "bg-white border-muted-foreground"
                                                                        }`}
                                                                    ></div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Created
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <div
                                                                        className={`h-4 w-4 rounded-full border-2 ${
                                                                            [
                                                                                "accepted",
                                                                                "rejected",
                                                                                "expired",
                                                                                "converted",
                                                                            ].includes(
                                                                                offer.status?.toLowerCase() ||
                                                                                    ""
                                                                            )
                                                                                ? "bg-primary border-primary"
                                                                                : "bg-white border-muted-foreground"
                                                                        }`}
                                                                    ></div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {[
                                                                        "accepted",
                                                                        "rejected",
                                                                        "expired",
                                                                        "converted",
                                                                    ].includes(
                                                                        offer.status?.toLowerCase() ||
                                                                            ""
                                                                    )
                                                                        ? offer.status
                                                                        : "Pending Response"}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <div
                                                                        className={`h-4 w-4 rounded-full border-2 ${
                                                                            offer.status?.toLowerCase() ===
                                                                            "converted"
                                                                                ? "bg-primary border-primary"
                                                                                : "bg-white border-muted-foreground"
                                                                        }`}
                                                                    ></div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {offer.status?.toLowerCase() ===
                                                                    "converted"
                                                                        ? "Converted to Customer"
                                                                        : "Not Converted"}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Side Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Customer Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center text-xl font-semibold mb-2">
                                        {offer.lead?.name
                                            ? `${offer.lead.name.charAt(0)}${
                                                  offer.lead.name.split(" ")[1]
                                                      ? offer.lead.name
                                                            .split(" ")[1]
                                                            .charAt(0)
                                                      : ""
                                              }`
                                            : "?"}
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {offer.lead?.name || "Unknown Customer"}
                                    </h3>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="break-all">
                                                {offer.lead?.email || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Phone
                                            </p>
                                            <p>{offer.lead?.phone || "-"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Address
                                            </p>
                                            <p className="text-sm">
                                                {offer.lead?.address || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Created By Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Created By
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold">
                                            {offer.created_by?.name
                                                ? `${offer.created_by.name.charAt(
                                                      0
                                                  )}${
                                                      offer.created_by.name.split(
                                                          " "
                                                      )[1]
                                                          ? offer.created_by.name
                                                                .split(" ")[1]
                                                                .charAt(0)
                                                          : ""
                                                  }`
                                                : "?"}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {offer.created_by?.name ||
                                                    "Unknown"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Sales Representative
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="break-all">
                                                {offer.created_by?.email || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Created On
                                            </p>
                                            <p>
                                                {formatDate(offer.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* Accept Dialog */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accept Offer</DialogTitle>
                        <DialogDescription>
                            You are about to accept offer #{offer.offer_number}{" "}
                            for {offer.product_price?.product?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-800 mb-4">
                            <div className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">
                                        Accepting this offer will:
                                    </p>
                                    <ul className="mt-1 ml-5 list-disc text-sm">
                                        <li>Mark the offer as accepted</li>
                                        <li>
                                            Create a new subscription in pending
                                            approval status
                                        </li>
                                        <li>Notify relevant departments</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                            <p className="text-blue-800 font-medium mb-2">
                                Pricing Summary
                            </p>
                            <div className="flex justify-between text-sm text-blue-700">
                                <span>Product:</span>
                                <span>
                                    {offer.product_price?.product?.name}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-blue-700 mt-1">
                                <span>Price:</span>
                                <span>
                                    {formatCurrency(offer.product_price?.price)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-blue-700 mt-1">
                                <span>Billing Cycle:</span>
                                <span className="capitalize">
                                    {offer.product_price?.billing_cycle}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAcceptDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Accept Offer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Offer</DialogTitle>
                        <DialogDescription>
                            You are about to reject offer #{offer.offer_number}{" "}
                            for {offer.product_price?.product?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-800 mb-4">
                            <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p>
                                    Rejecting this offer will permanently mark
                                    it as rejected. This action cannot be
                                    undone.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing || !data.rejection_reason}
                        >
                            {processing ? "Processing..." : "Reject Offer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default OfferShow;
