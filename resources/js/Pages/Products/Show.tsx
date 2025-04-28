import { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Product, PageProps } from "@/types";
import {
    Wifi,
    Globe,
    Server,
    ArrowLeft,
    Download,
    Upload,
    ShieldCheck,
    Clock,
    CalendarCheck,
    CheckCircle,
    X,
    ChevronRight,
    Share2,
    Star,
    Phone,
    PieChart,
    MessageSquare,
    Users,
    Building,
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
import { Badge } from "@/Components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";

interface ProductShowProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
}

const ProductShow = () => {
    const { product, relatedProducts } = usePage<ProductShowProps>().props;
    const [selectedPriceId, setSelectedPriceId] = useState(
        product.product_prices && product.product_prices.length > 0
            ? product.product_prices[0].id
            : null
    );
    const { auth } = usePage().props as any;

    // State untuk modal
    const [showOrderModal, setShowOrderModal] = useState(false);

    // Form handling dengan Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: auth.user?.id || "",
        approved_by_id: null,
        subscription_number: `SUB-${Math.floor(Math.random() * 10000)}`,
        start_date: new Date().toISOString().split("T")[0], // Default ke hari ini
        auto_renew: false,
        end_date: "",
        product_price_id: selectedPriceId,
    });

    // Effect untuk update product_price_id saat selectedPriceId berubah
    useEffect(() => {
        setData("product_price_id", selectedPriceId);
    }, [selectedPriceId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("subscriptions.apply"), {
            onSuccess: () => {
                setShowOrderModal(false);
                reset();
                // Bisa tambahkan toast notification success
            },
        });
    };

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

    // Get selected price
    const getSelectedPrice = () => {
        if (!product.product_prices || product.product_prices.length === 0)
            return null;

        return (
            product.product_prices.find(
                (price) => price.id === selectedPriceId
            ) || product.product_prices[0]
        );
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

    const selectedPrice = getSelectedPrice();

    useEffect(() => {
        if (data.start_date && selectedPrice) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(startDate);

            // Hitung end_date berdasarkan billing_cycle
            if (selectedPrice.billing_cycle === "monthly") {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (selectedPrice.billing_cycle === "quarterly") {
                endDate.setMonth(endDate.getMonth() + 3);
            } else if (selectedPrice.billing_cycle === "semi_annual") {
                endDate.setMonth(endDate.getMonth() + 6);
            } else if (selectedPrice.billing_cycle === "annual") {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else if (selectedPrice.billing_cycle === "biennially") {
                endDate.setFullYear(endDate.getFullYear() + 2);
            } else if (selectedPrice.billing_cycle === "triennially") {
                endDate.setFullYear(endDate.getFullYear() + 3);
            } else {
                // Default ke 1 bulan jika billing_cycle tidak dikenali
                endDate.setMonth(endDate.getMonth() + 1);
            }

            // Format endDate as YYYY-MM-DD
            const formattedEndDate = endDate.toISOString().split("T")[0];
            setData("end_date", formattedEndDate);
        }
    }, [data.start_date, selectedPrice]);

    // Parse HTML content safely
    const createMarkup = (htmlContent?: string) => {
        return { __html: htmlContent || "" };
    };

    return (
        <GuestLayout>
            <Head
                title={`${product.name} - Internet & Konektivitas | PT SMART CRM`}
            />

            {/* Product Header */}
            <section className="bg-white pt-8 pb-12">
                <div className="container mx-auto px-4">
                    {/* Product Hero Section */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.history.back()}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Kembali
                                </Button>
                                {product.is_featured && (
                                    <Badge
                                        variant="default"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                    >
                                        Paket Unggulan
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Bagikan
                                </Button>
                            </div>
                        </div>

                        {/* Product Title and Rating */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="flex items-center text-amber-500">
                                    <Star className="fill-amber-500 h-4 w-4" />
                                    <Star className="fill-amber-500 h-4 w-4" />
                                    <Star className="fill-amber-500 h-4 w-4" />
                                    <Star className="fill-amber-500 h-4 w-4" />
                                    <Star className="fill-amber-200 h-4 w-4" />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    4.8/5 (120 ulasan)
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    {getConnectionIcon(product.connection_type)}
                                </div>
                                <span className="font-medium">
                                    {product.connection_type || "Standard"}
                                </span>
                                <span className="text-sm text-muted-foreground mx-2">
                                    |
                                </span>
                                <Download className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">
                                    {formatBandwidth(
                                        product.bandwidth,
                                        product.bandwidth_type
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Key Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
                            <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-5 rounded-xl text-center">
                                <Download className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                                <div className="text-sm text-muted-foreground">
                                    Kecepatan
                                </div>
                                <div className="font-medium">
                                    {formatBandwidth(
                                        product.bandwidth,
                                        product.bandwidth_type
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-5 rounded-xl text-center">
                                <ShieldCheck className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                                <div className="text-sm text-muted-foreground">
                                    Uptime
                                </div>
                                <div className="font-medium">
                                    {product.uptime_guarantee
                                        ? `${product.uptime_guarantee}%`
                                        : "99.9%"}
                                </div>
                            </div>

                            <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-5 rounded-xl text-center">
                                <Clock className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                                <div className="text-sm text-muted-foreground">
                                    Kontrak Min.
                                </div>
                                <div className="font-medium">
                                    {product.minimum_contract_months
                                        ? `${product.minimum_contract_months} Bulan`
                                        : "12 Bulan"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Description Section */}
            <section className="bg-slate-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-4">
                                Deskripsi Produk
                            </h2>
                            <div className="prose prose-blue max-w-none">
                                <div
                                    dangerouslySetInnerHTML={createMarkup(
                                        product.description
                                    )}
                                />
                            </div>

                            {/* Target customer */}
                            <div className="bg-white p-5 rounded-lg border border-slate-200 mt-6">
                                <h3 className="font-medium mb-3">
                                    Cocok Untuk:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <>
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            <Building className="h-3 w-3 mr-1 text-blue-500" />
                                            Small Business
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            <Users className="h-3 w-3 mr-1 text-blue-500" />
                                            Mid-Size Office
                                        </Badge>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-8">
                        <h2 className="text-3xl font-bold mb-3">Pilih Paket</h2>
                        <p className="text-muted-foreground">
                            Pilih paket layanan yang paling sesuai dengan
                            kebutuhan bisnis Anda
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {product.product_prices &&
                        product.product_prices.length > 0 ? (
                            <>
                                {/* Plans/pricing options */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {product.product_prices.map((price) => (
                                        <div
                                            key={price.id}
                                            className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                                                selectedPriceId === price.id
                                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 shadow-md"
                                                    : "hover:border-blue-200"
                                            }`}
                                            onClick={() =>
                                                setSelectedPriceId(price.id)
                                            }
                                        >
                                            <div className="flex flex-col h-full">
                                                <div className="mb-4">
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 mb-2 ${
                                                            selectedPriceId ===
                                                            price.id
                                                                ? "border-blue-500 bg-blue-500"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {selectedPriceId ===
                                                            price.id && (
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-medium mb-1">
                                                        {`Paket ${price.billing_cycle}`}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {price.billing_cycle}
                                                    </p>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-1 mb-4">
                                                        <span className="text-3xl font-bold text-blue-600">
                                                            {formatCurrency(
                                                                price.price
                                                            )}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            /
                                                            {price.billing_cycle ===
                                                            "Annually"
                                                                ? "tahun"
                                                                : "bulan"}
                                                        </span>
                                                    </div>

                                                    <ul className="space-y-2 mb-6">
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                            <span className="text-sm">
                                                                Kecepatan{" "}
                                                                {formatBandwidth(
                                                                    product.bandwidth,
                                                                    product.bandwidth_type
                                                                )}
                                                            </span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                            <span className="text-sm">
                                                                Dukungan teknis
                                                                24/7
                                                            </span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                                            <span className="text-sm">
                                                                Jaminan uptime{" "}
                                                                {product.uptime_guarantee ||
                                                                    99.9}
                                                                %
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <Button
                                                    variant={
                                                        selectedPriceId ===
                                                        price.id
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className={
                                                        selectedPriceId ===
                                                        price.id
                                                            ? "bg-blue-600 hover:bg-blue-700"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setSelectedPriceId(
                                                            price.id
                                                        )
                                                    }
                                                >
                                                    {selectedPriceId ===
                                                    price.id
                                                        ? "Paket Terpilih"
                                                        : "Pilih Paket"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Section */}
                                <div className="mt-8 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="p-8 md:p-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-3">
                                                    Mulai Berlangganan Sekarang
                                                </h3>
                                                <p className="text-blue-100 mb-6">
                                                    Tingkatkan konektivitas
                                                    bisnis Anda dengan{" "}
                                                    {product.name}. Tim kami
                                                    siap membantu Anda untuk
                                                    memulai.
                                                </p>
                                                <div className="space-y-3 text-sm text-blue-100">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-blue-300" />
                                                        <span>
                                                            Setup gratis dengan
                                                            kontrak min.{" "}
                                                            {product.minimum_contract_months ||
                                                                12}{" "}
                                                            bulan
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-blue-300" />
                                                        <span>
                                                            Proses aktivasi
                                                            cepat dalam 3-5 hari
                                                            kerja
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-blue-300" />
                                                        <span>
                                                            Gratis konsultasi
                                                            dan survei lokasi
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                                <div className="flex justify-between items-center pb-4 border-b border-white/20 mb-4">
                                                    <span className="text-sm font-medium text-white">
                                                        Total
                                                    </span>
                                                    {selectedPrice && (
                                                        <span className="text-2xl font-bold text-white">
                                                            {formatCurrency(
                                                                selectedPrice.price
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <Button
                                                        size="lg"
                                                        className="w-full bg-white text-blue-900 hover:bg-blue-50 transition-all hover:shadow-lg"
                                                        onClick={() =>
                                                            setShowOrderModal(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        Ajukan Sekarang
                                                    </Button>

                                                    <p className="text-xs text-center text-blue-200 mt-4">
                                                        Dengan menghubungi
                                                        sales, Anda menyetujui{" "}
                                                        <Link
                                                            href="#"
                                                            className="text-white hover:underline"
                                                        >
                                                            Syarat & Ketentuan
                                                        </Link>{" "}
                                                        serta{" "}
                                                        <Link
                                                            href="#"
                                                            className="text-white hover:underline"
                                                        >
                                                            Kebijakan Privasi
                                                        </Link>
                                                        .
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-10 bg-slate-50 rounded-lg border border-slate-200">
                                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium mb-2">
                                    Hubungi Kami untuk Informasi Harga
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Layanan ini memerlukan penawaran khusus. Tim
                                    sales kami siap membantu Anda.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                    <Button size="lg" className="flex-1">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Hubungi Sales
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                    >
                                        <CalendarCheck className="h-4 w-4 mr-2" />
                                        Jadwalkan Demo
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Contact card */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Butuh bantuan?
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tim kami siap membantu Anda 24/7
                                    </p>
                                </div>
                                <Button size="sm" className="ml-auto">
                                    Chat Sekarang
                                </Button>
                            </div>

                            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-5 flex items-center gap-4">
                                <div className="p-3 bg-amber-100 rounded-full">
                                    <Phone className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        Hubungi Sales
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Dapatkan penawaran khusus
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-auto"
                                >
                                    081234567890
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Tabs */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <Tabs defaultValue="features" className="w-full">
                            <TabsList className="w-full grid grid-cols-3 mb-8">
                                <TabsTrigger
                                    value="features"
                                    className="text-base"
                                >
                                    Fitur & Spesifikasi
                                </TabsTrigger>
                                <TabsTrigger value="faq" className="text-base">
                                    FAQ
                                </TabsTrigger>
                                <TabsTrigger
                                    value="technical"
                                    className="text-base"
                                >
                                    Info Teknis
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="features">
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <div className="prose prose-blue max-w-none">
                                        <h3 className="text-2xl font-semibold mb-6">
                                            Fitur Unggulan
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <ul className="space-y-4">
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Download className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Kecepatan Tinggi
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                {formatBandwidth(
                                                                    product.bandwidth,
                                                                    product.bandwidth_type
                                                                )}{" "}
                                                                simetris (upload
                                                                dan download)
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Globe className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Koneksi Handal
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                {
                                                                    product.connection_type
                                                                }{" "}
                                                                yang stabil dan
                                                                handal
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <ShieldCheck className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Jaminan Uptime
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                Garansi uptime{" "}
                                                                {product.uptime_guarantee ||
                                                                    99.9}
                                                                % dengan SLA
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <ul className="space-y-4">
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Dukungan Teknis
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                Dukungan teknis
                                                                24/7 dengan
                                                                waktu respons
                                                                cepat
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <PieChart className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Monitoring
                                                                Performa
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                Dashboard
                                                                monitoring
                                                                performa
                                                                real-time
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li className="flex gap-3">
                                                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium block">
                                                                Tim Profesional
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                Instalasi dan
                                                                setup oleh tim
                                                                profesional
                                                            </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-12">
                                            <h3 className="text-2xl font-semibold mb-6">
                                                Spesifikasi Teknis
                                            </h3>
                                            <div className="overflow-hidden bg-slate-50 rounded-xl border border-slate-200">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr className="border-b border-slate-200">
                                                            <td className="font-medium p-4 bg-slate-100 w-1/3">
                                                                Teknologi
                                                            </td>
                                                            <td className="p-4">
                                                                {product.connection_type ||
                                                                    "Fiber Optic"}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b border-slate-200">
                                                            <td className="font-medium p-4 bg-slate-100">
                                                                Bandwidth
                                                            </td>
                                                            <td className="p-4">
                                                                {formatBandwidth(
                                                                    product.bandwidth,
                                                                    product.bandwidth_type
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b border-slate-200">
                                                            <td className="font-medium p-4 bg-slate-100">
                                                                Jaminan Uptime
                                                            </td>
                                                            <td className="p-4">
                                                                {product.uptime_guarantee ||
                                                                    99.9}
                                                                %
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b border-slate-200">
                                                            <td className="font-medium p-4 bg-slate-100">
                                                                Kontrak Minimum
                                                            </td>
                                                            <td className="p-4">
                                                                {product.minimum_contract_months ||
                                                                    12}{" "}
                                                                bulan
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="mt-12">
                                            <h3 className="text-2xl font-semibold mb-6">
                                                Paket Termasuk
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>
                                                        Perangkat router standar
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>
                                                        Instalasi dan
                                                        konfigurasi
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>
                                                        Akses portal pelanggan
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>
                                                        Dukungan teknis 24/7
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>
                                                        Laporan performa bulanan
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                    <span>Jaminan SLA</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="faq">
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <h3 className="text-2xl font-semibold mb-6">
                                        Pertanyaan Umum
                                    </h3>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <AccordionItem
                                            value="faq-1"
                                            className="border border-slate-200 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50">
                                                Berapa lama proses instalasi dan
                                                setup?
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-4">
                                                <div className="text-muted-foreground">
                                                    Proses instalasi biasanya
                                                    memakan waktu 3-5 hari kerja
                                                    setelah survei lokasi dan
                                                    persetujuan. Waktu setup
                                                    dapat bervariasi tergantung
                                                    pada kompleksitas lokasi dan
                                                    ketersediaan infrastruktur.
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="faq-2"
                                            className="border border-slate-200 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50">
                                                Apakah ada biaya setup tambahan?
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-4">
                                                <div className="text-muted-foreground">
                                                    Untuk kontrak minimal 12
                                                    bulan, biaya setup sudah
                                                    termasuk. Untuk kontrak
                                                    lebih pendek atau lokasi
                                                    khusus, mungkin ada biaya
                                                    tambahan yang akan
                                                    diinformasikan setelah
                                                    survei lokasi.
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                        <AccordionItem
                                            value="faq-3"
                                            className="border border-slate-200 rounded-lg mb-4 overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50">
                                                Bagaimana jika terjadi gangguan
                                                koneksi?
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-4">
                                                <div className="text-muted-foreground">
                                                    Kami memiliki tim dukungan
                                                    teknis 24/7 yang bisa
                                                    dihubungi melalui hotline,
                                                    email, atau portal
                                                    pelanggan. Kami berkomitmen
                                                    merespon setiap laporan
                                                    gangguan dalam waktu 15
                                                    menit dan menyelesaikan
                                                    masalah sesuai dengan SLA
                                                    kami.
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </TabsContent>

                            <TabsContent value="technical">
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <div className="prose prose-blue max-w-none">
                                        <h3 className="text-2xl font-semibold mb-4">
                                            Informasi Teknis
                                        </h3>
                                        <p>
                                            {product.name} menggunakan teknologi{" "}
                                            {product.connection_type ||
                                                "fiber optic"}
                                            terkini yang menjamin kestabilan dan
                                            keandalan koneksi. Berikut adalah
                                            spesifikasi teknis dan informasi
                                            tambahan mengenai layanan ini.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                            <div>
                                                <h4 className="text-xl font-medium mb-4">
                                                    Spesifikasi Jaringan
                                                </h4>
                                                <ul className="space-y-3">
                                                    <li className="flex items-start gap-3">
                                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <Download className="h-3.5 w-3.5 text-blue-700" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                Throughput:
                                                            </span>{" "}
                                                            {formatBandwidth(
                                                                product.bandwidth,
                                                                product.bandwidth_type
                                                            )}{" "}
                                                            simetris
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <Clock className="h-3.5 w-3.5 text-blue-700" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                Latency:
                                                            </span>{" "}
                                                            {"< 15ms"}{" "}
                                                            (domestik),{" "}
                                                            {"< 100ms"}{" "}
                                                            (internasional)
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <X className="h-3.5 w-3.5 text-blue-700" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                Packet Loss:
                                                            </span>{" "}
                                                            {"< 0.1%"}
                                                        </div>
                                                    </li>
                                                    <li className="flex items-start gap-3">
                                                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <Upload className="h-3.5 w-3.5 text-blue-700" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                Jitter:
                                                            </span>{" "}
                                                            {"< 5ms"}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="text-xl font-medium mb-4">
                                                    Service Level Agreement
                                                    (SLA)
                                                </h4>
                                                <div className="overflow-hidden rounded-lg border border-slate-200">
                                                    <table className="w-full">
                                                        <tbody>
                                                            <tr className="border-b border-slate-200">
                                                                <td className="font-medium p-3 bg-slate-50">
                                                                    Jaminan
                                                                    Uptime
                                                                </td>
                                                                <td className="p-3">
                                                                    {product.uptime_guarantee ||
                                                                        99.9}
                                                                    %
                                                                </td>
                                                            </tr>
                                                            <tr className="border-b border-slate-200">
                                                                <td className="font-medium p-3 bg-slate-50">
                                                                    Waktu
                                                                    Respons
                                                                </td>
                                                                <td className="p-3">
                                                                    15 menit
                                                                </td>
                                                            </tr>
                                                            <tr className="border-b border-slate-200">
                                                                <td className="font-medium p-3 bg-slate-50">
                                                                    Waktu
                                                                    Penyelesaian
                                                                </td>
                                                                <td className="p-3">
                                                                    4 jam (jam
                                                                    kerja) / 8
                                                                    jam (di luar
                                                                    jam kerja)
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="font-medium p-3 bg-slate-50">
                                                                    Pemeliharaan
                                                                    Terjadwal
                                                                </td>
                                                                <td className="p-3">
                                                                    Pemberitahuan
                                                                    7 hari
                                                                    sebelumnya
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <h4 className="text-xl font-medium mt-8 mb-4">
                                                    Kompatibilitas Perangkat
                                                </h4>
                                                <p className="text-muted-foreground">
                                                    Layanan ini kompatibel
                                                    dengan sebagian besar
                                                    perangkat jaringan standar.
                                                    Kami menyediakan router yang
                                                    sesuai dengan kebutuhan
                                                    pelanggan, namun pelanggan
                                                    juga dapat menggunakan
                                                    perangkat sendiri selama
                                                    memenuhi spesifikasi
                                                    minimal.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8 text-center">
                                Produk Terkait
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedProducts.map((relProduct) => (
                                    <Card
                                        key={relProduct.id}
                                        className="overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {relProduct.is_featured && (
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-1.5 px-3 text-xs font-medium text-center">
                                                PAKET FAVORIT
                                            </div>
                                        )}
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl">
                                                        {relProduct.name}
                                                    </CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {relProduct.description?.substring(
                                                            0,
                                                            100
                                                        )}
                                                    </CardDescription>
                                                </div>
                                                <div className="bg-slate-100 p-2 rounded-full">
                                                    {getConnectionIcon(
                                                        relProduct.connection_type
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    {relProduct.product_prices &&
                                                    relProduct.product_prices
                                                        .length > 0 ? (
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-1">
                                                                Mulai dari
                                                            </p>
                                                            <div className="flex items-end gap-1.5">
                                                                <span className="text-2xl font-bold text-blue-600">
                                                                    {formatCurrency(
                                                                        Math.min(
                                                                            ...relProduct.product_prices.map(
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
                                                            Hubungi untuk harga
                                                        </p>
                                                    )}
                                                </div>

                                                <Separator />

                                                <div className="flex items-start gap-2">
                                                    <Download className="h-4 w-4 text-blue-500 mt-0.5" />
                                                    <div>
                                                        <span className="text-sm text-muted-foreground">
                                                            Kecepatan
                                                        </span>
                                                        <p className="font-medium">
                                                            {formatBandwidth(
                                                                relProduct.bandwidth,
                                                                relProduct.bandwidth_type
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <Button className="w-full" asChild>
                                                <Link
                                                    href={route("product", {
                                                        slug: relProduct.code,
                                                    })}
                                                >
                                                    Lihat Detail{" "}
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA section */}
            <section className="py-16 bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Tingkatkan Konektivitas Bisnis Anda
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Dapatkan konsultasi gratis dan penawaran khusus
                            untuk layanan {product.name}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-900 hover:bg-blue-50"
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                Hubungi Sales
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                Jadwalkan Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Details Tabs */}
            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <Tabs
                        defaultValue="features"
                        className="w-full max-w-4xl mx-auto"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="features">
                                Fitur & Spesifikasi
                            </TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                            <TabsTrigger value="technical">
                                Info Teknis
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="features" className="mt-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose prose-blue max-w-none">
                                        <h3>Fitur Unggulan</h3>
                                        <ul>
                                            <li>
                                                Kecepatan{" "}
                                                {formatBandwidth(
                                                    product.bandwidth,
                                                    product.bandwidth_type
                                                )}{" "}
                                                simetris (upload dan download)
                                            </li>
                                            <li>
                                                Koneksi{" "}
                                                {product.connection_type} yang
                                                stabil dan handal
                                            </li>
                                            <li>
                                                Jaminan uptime{" "}
                                                {product.uptime_guarantee ||
                                                    99.9}
                                                %
                                            </li>
                                            <li>
                                                Dukungan teknis 24/7 dengan
                                                waktu respon cepat
                                            </li>
                                            <li>
                                                Dashboard monitoring performa
                                                real-time
                                            </li>
                                            <li>Tim instalasi profesional</li>
                                        </ul>

                                        <h3>Spesifikasi Teknis</h3>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="font-medium">
                                                        Teknologi
                                                    </td>
                                                    <td>
                                                        {product.connection_type ||
                                                            "Fiber Optic"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Bandwidth
                                                    </td>
                                                    <td>
                                                        {formatBandwidth(
                                                            product.bandwidth,
                                                            product.bandwidth_type
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Jaminan Uptime
                                                    </td>
                                                    <td>
                                                        {product.uptime_guarantee ||
                                                            99.9}
                                                        %
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Kontrak Minimum
                                                    </td>
                                                    <td>
                                                        {product.minimum_contract_months ||
                                                            12}{" "}
                                                        bulan
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h3>Paket Termasuk</h3>
                                        <ul>
                                            <li>
                                                Perangkat router standar (sesuai
                                                kebutuhan)
                                            </li>
                                            <li>Instalasi dan konfigurasi</li>
                                            <li>Akses ke portal pelanggan</li>
                                            <li>Dukungan teknis 24/7</li>
                                            <li>Laporan performa bulanan</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="faq" className="mt-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        <>
                                            <AccordionItem value="faq-1">
                                                <AccordionTrigger>
                                                    Berapa lama proses instalasi
                                                    dan setup?
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    Proses instalasi biasanya
                                                    memakan waktu 3-5 hari kerja
                                                    setelah survei lokasi dan
                                                    persetujuan. Waktu setup
                                                    dapat bervariasi tergantung
                                                    pada kompleksitas lokasi dan
                                                    ketersediaan infrastruktur.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="faq-2">
                                                <AccordionTrigger>
                                                    Apakah ada biaya setup
                                                    tambahan?
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    Untuk kontrak minimal 12
                                                    bulan, biaya setup sudah
                                                    termasuk. Untuk kontrak
                                                    lebih pendek atau lokasi
                                                    khusus, mungkin ada biaya
                                                    tambahan yang akan
                                                    diinformasikan setelah
                                                    survei lokasi.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="faq-3">
                                                <AccordionTrigger>
                                                    Bagaimana jika terjadi
                                                    gangguan koneksi?
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    Kami memiliki tim dukungan
                                                    teknis 24/7 yang bisa
                                                    dihubungi melalui hotline,
                                                    email, atau portal
                                                    pelanggan. Kami berkomitmen
                                                    merespon setiap laporan
                                                    gangguan dalam waktu 15
                                                    menit dan menyelesaikan
                                                    masalah sesuai dengan SLA
                                                    kami.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </>
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="technical" className="mt-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose prose-blue max-w-none">
                                        <h3>Informasi Teknis</h3>
                                        <p>
                                            {product.name} menggunakan teknologi{" "}
                                            {product.connection_type ||
                                                "fiber optic"}
                                            terkini yang menjamin kestabilan dan
                                            keandalan koneksi. Berikut adalah
                                            spesifikasi teknis dan informasi
                                            tambahan mengenai layanan ini.
                                        </p>

                                        <h4>Spesifikasi Jaringan</h4>
                                        <ul>
                                            <li>
                                                Throughput:{" "}
                                                {formatBandwidth(
                                                    product.bandwidth,
                                                    product.bandwidth_type
                                                )}{" "}
                                                simetris
                                            </li>
                                            <li>
                                                Latency: {"< 15ms"} (domestik),{" "}
                                                {"< 100ms"} (internasional)
                                            </li>
                                            <li>Packet Loss: {"< 0.1%"}</li>
                                            <li>Jitter: {"< 5ms"}</li>
                                        </ul>

                                        <h4>Kompatibilitas Perangkat</h4>
                                        <p>
                                            Layanan ini kompatibel dengan
                                            sebagian besar perangkat jaringan
                                            standar. Kami menyediakan router
                                            yang sesuai dengan kebutuhan
                                            pelanggan, namun pelanggan juga
                                            dapat menggunakan perangkat sendiri
                                            selama memenuhi spesifikasi minimal.
                                        </p>

                                        <h4>Service Level Agreement (SLA)</h4>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="font-medium">
                                                        Jaminan Uptime
                                                    </td>
                                                    <td>
                                                        {product.uptime_guarantee ||
                                                            99.9}
                                                        %
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Waktu Respons
                                                    </td>
                                                    <td>15 menit</td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Waktu Penyelesaian
                                                    </td>
                                                    <td>
                                                        4 jam (jam kerja) / 8
                                                        jam (di luar jam kerja)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-medium">
                                                        Pemeliharaan Terjadwal
                                                    </td>
                                                    <td>
                                                        Pemberitahuan 7 hari
                                                        sebelumnya
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">
                            Produk Terkait
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProducts.map((relProduct) => (
                                <Card
                                    key={relProduct.id}
                                    className="overflow-hidden"
                                >
                                    {relProduct.is_featured && (
                                        <div className="bg-blue-600 text-white py-1 px-3 text-xs font-medium text-center">
                                            PAKET FAVORIT
                                        </div>
                                    )}
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {relProduct.name}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {relProduct.description?.substring(
                                                        0,
                                                        100
                                                    )}
                                                </CardDescription>
                                            </div>
                                            <div className="bg-slate-100 p-2 rounded-full">
                                                {getConnectionIcon(
                                                    relProduct.connection_type
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                {relProduct.product_prices &&
                                                relProduct.product_prices
                                                    .length > 0 ? (
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">
                                                            Mulai dari
                                                        </p>
                                                        <div className="flex items-end gap-1.5">
                                                            <span className="text-2xl font-bold text-blue-600">
                                                                {formatCurrency(
                                                                    Math.min(
                                                                        ...relProduct.product_prices.map(
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
                                                        Hubungi untuk harga
                                                    </p>
                                                )}
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <Download className="h-4 w-4 text-blue-500 mt-0.5" />
                                                    <div>
                                                        <span className="text-sm text-muted-foreground">
                                                            Kecepatan
                                                        </span>
                                                        <p className="font-medium">
                                                            {formatBandwidth(
                                                                relProduct.bandwidth,
                                                                relProduct.bandwidth_type
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-3 pt-0">
                                        <Button className="w-full" asChild>
                                            <Link
                                                href={route("product", {
                                                    slug: relProduct.code,
                                                })}
                                            >
                                                Lihat Detail{" "}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA section */}
            <section className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Tingkatkan Konektivitas Bisnis Anda Sekarang
                        </h2>
                        <p className="text-lg text-blue-100 mb-8">
                            Dapatkan konsultasi gratis dan penawaran khusus dari
                            tim sales kami
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-blue-900 hover:bg-blue-50"
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                Hubungi Sales
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                            >
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                Jadwalkan Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
                        <DialogTitle className="text-xl md:text-2xl font-bold">
                            Buat Langganan Baru
                        </DialogTitle>
                        <DialogDescription className="text-blue-100 opacity-90 mt-1">
                            Anda sedang membuat langganan untuk produk{" "}
                            {product.name}
                        </DialogDescription>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Information Card */}
                            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                                <div className="p-4 bg-slate-100 border-b border-slate-200">
                                    <h3 className="font-medium text-slate-800">
                                        Informasi Produk
                                    </h3>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Nama Produk
                                            </div>
                                            <div className="font-medium">
                                                {product.name}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Kategori
                                            </div>
                                            <div className="font-medium">
                                                {product.category?.name || "-"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Bandwidth
                                            </div>
                                            <div className="font-medium">
                                                {formatBandwidth(
                                                    product.bandwidth,
                                                    product.bandwidth_type
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Kontrak Minimum
                                            </div>
                                            <div className="font-medium">
                                                {product.minimum_contract_months ||
                                                    12}{" "}
                                                bulan
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Jaminan Uptime
                                            </div>
                                            <div className="font-medium">
                                                {product.uptime_guarantee ||
                                                    "99.9"}
                                                %
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                Teknologi
                                            </div>
                                            <div className="font-medium">
                                                {product.connection_type ||
                                                    "Fiber Optic"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Package Information */}
                            <div className="bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
                                <div className="p-4 bg-blue-100 border-b border-blue-200">
                                    <h3 className="font-medium text-blue-800">
                                        Detail Paket
                                    </h3>
                                </div>

                                <div className="p-4">
                                    {selectedPrice ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Nama Paket
                                                    </div>
                                                    <div className="font-medium">
                                                        {`Paket ${selectedPrice.billing_cycle}`}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Billing Cycle
                                                    </div>
                                                    <div className="font-medium">
                                                        {
                                                            selectedPrice.billing_cycle
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Harga
                                                    </div>
                                                    <div className="font-bold text-blue-700 text-lg">
                                                        {formatCurrency(
                                                            selectedPrice.price
                                                        )}
                                                        <span className="text-sm font-normal text-muted-foreground ml-1">
                                                            /
                                                            {selectedPrice.billing_cycle ===
                                                            "Annually"
                                                                ? "tahun"
                                                                : "bulan"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Nomor Langganan
                                                    </div>
                                                    <div className="font-medium">
                                                        {
                                                            data.subscription_number
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-4 border-t border-blue-100">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="auto_renew"
                                                        checked={
                                                            data.auto_renew
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "auto_renew",
                                                                e.target
                                                                    .checked as false
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                                    />
                                                    <Label
                                                        htmlFor="auto_renew"
                                                        className="cursor-pointer"
                                                    >
                                                        Perpanjang otomatis saat
                                                        masa berlangganan habis
                                                    </Label>
                                                </div>
                                                {errors.auto_renew && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.auto_renew}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-amber-800">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-amber-500"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>
                                                    Tidak ada paket yang
                                                    dipilih. Silahkan pilih
                                                    paket terlebih dahulu.
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subscription Period */}
                            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                                <div className="p-4 bg-slate-100 border-b border-slate-200">
                                    <h3 className="font-medium text-slate-800">
                                        Periode Berlangganan
                                    </h3>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">
                                                Tanggal Mulai{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            {errors.start_date && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">
                                                Tanggal Berakhir
                                            </Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                disabled
                                                className="bg-slate-50"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Tanggal berakhir dihitung
                                                otomatis berdasarkan billing
                                                cycle
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                                        <div className="flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-blue-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-blue-800">
                                                Untuk paket{" "}
                                                <strong>
                                                    {selectedPrice?.billing_cycle ||
                                                        "-"}
                                                </strong>
                                                , langganan Anda akan berakhir
                                                pada{" "}
                                                <strong>
                                                    {data.end_date || "-"}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                                <div className="p-4 bg-slate-100 border-b border-slate-200">
                                    <h3 className="font-medium text-slate-800">
                                        Informasi Pengguna
                                    </h3>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_id">User ID</Label>
                                        <div className="flex gap-3 items-center">
                                            <Input
                                                id="user_id"
                                                value={data.user_id}
                                                disabled
                                                className="bg-slate-50"
                                            />
                                            <div className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {auth.user?.name ||
                                                    "Current User"}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Langganan akan dibuat untuk akun
                                            yang sedang login
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary & Total */}
                            <div className="bg-slate-800 text-white rounded-xl overflow-hidden border border-slate-700">
                                <div className="p-4 bg-slate-700 border-b border-slate-600">
                                    <h3 className="font-medium text-white">
                                        Ringkasan Langganan
                                    </h3>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-300">
                                                Produk
                                            </span>
                                            <span className="font-medium">
                                                {product.name}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-300">
                                                Paket
                                            </span>
                                            <span className="font-medium">
                                                {`Paket ${selectedPrice?.billing_cycle}`}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-300">
                                                Periode
                                            </span>
                                            <span className="font-medium">
                                                {data.start_date
                                                    ? new Date(
                                                          data.start_date
                                                      ).toLocaleDateString()
                                                    : "-"}{" "}
                                                s/d{" "}
                                                {data.end_date
                                                    ? new Date(
                                                          data.end_date
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </span>
                                        </div>

                                        <div className="pt-3 mt-3 border-t border-slate-600 flex justify-between items-center">
                                            <span className="text-slate-200 font-medium">
                                                Total
                                            </span>
                                            <span className="text-xl font-bold text-white">
                                                {selectedPrice
                                                    ? formatCurrency(
                                                          selectedPrice.price
                                                      )
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-amber-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-amber-800 mb-1">
                                            Informasi Penting
                                        </h4>
                                        <p className="text-sm text-amber-800">
                                            Dengan membuat langganan ini, Anda
                                            setuju untuk mematuhi syarat dan
                                            ketentuan layanan kami. Langganan
                                            akan aktif sejak tanggal mulai, dan
                                            Anda akan ditagih sesuai dengan
                                            billing cycle yang dipilih.
                                        </p>
                                        <p className="text-sm text-amber-800 mt-2">
                                            Admin akan menyetujui permintaan
                                            langganan Anda sebelum diaktifkan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-6 gap-2 flex flex-col sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowOrderModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !selectedPrice}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Memproses...
                                        </>
                                    ) : (
                                        "Buat Langganan"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </GuestLayout>
    );
};

export default ProductShow;
