import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Transaction } from "@/types";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    ArrowLeftCircle,
    Calendar,
    Clock,
    Edit,
    File,
    Download,
    Trash2,
    CreditCard,
    User,
    DollarSign,
    ArrowDownLeft,
    ArrowUpRight,
    FileText,
    AlertCircle,
    Printer,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ShowTransactionPageProps extends PageProps {
    transaction: Transaction;
}

const TransactionShow: React.FC = () => {
    const { transaction } = usePage<ShowTransactionPageProps>().props;

    return (
        <AuthenticatedLayout title="Detail Transaksi">
            <Head title={`Transaksi #${transaction.id}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <Link
                        href={route("transactions.index")}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ArrowLeftCircle className="w-4 h-4 mr-1" />
                        Kembali ke Daftar Transaksi
                    </Link>

                    {/* Main card */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        {/* Header */}
                        <div
                            className={`px-6 py-4 border-l-4 ${
                                transaction.type === "credit"
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            transaction.type === "credit"
                                                ? "bg-green-100"
                                                : "bg-red-100"
                                        }`}
                                    >
                                        {transaction.type === "credit" ? (
                                            <ArrowDownLeft
                                                className={`w-5 h-5 ${
                                                    transaction.type ===
                                                    "credit"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            />
                                        ) : (
                                            <ArrowUpRight
                                                className={`w-5 h-5 ${
                                                    transaction.type ===
                                                    "credit"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            />
                                        )}
                                    </div>

                                    <div className="ml-4">
                                        <h1 className="text-lg font-semibold text-gray-900">
                                            {transaction.type === "credit"
                                                ? "Pemasukan"
                                                : "Pengeluaran"}
                                            <span className="text-gray-500 ml-2">
                                                #{transaction.id}
                                            </span>
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            {transaction.description ||
                                                (transaction.type === "credit"
                                                    ? "Pemasukan"
                                                    : "Pengeluaran")}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`text-xl font-bold ${
                                        transaction.type === "credit"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {transaction.type === "credit" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </div>
                            </div>
                        </div>

                        {/* Transaction details */}
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column */}
                                <div className="space-y-4">
                                    {/* Transaction Date */}
                                    <div className="flex items-start">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Tanggal Transaksi
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Transaction Type */}
                                    <div className="flex items-start">
                                        <File className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Jenis Transaksi
                                            </h3>
                                            <p className="mt-1 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        transaction.type ===
                                                        "credit"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    "credit"
                                                        ? "Pemasukan"
                                                        : "Pengeluaran"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Wallet */}
                                    <div className="flex items-start">
                                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Dompet
                                            </h3>
                                            <div className="mt-1 flex items-center">
                                                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                    <span className="font-medium text-blue-700 text-xs">
                                                        {(
                                                            transaction
                                                                .userWallet
                                                                ?.wallet
                                                                ?.name || ""
                                                        )
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-900">
                                                    {
                                                        transaction.userWallet
                                                            ?.wallet?.name
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="flex items-start">
                                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Deskripsi
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {transaction.description || (
                                                    <span className="text-gray-400 italic">
                                                        Tidak ada deskripsi
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-4">
                                    {/* Amount */}
                                    <div className="flex items-start">
                                        <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Nominal
                                            </h3>
                                            <p
                                                className={`mt-1 text-sm font-medium ${
                                                    transaction.type ===
                                                    "credit"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    transaction.amount
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User (if admin) */}
                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Pemilik
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {transaction.userWallet?.user
                                                    ?.name || "Tidak diketahui"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created at */}
                                    <div className="flex items-start">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="ml-4">
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Dibuat pada
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {formatDate(
                                                    transaction.created_at || ""
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Updated at */}
                                    {transaction.updated_at !==
                                        transaction.created_at && (
                                        <div className="flex items-start">
                                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div className="ml-4">
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Terakhir diperbarui
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {formatDate(
                                                        transaction.updated_at ||
                                                            ""
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TransactionShow;
