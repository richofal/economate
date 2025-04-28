"use client";

import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Product, PageProps } from "@/types";
import {
    Wifi,
    Globe,
    Server,
    Search,
    ChevronRight,
    Clock,
    ShieldCheck,
    Download,
    Upload,
    Filter,
    X,
    CalendarCheck,
    CheckCircle,
    Phone,
    Zap,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Separator } from "@/Components/ui/separator";

interface ProductsPageProps extends PageProps {
    products: Product[];
    categories: Array<{ id: number; name: string }>;
}

const ProductsPage = () => {
    const { products, categories } = usePage<ProductsPageProps>().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [connectionFilter, setConnectionFilter] = useState("all");
    const [sortOption, setSortOption] = useState("popular");

    // Format currency function
    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format bandwidth function
    const formatBandwidth = (bandwidth?: number, type?: string) => {
        if (bandwidth === undefined || bandwidth === null) return "-";

        if (type === "Gbps" || type === "gbps") {
            return `${bandwidth} Gbps`;
        } else if (type === "Mbps" || type === "mbps") {
            return `${bandwidth} Mbps`;
        } else {
            return `${bandwidth} ${type || "Mbps"}`;
        }
    };

    // Get icon for connection type
    const getConnectionIcon = (type?: string) => {
        if (!type) return <Wifi className="h-5 w-5" />;

        const lowerType = type.toLowerCase();
        if (lowerType.includes("fiber")) {
            return <Wifi className="h-5 w-5 text-blue-500" />;
        } else if (lowerType.includes("wireless")) {
            return <Wifi className="h-5 w-5 text-orange-500" />;
        } else if (lowerType.includes("dedicated")) {
            return <Server className="h-5 w-5 text-indigo-500" />;
        } else if (lowerType.includes("broadband")) {
            return <Globe className="h-5 w-5 text-green-500" />;
        }

        return <Wifi className="h-5 w-5" />;
    };

    // Filter and sort products
    const getFilteredAndSortedProducts = () => {
        // First, apply filters
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name?.toLowerCase().includes(searchLower) ||
                    product.description?.toLowerCase().includes(searchLower) ||
                    product.code?.toLowerCase().includes(searchLower)
            );
        }

        // Category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter(
                (product) => product.category?.id.toString() === categoryFilter
            );
        }

        // Connection type filter
        if (connectionFilter !== "all") {
            filtered = filtered.filter((product) =>
                product.connection_type
                    ?.toLowerCase()
                    .includes(connectionFilter.toLowerCase())
            );
        }

        // Only show active products
        filtered = filtered.filter((product) => product.is_active);

        // Sort the filtered results
        filtered.sort((a, b) => {
            switch (sortOption) {
                case "price-low":
                    // Get the lowest price from each product's price options
                    const aMinPrice = Math.min(
                        ...(a.product_prices || []).map((p) => p.price || 0)
                    );
                    const bMinPrice = Math.min(
                        ...(b.product_prices || []).map((p) => p.price || 0)
                    );
                    return aMinPrice - bMinPrice;

                case "price-high":
                    // Get the lowest price from each product's price options
                    const aMaxPrice = Math.min(
                        ...(a.product_prices || []).map((p) => p.price || 0)
                    );
                    const bMaxPrice = Math.min(
                        ...(b.product_prices || []).map((p) => p.price || 0)
                    );
                    return bMaxPrice - aMaxPrice;

                case "bandwidth":
                    return (b.bandwidth || 0) - (a.bandwidth || 0);

                case "newest":
                    return (
                        new Date(b.created_at || 0).getTime() -
                        new Date(a.created_at || 0).getTime()
                    );

                case "popular":
                default:
                    // For popular, prioritize featured products first, then go by whatever metrics you use for popularity
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;
                    return 0;
            }
        });

        return filtered;
    };

    const filteredProducts = getFilteredAndSortedProducts();

    // Get unique connection types
    const connectionTypes = Array.from(
        new Set(products.map((p) => p.connection_type).filter((type) => !!type))
    );

    return (
        <GuestLayout>
            <Head title="Produk Internet & Konektivitas Kami | PT SMART CRM" />

            {/* Hero section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-900 text-white">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] bg-repeat"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl opacity-20"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-400 blur-3xl opacity-20"></div>
                </div>

                <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text content */}
                        <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            <div className="inline-block bg-blue-700/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-blue-400/20">
                                <span className="text-sm font-medium text-blue-100">
                                    Internet & Networking Solutions
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                                Solusi Konektivitas{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10">
                                        Terdepan
                                    </span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-500/30 -rotate-1 rounded z-0"></span>
                                </span>{" "}
                                untuk Bisnis Anda
                            </h1>

                            <p className="text-lg md:text-xl text-blue-100 mb-8 lg:pr-12">
                                Berbagai pilihan paket internet dengan kecepatan
                                tinggi, keandalan maksimal, dan dukungan teknis
                                24/7 untuk mendukung pertumbuhan bisnis Anda.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                                >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Hubungi Sales
                                </Button>
                                <Button
                                    size="lg"
                                    className="bg-blue-500 text-white border border-blue-400 hover:bg-blue-600 transition-all hover:scale-105"
                                >
                                    <CalendarCheck className="h-4 w-4 mr-2" />
                                    Konsultasi Gratis
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-10 hidden lg:block">
                                <div className="flex items-center gap-2 text-blue-100">
                                    <CheckCircle className="h-4 w-4 text-blue-300" />
                                    <span className="text-sm mr-4">
                                        Uptime 99.9%
                                    </span>

                                    <CheckCircle className="h-4 w-4 text-blue-300" />
                                    <span className="text-sm mr-4">
                                        Support 24/7
                                    </span>

                                    <CheckCircle className="h-4 w-4 text-blue-300" />
                                    <span className="text-sm">Setup Cepat</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero image/illustration */}
                        <div className="flex-1 hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-white/10 transform -rotate-3"></div>
                                <div className="relative bg-gradient-to-tr from-blue-800/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                                    <img
                                        src="/images/network-illustration.svg"
                                        alt="Network Connectivity"
                                        className="w-full h-auto rounded"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://placehold.co/600x400/2563eb/white?text=Network+Solutions";
                                        }}
                                    />

                                    {/* Floating elements */}
                                    <div className="absolute -top-6 -right-6 bg-white rounded-lg p-3 shadow-xl transform rotate-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse"></div>
                                            <span className="text-blue-900 font-medium text-sm">
                                                Uptime 99.9%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-5 -left-5 bg-blue-700 rounded-lg p-3 shadow-xl transform -rotate-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-white" />
                                            <span className="text-white font-medium text-sm">
                                                Ultra-Fast Speed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile trust indicators */}
                    <div className="mt-8 flex justify-center lg:hidden">
                        <div className="inline-flex flex-wrap justify-center gap-3 bg-blue-800/30 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-400/20">
                            <div className="flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5 text-blue-300" />
                                <span className="text-xs">Uptime 99.9%</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5 text-blue-300" />
                                <span className="text-xs">Support 24/7</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <CheckCircle className="h-3.5 w-3.5 text-blue-300" />
                                <span className="text-xs">Setup Cepat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter section */}
            <section className="py-8 bg-slate-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold">Produk Kami</h2>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Urutkan:
                            </span>
                            <Select
                                value={sortOption}
                                onValueChange={setSortOption}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Pilih urutan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">
                                        Paling Populer
                                    </SelectItem>
                                    <SelectItem value="price-low">
                                        Harga Terendah
                                    </SelectItem>
                                    <SelectItem value="price-high">
                                        Harga Tertinggi
                                    </SelectItem>
                                    <SelectItem value="bandwidth">
                                        Bandwidth Tertinggi
                                    </SelectItem>
                                    <SelectItem value="newest">
                                        Terbaru
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Filter sidebar */}
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari produk..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
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

                            <div>
                                <h3 className="text-sm font-medium mb-3 flex items-center">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter Produk
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1.5 block">
                                            Kategori
                                        </label>
                                        <Select
                                            value={categoryFilter}
                                            onValueChange={setCategoryFilter}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Semua Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Semua Kategori
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1.5 block">
                                            Tipe Koneksi
                                        </label>
                                        <Select
                                            value={connectionFilter}
                                            onValueChange={setConnectionFilter}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Semua Tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Semua Tipe
                                                </SelectItem>
                                                {connectionTypes.map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Filter reset */}
                            {(searchTerm ||
                                categoryFilter !== "all" ||
                                connectionFilter !== "all") && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setCategoryFilter("all");
                                        setConnectionFilter("all");
                                    }}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reset Filter
                                </Button>
                            )}

                            {/* Quick contact */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    Butuh Bantuan?
                                </h4>
                                <p className="text-sm text-blue-700 mb-3">
                                    Tim sales kami siap membantu menemukan
                                    solusi terbaik untuk bisnis Anda.
                                </p>
                                <Button size="sm" className="w-full">
                                    Hubungi Kami
                                </Button>
                            </div>
                        </div>

                        {/* Products grid */}
                        <div className="md:col-span-3">
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <Card
                                            key={product.id}
                                            className={`overflow-hidden ${
                                                product.is_featured
                                                    ? "border-blue-300 shadow-md"
                                                    : ""
                                            }`}
                                        >
                                            {product.is_featured && (
                                                <div className="bg-blue-600 text-white py-1 px-3 text-xs font-medium text-center">
                                                    PAKET FAVORIT
                                                </div>
                                            )}
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {product.name}
                                                        </CardTitle>
                                                        <CardDescription className="line-clamp-2">
                                                            {
                                                                product.description
                                                            }
                                                        </CardDescription>
                                                    </div>
                                                    <div className="bg-slate-100 p-2 rounded-full">
                                                        {getConnectionIcon(
                                                            product.connection_type
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        {product.product_prices &&
                                                        product.product_prices
                                                            .length > 0 ? (
                                                            <div>
                                                                <p className="text-sm text-muted-foreground mb-1">
                                                                    Mulai dari
                                                                </p>
                                                                <div className="flex items-end gap-1.5">
                                                                    <span className="text-2xl font-bold text-blue-600">
                                                                        {formatCurrency(
                                                                            Math.min(
                                                                                ...product.product_prices.map(
                                                                                    (
                                                                                        p
                                                                                    ) =>
                                                                                        p.price ||
                                                                                        0
                                                                                )
                                                                            )
                                                                        )}
                                                                    </span>
                                                                    <span className="text-sm text-muted-foreground mb-0.5">
                                                                        /bulan
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted-foreground text-sm">
                                                                Hubungi untuk
                                                                harga
                                                            </p>
                                                        )}
                                                    </div>

                                                    <Separator />

                                                    {/* Product features */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <Download className="h-4 w-4 text-blue-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Kecepatan
                                                                </span>
                                                                <p className="font-medium">
                                                                    {formatBandwidth(
                                                                        product.bandwidth,
                                                                        product.bandwidth_type
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <Upload className="h-4 w-4 text-blue-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Jenis
                                                                    Koneksi
                                                                </span>
                                                                <p className="font-medium">
                                                                    {product.connection_type ||
                                                                        "-"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <ShieldCheck className="h-4 w-4 text-blue-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Jaminan
                                                                    Uptime
                                                                </span>
                                                                <p className="font-medium">
                                                                    {product.uptime_guarantee
                                                                        ? `${product.uptime_guarantee}%`
                                                                        : "-"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Kontrak
                                                                    Minimum
                                                                </span>
                                                                <p className="font-medium">
                                                                    {product.minimum_contract_months
                                                                        ? `${product.minimum_contract_months} Bulan`
                                                                        : "-"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-col gap-3 pt-0">
                                                <Button
                                                    className="w-full"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route("product", {
                                                            slug: product.code,
                                                        })}
                                                    >
                                                        Lihat Detail{" "}
                                                        <ChevronRight className="h-4 w-4 ml-1" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    Hubungi Sales
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border rounded-md bg-slate-50">
                                    <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium">
                                        Tidak Menemukan Produk
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                                        Tidak ada produk yang sesuai dengan
                                        filter yang Anda pilih.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCategoryFilter("all");
                                            setConnectionFilter("all");
                                        }}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reset Filter
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                            Pertanyaan yang Sering Diajukan
                        </h2>

                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                        >
                            <AccordionItem
                                value="item-1"
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left">
                                    Berapa lama waktu pemasangan layanan
                                    internet?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Proses pemasangan layanan internet kami
                                    biasanya memakan waktu 3-5 hari kerja
                                    setelah kontrak ditandatangani dan
                                    pembayaran pertama diterima. Waktu
                                    pemasangan dapat bervariasi tergantung
                                    lokasi, aksesibilitas, dan kompleksitas
                                    instalasi.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                                value="item-2"
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left">
                                    Apakah ada biaya pemasangan tambahan?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Biaya setup sudah termasuk dalam paket untuk
                                    sebagian besar lokasi. Namun, untuk lokasi
                                    tertentu yang memerlukan peralatan khusus
                                    atau instalasi rumit, mungkin ada biaya
                                    tambahan. Tim kami akan melakukan survei
                                    lokasi terlebih dahulu dan memberikan
                                    informasi lengkap mengenai biaya sebelum
                                    Anda memutuskan untuk berlangganan.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                                value="item-3"
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left">
                                    Apakah bandwidth yang dijanjikan dijamin?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Ya, kami menjamin bandwidth sesuai dengan
                                    paket yang Anda pilih. Paket fiber dan
                                    dedicated kami menawarkan bandwidth 1:1 yang
                                    berarti Anda mendapatkan kecepatan penuh
                                    sesuai paket yang Anda beli. Kami memiliki
                                    perjanjian tingkat layanan (SLA) yang
                                    menjamin uptime minimal sesuai dengan yang
                                    tercantum pada setiap produk.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                                value="item-4"
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left">
                                    Bagaimana jika saya mengalami gangguan
                                    layanan?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Kami memiliki tim dukungan teknis 24/7 yang
                                    siap membantu Anda. Anda dapat menghubungi
                                    kami melalui hotline, email, atau portal
                                    pelanggan. Kami berkomitmen untuk merespon
                                    setiap laporan gangguan dalam waktu 15 menit
                                    dan menyelesaikan masalah sesuai dengan
                                    tingkat layanan yang dijanjikan dalam SLA.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                                value="item-5"
                                className="border rounded-lg px-4"
                            >
                                <AccordionTrigger className="text-left">
                                    Apakah saya bisa meningkatkan paket di
                                    tengah kontrak?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    Ya, Anda dapat meningkatkan (upgrade) paket
                                    Anda kapan saja selama masa kontrak. Upgrade
                                    dapat dilakukan tanpa penalti dan akan
                                    disesuaikan pada tagihan berikutnya. Namun,
                                    untuk penurunan paket (downgrade), sebaiknya
                                    dilakukan saat pembaruan kontrak untuk
                                    menghindari biaya penalti.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Siap Meningkatkan Konektivitas Bisnis Anda?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8">
                            Dapatkan konsultasi gratis dengan tim ahli kami
                            untuk menemukan solusi konektivitas terbaik sesuai
                            kebutuhan dan anggaran bisnis Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-900 hover:bg-blue-50"
                            >
                                Hubungi Sales
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                            >
                                Katalog Produk
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default ProductsPage;
