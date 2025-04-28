import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Manager,
    PageProps,
    Product,
    ProductPrice,
    Subscription,
    User,
} from "@/types";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Download,
    FileText,
    X,
    User as UserIcon,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";

interface SubscriptionsShowProps extends PageProps {
    subscription: Subscription;
    product_price: ProductPrice;
    product: Product;
    approved_by: Manager | null;
    user: User;
    canApproveSubscriptions: boolean;
    canRejectSubscriptions: boolean;
}

const SubscriptionShow = () => {
    const {
        subscription,
        product_price,
        product,
        approved_by,
        user,
        canApproveSubscriptions,
        canRejectSubscriptions,
        auth,
    } = usePage<SubscriptionsShowProps>().props;

    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        notes: "",
    });

    // Helper function untuk format tanggal
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    // Helper function untuk format mata uang
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Function untuk menampilkan badge status
    const getStatusBadge = (status: string) => {
        const statusConfig: {
            [key: string]: { color: string; label: string };
        } = {
            active: {
                color: "bg-green-100 text-green-800 border-green-200",
                label: "Aktif",
            },
            pending_approval: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                label: "Menunggu Persetujuan",
            },
            cancelled: {
                color: "bg-red-100 text-red-800 border-red-200",
                label: "Dibatalkan",
            },
            expired: {
                color: "bg-gray-100 text-gray-800 border-gray-200",
                label: "Kadaluarsa",
            },
            rejected: {
                color: "bg-red-100 text-red-800 border-red-200",
                label: "Ditolak",
            },
        };

        const config = statusConfig[status] || {
            color: "bg-slate-100 text-slate-800",
            label: status,
        };

        return (
            <Badge variant="outline" className={`${config.color} capitalize`}>
                {config.label}
            </Badge>
        );
    };

    const handleApprove = () => {
        post(route("subscriptions.approve", subscription.id), {
            onSuccess: () => {
                reset();
                setShowApproveDialog(false);
            },
        });
    };

    const handleReject = () => {
        post(route("subscriptions.reject", subscription.id), {
            onSuccess: () => {
                reset();
                setShowRejectDialog(false);
            },
        });
    };

    const handleCancel = () => {
        post(route("subscriptions.cancel", subscription.id), {
            onSuccess: () => {
                reset();
                setShowCancelDialog(false);
            },
        });
    };

    const formatBandwidth = (value: number, type: string) => {
        if (!value) return "N/A";
        return `${value} ${type || "Mbps"}`;
    };

    const getDisplayStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            active: "Aktif",
            pending_approval: "Menunggu Persetujuan",
            cancelled: "Dibatalkan",
            expired: "Kadaluarsa",
            rejected: "Ditolak",
        };

        return statusMap[status] || status;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Subscription #${subscription.subscription_number}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header dengan breadcrumbs dan actions */}
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route("subscriptions.index")}>
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Kembali
                                </Link>
                            </Button>

                            {getStatusBadge(subscription.status)}
                        </div>

                        <div className="flex gap-2">
                            {/* Action buttons based on subscription status */}
                            {subscription.status === "pending_approval" &&
                                canApproveSubscriptions && (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                            setShowApproveDialog(true)
                                        }
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Setujui
                                    </Button>
                                )}

                            {subscription.status === "pending_approval" &&
                                canRejectSubscriptions && (
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            setShowRejectDialog(true)
                                        }
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Tolak
                                    </Button>
                                )}

                            {subscription.status === "active" && (
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowCancelDialog(true)}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Batalkan
                                </Button>
                            )}

                            <Button variant="outline" size="icon">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Subscription details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl font-bold">
                                                {product.name}
                                            </CardTitle>
                                            <p className="text-sm text-gray-500">
                                                #
                                                {
                                                    subscription.subscription_number
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <Tabs
                                        defaultValue="details"
                                        className="w-full"
                                    >
                                        <TabsList className="w-full grid grid-cols-3 mb-6">
                                            <TabsTrigger value="details">
                                                Detail Langganan
                                            </TabsTrigger>
                                            <TabsTrigger value="product">
                                                Info Produk
                                            </TabsTrigger>
                                            <TabsTrigger value="activity">
                                                Aktivitas
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value="details"
                                            className="space-y-6"
                                        >
                                            {/* Status Bar */}
                                            <div className="bg-slate-50 border rounded-lg overflow-hidden">
                                                <div className="p-4">
                                                    <h3 className="text-lg font-medium mb-2">
                                                        Status Langganan
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(
                                                            subscription.status
                                                        )}
                                                        <span>
                                                            {getDisplayStatus(
                                                                subscription.status
                                                            )}
                                                        </span>
                                                    </div>

                                                    {subscription.status ===
                                                        "pending_approval" && (
                                                        <div className="mt-3 flex items-start gap-3 text-sm p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
                                                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                                                            <div>
                                                                <p>
                                                                    Langganan
                                                                    ini sedang
                                                                    menunggu
                                                                    persetujuan
                                                                    admin.
                                                                </p>
                                                                <p className="mt-1">
                                                                    Layanan akan
                                                                    diaktifkan
                                                                    setelah
                                                                    disetujui.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {subscription.status ===
                                                        "active" && (
                                                        <div className="mt-3 flex items-start gap-3 text-sm p-3 bg-green-50 text-green-800 rounded-lg border border-green-100">
                                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                            <div>
                                                                <p>
                                                                    Langganan
                                                                    aktif dan
                                                                    berjalan
                                                                    normal.
                                                                </p>
                                                                <p className="mt-1">
                                                                    Disetujui
                                                                    pada{" "}
                                                                    {formatDate(
                                                                        subscription.approved_at ||
                                                                            ""
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Subscription Period */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">
                                                    Periode Langganan
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Tanggal
                                                                    Mulai
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatDate(
                                                                        subscription.start_date
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Tanggal
                                                                    Berakhir
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatDate(
                                                                        subscription.end_date
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Billing Details */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-3">
                                                    Detail Penagihan
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start gap-3">
                                                            <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Siklus
                                                                    Penagihan
                                                                </span>
                                                                <span className="font-medium capitalize">
                                                                    {
                                                                        product_price.billing_cycle
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Tagihan
                                                                    Berikutnya
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatDate(
                                                                        subscription.next_billing_date
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 border rounded-lg overflow-hidden">
                                                    <div className="bg-slate-100 p-3 border-b">
                                                        <h4 className="font-medium">
                                                            Pengaturan
                                                            Perpanjangan
                                                        </h4>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {subscription.auto_renew ? (
                                                                <>
                                                                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100">
                                                                        <RefreshCw className="h-3 w-3 text-green-600" />
                                                                    </div>
                                                                    <span>
                                                                        Perpanjangan
                                                                        otomatis{" "}
                                                                        <strong>
                                                                            diaktifkan
                                                                        </strong>
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-red-100">
                                                                        <X className="h-3 w-3 text-red-600" />
                                                                    </div>
                                                                    <span>
                                                                        Perpanjangan
                                                                        otomatis{" "}
                                                                        <strong>
                                                                            dinonaktifkan
                                                                        </strong>
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Approval Information (if applicable) */}
                                            {subscription.approved_at && (
                                                <div className="border rounded-lg overflow-hidden">
                                                    <div className="bg-green-50 p-3 border-b border-green-100">
                                                        <h4 className="font-medium text-green-800">
                                                            Informasi
                                                            Persetujuan
                                                        </h4>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Disetujui
                                                                    Oleh
                                                                </span>
                                                                <span className="font-medium">
                                                                    {approved_by?.name ||
                                                                        "N/A"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Disetujui
                                                                    Pada
                                                                </span>
                                                                <span className="font-medium">
                                                                    {subscription.approved_at
                                                                        ? formatDate(
                                                                              subscription.approved_at
                                                                          )
                                                                        : "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {subscription.approval_notes && (
                                                            <div>
                                                                <span className="text-sm text-slate-500 block mb-1">
                                                                    Catatan
                                                                    Persetujuan
                                                                </span>
                                                                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm">
                                                                    {
                                                                        subscription.approval_notes
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cancellation Information (if applicable) */}
                                            {subscription.cancelled_at && (
                                                <div className="border rounded-lg overflow-hidden">
                                                    <div className="bg-red-50 p-3 border-b border-red-100">
                                                        <h4 className="font-medium text-red-800">
                                                            Informasi Pembatalan
                                                        </h4>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <span className="text-sm text-slate-500 block">
                                                                    Dibatalkan
                                                                    Pada
                                                                </span>
                                                                <span className="font-medium">
                                                                    {subscription.cancelled_at
                                                                        ? formatDate(
                                                                              subscription.cancelled_at
                                                                          )
                                                                        : "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {subscription.cancellation_notes && (
                                                            <div>
                                                                <span className="text-sm text-slate-500 block mb-1">
                                                                    Alasan
                                                                    Pembatalan
                                                                </span>
                                                                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm">
                                                                    {
                                                                        subscription.cancellation_notes
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="product">
                                            {/* Product Details */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">
                                                        Informasi Produk
                                                    </h3>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="min-w-full">
                                                            <tbody>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Nama
                                                                        Produk
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            product_price
                                                                                .product
                                                                                .name
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Kode
                                                                        Produk
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {
                                                                            product_price
                                                                                .product
                                                                                .code
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Bandwidth
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {formatBandwidth(
                                                                            product_price
                                                                                .product
                                                                                .bandwidth,
                                                                            product_price
                                                                                .product
                                                                                .bandwidth_type
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Jenis
                                                                        Koneksi
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {product_price
                                                                            .product
                                                                            .connection_type ||
                                                                            "Standard"}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Jaminan
                                                                        Uptime
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {product_price
                                                                            .product
                                                                            .uptime_guarantee ||
                                                                            99.9}
                                                                        %
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">
                                                        Paket Langganan
                                                    </h3>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="min-w-full">
                                                            <tbody>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Nama
                                                                        Paket
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {`Paket ${product_price.billing_cycle}`}
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-b">
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Harga
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {formatCurrency(
                                                                            product_price.price
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="px-4 py-3 bg-slate-50 font-medium">
                                                                        Siklus
                                                                        Penagihan
                                                                    </td>
                                                                    <td className="px-4 py-3 capitalize">
                                                                        {
                                                                            product_price.billing_cycle
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">
                                                        Deskripsi Produk
                                                    </h3>
                                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    product_price
                                                                        .product
                                                                        .description ||
                                                                    "-",
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="activity">
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-medium mb-3">
                                                    Riwayat Aktivitas
                                                </h3>
                                                <div className="relative">
                                                    <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200"></div>
                                                    <div className="space-y-6">
                                                        <div className="relative pl-10">
                                                            <div className="absolute left-0 rounded-full h-8 w-8 bg-blue-100 flex items-center justify-center">
                                                                <FileText className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-medium">
                                                                        Langganan
                                                                        dibuat
                                                                    </h4>
                                                                    <span className="text-sm text-slate-500">
                                                                        {formatDate(
                                                                            subscription.created_at
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-slate-500 mt-1">
                                                                    Langganan
                                                                    dibuat oleh{" "}
                                                                    {user.name}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {subscription.status ===
                                                            "approved" && (
                                                            <div className="relative pl-10">
                                                                <div className="absolute left-0 rounded-full h-8 w-8 bg-green-100 flex items-center justify-center">
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-medium">
                                                                            Langganan
                                                                            disetujui
                                                                        </h4>
                                                                        <span className="text-sm text-slate-500">
                                                                            {formatDate(
                                                                                subscription.approved_at ??
                                                                                    "-"
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-500 mt-1">
                                                                        Disetujui
                                                                        oleh{" "}
                                                                        {approved_by?.name ||
                                                                            "N/A"}
                                                                    </p>
                                                                    {subscription.approval_notes && (
                                                                        <div className="mt-2 bg-slate-50 p-2 rounded text-sm">
                                                                            {
                                                                                subscription.approval_notes
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {subscription.status ===
                                                            "cancelled" && (
                                                            <div className="relative pl-10">
                                                                <div className="absolute left-0 rounded-full h-8 w-8 bg-red-100 flex items-center justify-center">
                                                                    <X className="h-4 w-4 text-red-600" />
                                                                </div>
                                                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-medium">
                                                                            Langganan
                                                                            dibatalkan
                                                                        </h4>
                                                                        <span className="text-sm text-slate-500">
                                                                            {formatDate(
                                                                                subscription.cancelled_at ??
                                                                                    "-"
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {subscription.cancellation_notes && (
                                                                        <div className="mt-2 bg-slate-50 p-2 rounded text-sm">
                                                                            {
                                                                                subscription.cancellation_notes
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Rejection Information (if applicable) */}
                                                        {subscription.status ===
                                                            "rejected" && (
                                                            <div className="border rounded-lg overflow-hidden">
                                                                <div className="bg-red-50 p-3 border-b border-red-100">
                                                                    <h4 className="font-medium text-red-800">
                                                                        Informasi
                                                                        Penolakan
                                                                    </h4>
                                                                </div>
                                                                <div className="p-4">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                                        <div>
                                                                            <span className="text-sm text-slate-500 block">
                                                                                Ditolak
                                                                                Oleh
                                                                            </span>
                                                                            <span className="font-medium">
                                                                                {approved_by?.name ||
                                                                                    "N/A"}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-sm text-slate-500 block">
                                                                                Ditolak
                                                                                Pada
                                                                            </span>
                                                                            <span className="font-medium">
                                                                                {subscription.rejected_at
                                                                                    ? formatDate(
                                                                                          subscription.rejected_at
                                                                                      )
                                                                                    : formatDate(
                                                                                          subscription.approved_at ||
                                                                                              ""
                                                                                      )}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {subscription.approval_notes && (
                                                                        <div>
                                                                            <span className="text-sm text-slate-500 block mb-1">
                                                                                Alasan
                                                                                Penolakan
                                                                            </span>
                                                                            <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm">
                                                                                {
                                                                                    subscription.approval_notes
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column - Sidebar information */}
                        <div className="space-y-6">
                            {/* Price Summary */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        Ringkasan Biaya
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Harga Layanan
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(
                                                product_price.price
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Billing Cycle
                                        </span>
                                        <span className="capitalize">
                                            {product_price.billing_cycle}
                                        </span>
                                    </div>

                                    <div className="pt-3 mt-3 border-t border-dashed">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">
                                                Total
                                            </span>
                                            <span className="font-bold text-lg">
                                                {formatCurrency(
                                                    product_price.price
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Info */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        Informasi Pelanggan
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <UserIcon className="h-6 w-6 text-slate-500" />
                                        </div>
                                        <div>
                                            <span className="font-medium block">
                                                {user.name}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Actions */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">
                                        Aksi Cepat
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Unduh Invoice
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Lihat Riwayat Pembayaran
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <Dialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Langganan</DialogTitle>
                        <DialogDescription>
                            Anda akan menyetujui langganan untuk {product.name}{" "}
                            dengan ID #{subscription.subscription_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-2">
                        <p className="text-sm">
                            Setelah disetujui, layanan akan aktif dan pengguna
                            akan dapat menggunakan layanan ini.
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Catatan Persetujuan (Opsional)
                            </label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Tambahkan catatan persetujuan jika diperlukan"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowApproveDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleApprove}
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Setujui Langganan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Langganan</DialogTitle>
                        <DialogDescription>
                            Anda akan menolak langganan untuk {product.name}{" "}
                            dengan ID #{subscription.subscription_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-2">
                        <p className="text-sm">
                            Langganan ini akan ditolak dan tidak dapat digunakan
                            oleh pengguna.
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Alasan Penolakan (Wajib)
                            </label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Berikan alasan mengapa langganan ini ditolak"
                                required
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-xs">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing || !data.notes}
                        >
                            {processing ? "Memproses..." : "Tolak Langganan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Batalkan Langganan</DialogTitle>
                        <DialogDescription>
                            Anda akan membatalkan langganan untuk {product.name}{" "}
                            dengan ID #{subscription.subscription_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 my-2">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium">Peringatan!</p>
                                <p>
                                    Membatalkan langganan akan menghentikan
                                    layanan untuk pengguna. Tindakan ini tidak
                                    dapat dibatalkan.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Alasan Pembatalan (Wajib)
                            </label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Berikan alasan mengapa langganan ini dibatalkan"
                                required
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-xs">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={processing || !data.notes}
                        >
                            {processing ? "Memproses..." : "Batalkan Langganan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default SubscriptionShow;
