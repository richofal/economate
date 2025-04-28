"use client";

import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    ChevronLeft,
    Edit,
    Trash2,
    ArrowUpRight,
    Calendar,
    Tag,
    BarChart4,
    Layers,
    Wifi,
    Clock,
    Activity,
    Award,
    CheckCircle2,
    PlusCircle,
    Share2,
    Download,
    Copy,
    AlertTriangle,
    Package,
    RefreshCw,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { Category, PageProps, Product, ProductPrice } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { toast } from "@/Hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface ShowProductPageProps extends PageProps {
    product: Product;
    category: Category;
    productPrices: ProductPrice[];
    created_at_formatted: string;
    updated_at_formatted: string;
    canCreateProductPrice: boolean;
    canEditProductPrice: boolean;
    canDeleteProductPrice: boolean;
}

const ProductsShow = () => {
    const { auth, flash } = usePage<PageProps>().props;
    const { success, error } = flash || {};
    const {
        product,
        category,
        productPrices,
        created_at_formatted,
        updated_at_formatted,
        canCreateProductPrice,
        canEditProductPrice,
        canDeleteProductPrice,
    } = usePage<ShowProductPageProps>().props;

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeletePriceDialogOpen, setIsDeletePriceDialogOpen] =
        useState(false);
    const [priceToDelete, setPriceToDelete] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("details");
    const [showShareOptions, setShowShareOptions] = useState(false);

    React.useEffect(() => {
        if (success) {
            toast({
                title: "Success",
                description: success,
                variant: "default",
            });
        }
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [success, error]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatBillingCycle = (cycle: string) => {
        switch (cycle) {
            case "monthly":
                return "Monthly";
            case "quarterly":
                return "Quarterly (3 months)";
            case "semi_annual":
                return "Semi-Annual (6 months)";
            case "annual":
                return "Annual (12 months)";
            default:
                return capitalizeFirstLetter(cycle.replace("_", " "));
        }
    };

    // Function to get appropriate connection type icon
    const getConnectionIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "fiber":
                return <Wifi className="w-4 h-4 text-green-500" />;
            case "wireless":
                return <Wifi className="w-4 h-4 text-blue-500" />;
            case "copper":
                return <Layers className="w-4 h-4 text-amber-500" />;
            case "satellite":
                return <Activity className="w-4 h-4 text-purple-500" />;
            default:
                return <Wifi className="w-4 h-4" />;
        }
    };

    // Calculate savings compared to monthly price
    const calculateSavings = (
        monthlyPrice: number,
        currentPrice: number,
        billingCycle: string
    ) => {
        if (!monthlyPrice || !currentPrice) return 0;

        let multiplier = 1;
        switch (billingCycle) {
            case "quarterly":
                multiplier = 3;
                break;
            case "semi_annual":
                multiplier = 6;
                break;
            case "annual":
                multiplier = 12;
                break;
            default:
                multiplier = 1;
        }

        const totalMonthlyPrice = monthlyPrice * multiplier;
        return ((totalMonthlyPrice - currentPrice) / totalMonthlyPrice) * 100;
    };

    // Get monthly price if available
    const getMonthlyPrice = () => {
        const monthlyPricing = productPrices.find(
            (price) => price.billing_cycle === "monthly"
        );
        return monthlyPricing ? monthlyPricing.price : 0;
    };

    // Handle delete product
    const handleDeleteProduct = () => {
        router.delete(route("products.destroy", { product: product.id }), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                toast({
                    title: "Product Deleted",
                    description: `${product.name} has been successfully deleted.`,
                    variant: "default",
                });
            },
        });
    };

    // Handle delete price
    const handleDeletePrice = () => {
        if (priceToDelete) {
            router.delete(
                route("products.productPrices.destroy", {
                    product: product.id,
                    productPrice: priceToDelete,
                }),
                {
                    onSuccess: () => {
                        setIsDeletePriceDialogOpen(false);
                        setPriceToDelete(null);
                        toast({
                            title: "Price Plan Deleted",
                            description:
                                "The pricing plan has been successfully deleted.",
                            variant: "default",
                        });
                    },
                }
            );
        }
    };

    // Copy product link to clipboard
    const copyProductLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Link Copied",
                description: "Product link copied to clipboard",
                variant: "default",
            });
        });
    };

    // Generate PDF specification sheet
    const generatePDF = () => {
        toast({
            title: "Generating PDF",
            description: "Your product specification sheet is being generated",
            variant: "default",
        });
        // Implement actual PDF generation here
    };

    const monthlyPrice = getMonthlyPrice();

    return (
        <AuthenticatedLayout>
            <Head title={`Product: ${product.name}`} />

            <div className="container mx-auto py-6 space-y-6">
                {/* Breadcrumb and Action Buttons */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={route("dashboard")}>
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={route("products.index")}>
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>{product.name}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route("products.index")}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Products
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={copyProductLink}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={generatePDF}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export as PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Flash Message */}
                {(success || error) && (
                    <Alert variant={error ? "destructive" : "default"}>
                        <AlertDescription>{success || error}</AlertDescription>
                    </Alert>
                )}

                {/* Hero Card */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <div className="flex items-center">
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800">
                                        {product.name}
                                    </CardTitle>
                                    {product.is_featured && (
                                        <Badge
                                            variant="outline"
                                            className="ml-3 bg-amber-100 text-amber-800 border-amber-300 flex items-center"
                                        >
                                            <Award className="w-3 h-3 mr-1" />{" "}
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center mt-2">
                                    <Tag className="w-4 h-4 mr-1 text-slate-500" />
                                    <CardDescription className="font-medium">
                                        {product.code}
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <Badge
                                    variant={
                                        product.is_active
                                            ? "default"
                                            : "secondary"
                                    }
                                    className={`text-sm px-3 py-1 ${
                                        product.is_active ? "bg-green-500" : ""
                                    }`}
                                >
                                    {product.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <div className="flex items-center text-sm text-slate-500 mt-1">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    <span>
                                        {product.uptime_guarantee}% Uptime
                                        Guarantee
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <Badge variant="outline" className="bg-white">
                                <Package className="w-3 h-3 mr-1" />
                                {category.name}
                            </Badge>
                            <Badge variant="outline" className="bg-white">
                                <Wifi className="w-3 h-3 mr-1" />
                                {product.bandwidth} {product.bandwidth_type}
                            </Badge>
                            <Badge variant="outline" className="bg-white">
                                <Clock className="w-3 h-3 mr-1" />
                                {product.minimum_contract_months} months
                            </Badge>
                            {product.is_recurring && (
                                <Badge variant="outline" className="bg-white">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Recurring
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Tabs
                            defaultValue="details"
                            className="w-full"
                            value={activeTab}
                            onValueChange={setActiveTab}
                        >
                            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
                                <TabsTrigger value="details">
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="specifications">
                                    Specifications
                                </TabsTrigger>
                                <TabsTrigger value="pricing">
                                    Pricing
                                </TabsTrigger>
                            </TabsList>

                            {/* Details Tab */}
                            <TabsContent
                                value="details"
                                className="p-6 space-y-6"
                            >
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center text-slate-700">
                                        <ArrowUpRight className="w-5 h-5 mr-2 text-slate-500" />
                                        Description
                                    </h3>
                                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                                        {product.description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-slate-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                <Tag className="w-5 h-5 mr-2 text-slate-500" />
                                                Product Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Category
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800">
                                                        {category.name}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Type
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800">
                                                        {product.is_recurring
                                                            ? "Recurring"
                                                            : "One-time"}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Status
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800">
                                                        <Badge
                                                            variant={
                                                                product.is_active
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={`${
                                                                product.is_active
                                                                    ? "bg-green-500"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {product.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Badge>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Contract Length
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800 flex items-center">
                                                        <Clock className="w-4 h-4 mr-1 text-slate-400" />
                                                        {
                                                            product.minimum_contract_months
                                                        }{" "}
                                                        months
                                                    </dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                <Calendar className="w-5 h-5 mr-2 text-slate-500" />
                                                Date Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Created
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800">
                                                        {created_at_formatted}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <dt className="text-sm font-medium text-slate-500">
                                                        Last Updated
                                                    </dt>
                                                    <dd className="text-sm font-semibold text-slate-800">
                                                        {updated_at_formatted}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Specifications Tab */}
                            <TabsContent value="specifications" className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <Card className="bg-slate-50 border-slate-200">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <BarChart4 className="h-8 w-8 text-blue-500 mb-2" />
                                            <h3 className="font-medium text-sm text-slate-500">
                                                Bandwidth
                                            </h3>
                                            <p className="text-lg font-bold">
                                                {product.bandwidth}{" "}
                                                {product.bandwidth_type}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-slate-50 border-slate-200">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            {getConnectionIcon(
                                                product.connection_type
                                            )}
                                            <h3 className="font-medium text-sm text-slate-500 mt-2">
                                                Connection
                                            </h3>
                                            <p className="text-lg font-bold capitalize">
                                                {product.connection_type}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-slate-50 border-slate-200">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <Activity className="h-8 w-8 text-green-500 mb-2" />
                                            <h3 className="font-medium text-sm text-slate-500">
                                                Uptime
                                            </h3>
                                            <p className="text-lg font-bold">
                                                {product.uptime_guarantee}%
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-slate-50 border-slate-200">
                                        <CardContent className="p-4 flex flex-col items-center justify-center">
                                            <Clock className="h-8 w-8 text-amber-500 mb-2" />
                                            <h3 className="font-medium text-sm text-slate-500">
                                                Min. Contract
                                            </h3>
                                            <p className="text-lg font-bold">
                                                {
                                                    product.minimum_contract_months
                                                }{" "}
                                                months
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">
                                            Detailed Specifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[200px]">
                                                        Specification
                                                    </TableHead>
                                                    <TableHead>Value</TableHead>
                                                    <TableHead>
                                                        Details
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Bandwidth
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.bandwidth}{" "}
                                                        {product.bandwidth_type}
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {product.bandwidth_type ===
                                                        "gbps"
                                                            ? "Gigabit per second"
                                                            : product.bandwidth_type ===
                                                              "mbps"
                                                            ? "Megabit per second"
                                                            : "Terabit per second"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Connection Type
                                                    </TableCell>
                                                    <TableCell className="capitalize">
                                                        {
                                                            product.connection_type
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {product.connection_type ===
                                                        "fiber"
                                                            ? "Fiber optic connection"
                                                            : product.connection_type ===
                                                              "wireless"
                                                            ? "Wireless connection"
                                                            : product.connection_type ===
                                                              "copper"
                                                            ? "Copper cable connection"
                                                            : "Satellite connection"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Uptime Guarantee
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            product.uptime_guarantee
                                                        }
                                                        %
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {product.uptime_guarantee >=
                                                        99.9
                                                            ? "Enterprise-grade reliability"
                                                            : product.uptime_guarantee >=
                                                              99.5
                                                            ? "High reliability"
                                                            : "Standard reliability"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Minimum Contract
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            product.minimum_contract_months
                                                        }{" "}
                                                        months
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {product.minimum_contract_months >=
                                                        24
                                                            ? "Long-term commitment"
                                                            : product.minimum_contract_months >=
                                                              12
                                                            ? "Standard commitment"
                                                            : "Short-term commitment"}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        Billing
                                                    </TableCell>
                                                    <TableCell>
                                                        {product.is_recurring
                                                            ? "Recurring"
                                                            : "One-time"}
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 text-sm">
                                                        {product.is_recurring
                                                            ? "Regular billing cycle applies"
                                                            : "Single payment required"}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Pricing Tab */}
                            <TabsContent
                                value="pricing"
                                className="p-6 space-y-6"
                            >
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-blue-600 mb-1">
                                                One-time Setup Fee
                                            </h3>
                                            <p className="text-3xl font-bold text-slate-800">
                                                {formatCurrency(
                                                    product.setup_fee
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-col">
                                            <Badge
                                                variant="outline"
                                                className="border-blue-200 text-blue-700 bg-blue-50"
                                            >
                                                {product.is_recurring
                                                    ? "Recurring Billing"
                                                    : "One-time Payment"}
                                            </Badge>
                                            <span className="text-sm text-slate-600 mt-2">
                                                Minimum contract:{" "}
                                                {
                                                    product.minimum_contract_months
                                                }{" "}
                                                months
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Plans */}
                                <Card>
                                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Pricing Plan
                                            </CardTitle>
                                            <CardDescription>
                                                {productPrices.length > 1
                                                    ? "This product has multiple pricing plans. Choose the one that best fits your needs."
                                                    : "Current pricing plan for this product."}
                                            </CardDescription>
                                        </div>
                                        {canCreateProductPrice && (
                                            <Button asChild>
                                                <Link
                                                    href={route(
                                                        "products.productPrices.create",
                                                        {
                                                            product: product.id,
                                                        }
                                                    )}
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Add Price
                                                </Link>
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        {productPrices &&
                                        productPrices.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Billing Cycle
                                                        </TableHead>
                                                        <TableHead>
                                                            Total Price
                                                        </TableHead>
                                                        <TableHead>
                                                            Monthly Equivalent
                                                        </TableHead>
                                                        <TableHead>
                                                            Savings vs Monthly
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {productPrices.map(
                                                        (price) => {
                                                            const monthsMultiplier =
                                                                price.billing_cycle ===
                                                                "quarterly"
                                                                    ? 3
                                                                    : price.billing_cycle ===
                                                                      "semi_annual"
                                                                    ? 6
                                                                    : price.billing_cycle ===
                                                                      "annual"
                                                                    ? 12
                                                                    : 1;

                                                            const monthlyEquivalent =
                                                                price.price /
                                                                monthsMultiplier;
                                                            const savings =
                                                                price.billing_cycle !==
                                                                    "monthly" &&
                                                                monthlyPrice > 0
                                                                    ? calculateSavings(
                                                                          monthlyPrice,
                                                                          price.price,
                                                                          price.billing_cycle
                                                                      )
                                                                    : 0;

                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        price.id
                                                                    }
                                                                >
                                                                    <TableCell className="font-medium">
                                                                        {formatBillingCycle(
                                                                            price.billing_cycle
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {formatCurrency(
                                                                            price.price
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {formatCurrency(
                                                                            monthlyEquivalent
                                                                        )}
                                                                        /month
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {price.billing_cycle ===
                                                                        "monthly" ? (
                                                                            <span className="text-slate-500">
                                                                                -
                                                                            </span>
                                                                        ) : (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={
                                                                                    savings >
                                                                                    0
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : ""
                                                                                }
                                                                            >
                                                                                {savings >
                                                                                0
                                                                                    ? `Save ${Math.round(
                                                                                          savings
                                                                                      )}%`
                                                                                    : "No savings"}
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            {canEditProductPrice && (
                                                                                <TooltipProvider>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger
                                                                                            asChild
                                                                                        >
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="icon"
                                                                                                asChild
                                                                                            >
                                                                                                <Link
                                                                                                    href={route(
                                                                                                        "products.productPrices.edit",
                                                                                                        {
                                                                                                            product:
                                                                                                                product.id,
                                                                                                            productPrice:
                                                                                                                price.id,
                                                                                                        }
                                                                                                    )}
                                                                                                >
                                                                                                    <Edit className="h-4 w-4 text-slate-500 hover:text-slate-900" />
                                                                                                </Link>
                                                                                            </Button>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            <p>
                                                                                                Edit
                                                                                                price
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            )}

                                                                            {canDeleteProductPrice && (
                                                                                <TooltipProvider>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger
                                                                                            asChild
                                                                                        >
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="icon"
                                                                                                onClick={() => {
                                                                                                    setPriceToDelete(
                                                                                                        price.id
                                                                                                    );
                                                                                                    setIsDeletePriceDialogOpen(
                                                                                                        true
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                                                            </Button>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            <p>
                                                                                                Delete
                                                                                                price
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        }
                                                    )}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                                                <div className="text-slate-400 mb-4 bg-white p-3 rounded-full">
                                                    <AlertTriangle className="h-8 w-8" />
                                                </div>
                                                <h3 className="text-lg font-medium text-slate-700 mb-2">
                                                    No pricing plans available
                                                </h3>
                                                <p className="text-slate-500 text-center mb-6 max-w-md">
                                                    This product doesn't have
                                                    any pricing plans set up
                                                    yet. Add a price plan to
                                                    make this product available
                                                    for purchase.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Product Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Delete Product
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product "{product.name}" and all
                            associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-50 border border-red-100 rounded p-3 mb-4">
                        <p className="text-sm text-red-700 flex items-start">
                            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            Warning: Deleting this product may affect existing
                            customer subscriptions and orders that use this
                            product.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteProduct}
                        >
                            Delete Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Price Confirmation Dialog */}
            <Dialog
                open={isDeletePriceDialogOpen}
                onOpenChange={setIsDeletePriceDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Delete Pricing Plan
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this pricing plan?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeletePriceDialogOpen(false);
                                setPriceToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeletePrice}
                        >
                            Delete Price
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default ProductsShow;
