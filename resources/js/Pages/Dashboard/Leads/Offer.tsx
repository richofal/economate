"use client";

import type React from "react";

import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps, Lead, Product, ProductPrice } from "@/types";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import { ChevronLeft, Info, Package, UserCheck } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";

interface LeadOfferProps extends PageProps {
    lead: Lead;
    products: Product[];
    canCreateOffers: boolean;
    previousOffers: any[];
}

const LeadOffer = () => {
    const { lead, products, canCreateOffers, previousOffers } =
        usePage<LeadOfferProps>().props;
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(
        null
    );

    // Form state
    const { data, setData, post, processing, errors } = useForm<{
        user_id: number;
        product_id: string;
        product_price_id: string;
    }>({
        user_id: lead.id,
        product_id: "",
        product_price_id: "",
    });

    // When product changes, reset the selected price
    useEffect(() => {
        setSelectedPrice(null);
        setData("product_price_id", "");
    }, [selectedProduct]);

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleProductChange = (productId: string) => {
        const product = products.find((p) => p.id.toString() === productId);
        setSelectedProduct(product || null);
        setData("product_id", productId);
    };

    const handlePriceChange = (priceId: string) => {
        if (!selectedProduct) return;

        const price = selectedProduct.product_prices.find(
            (p) => p.id.toString() === priceId
        );
        setSelectedPrice(price || null);
        setData("product_price_id", priceId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("leads.storeOffers", lead.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`New Offer for ${lead.name}`} />

            <div className="container mx-auto py-6 space-y-6">
                {/* Header with breadcrumb and actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            New Offer
                        </h1>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Link
                                href={route("leads.index")}
                                className="hover:text-primary"
                            >
                                Leads
                            </Link>
                            <span>/</span>
                            <Link
                                href={route("leads.show", lead.id)}
                                className="hover:text-primary"
                            >
                                {lead.name}
                            </Link>
                            <span>/</span>
                            <span>New Offer</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route("leads.show", lead.id)}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Lead
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Customer info card */}
                <Card className="bg-slate-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium">
                                    {lead.name}
                                </h2>
                                <div className="text-sm text-gray-500 flex gap-3 mt-1">
                                    <span>{lead.email}</span>
                                    {lead.phone && <span>|</span>}
                                    {lead.phone && <span>{lead.phone}</span>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Offer Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create Offer</CardTitle>
                                    <CardDescription>
                                        Select a product and package to offer to
                                        this lead
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Product Selection */}
                                    <div className="space-y-3">
                                        <Label htmlFor="product">
                                            Select Product
                                        </Label>
                                        <Select
                                            value={data.product_id}
                                            onValueChange={handleProductChange}
                                        >
                                            <SelectTrigger
                                                id="product"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select a product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {products.map((product) => (
                                                        <SelectItem
                                                            key={product.id}
                                                            value={product.id.toString()}
                                                        >
                                                            {product.name}
                                                            {product.category && (
                                                                <span className="ml-2 text-xs text-muted-foreground">
                                                                    {
                                                                        product
                                                                            .category
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.product_id && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.product_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Product Details (if selected) */}
                                    {selectedProduct && (
                                        <div className="bg-slate-50 border rounded-lg p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg">
                                                        {selectedProduct.name}
                                                    </h3>
                                                    {selectedProduct.category && (
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1"
                                                        >
                                                            {
                                                                selectedProduct
                                                                    .category
                                                                    .name
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Package className="h-5 w-5 text-primary" />
                                            </div>

                                            {selectedProduct.description && (
                                                <div className="text-sm text-gray-600 mt-2">
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: selectedProduct.description,
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {selectedProduct.bandwidth && (
                                                    <div>
                                                        <span className="text-gray-500">
                                                            Bandwidth:
                                                        </span>{" "}
                                                        <span className="font-medium">
                                                            {
                                                                selectedProduct.bandwidth
                                                            }{" "}
                                                            {selectedProduct.bandwidth_type ||
                                                                "Mbps"}
                                                        </span>
                                                    </div>
                                                )}

                                                {selectedProduct.uptime_guarantee && (
                                                    <div>
                                                        <span className="text-gray-500">
                                                            Uptime Guarantee:
                                                        </span>{" "}
                                                        <span className="font-medium">
                                                            {
                                                                selectedProduct.uptime_guarantee
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Package Selection (if product selected) */}
                                    {selectedProduct && (
                                        <div className="space-y-3">
                                            <Label htmlFor="price_package">
                                                Select Price Package
                                            </Label>
                                            <Select
                                                value={data.product_price_id}
                                                onValueChange={
                                                    handlePriceChange
                                                }
                                            >
                                                <SelectTrigger
                                                    id="price_package"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Select a price package" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {selectedProduct.product_prices.map(
                                                            (price) => (
                                                                <SelectItem
                                                                    key={
                                                                        price.id
                                                                    }
                                                                    value={price.id.toString()}
                                                                >
                                                                    {`${price.billing_cycle} Plan`}{" "}
                                                                    -{" "}
                                                                    {formatCurrency(
                                                                        price.price
                                                                    )}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.product_price_id && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.product_price_id}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Price Details (if selected) */}
                                    {selectedPrice && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium text-blue-800">{`${selectedPrice.billing_cycle} Plan`}</h3>
                                                    <div className="text-sm text-blue-600 mt-1">
                                                        {`Standard ${selectedPrice.billing_cycle} billing`}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-blue-800">
                                                        {formatCurrency(
                                                            selectedPrice.price
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-blue-600">
                                                        per{" "}
                                                        {selectedPrice.billing_cycle.toLowerCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        asChild
                                    >
                                        <Link
                                            href={route("leads.show", lead.id)}
                                        >
                                            Cancel
                                        </Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !data.product_id ||
                                            !data.product_price_id
                                        }
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Offer"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </div>

                    {/* Right column - Sidebar with information */}
                    <div className="space-y-6">
                        {/* Lead info card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    Lead Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Name:
                                    </span>
                                    <span className="font-medium">
                                        {lead.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Email:
                                    </span>
                                    <span className="font-medium">
                                        {lead.email}
                                    </span>
                                </div>
                                {lead.phone && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Phone:
                                        </span>
                                        <span className="font-medium">
                                            {lead.phone}
                                        </span>
                                    </div>
                                )}
                                {lead.created_at && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Lead since:
                                        </span>
                                        <span className="font-medium">
                                            {new Date(
                                                lead.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Previous offers */}
                        {previousOffers && previousOffers.length > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        Previous Offers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {previousOffers.map((offer, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-md p-3 space-y-2"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium">
                                                    {offer.product.name}
                                                </span>
                                                <Badge
                                                    className={
                                                        offer.status ===
                                                        "accepted"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : offer.status ===
                                                              "rejected"
                                                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                    }
                                                >
                                                    {offer.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatCurrency(
                                                    offer.productPrice.price
                                                )}{" "}
                                                per{" "}
                                                {
                                                    offer.productPrice
                                                        .billing_cycle
                                                }
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Offered on{" "}
                                                {new Date(
                                                    offer.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Help card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center">
                                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                                    Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p>
                                    Choose the product that best fits the lead's
                                    needs based on your previous conversations.
                                </p>
                                <p>
                                    Be sure to set an appropriate contract
                                    length that will appeal to the customer.
                                </p>
                                <p>
                                    The auto-renew option will automatically
                                    extend the contract when it ends.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default LeadOffer;
