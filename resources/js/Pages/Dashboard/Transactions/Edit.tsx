import { useState, useEffect, useMemo } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, UserWallet, Transaction } from "@/types";
import {
    ArrowLeftCircle,
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    Check,
    AlertCircle,
    X,
    Info,
    RefreshCw,
    FileEdit,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Label } from "@/Components/ui/label";

interface EditTransactionPageProps extends PageProps {
    transaction: Transaction;
    userWallets: UserWallet[];
}

const TransactionEdit = () => {
    const { transaction, userWallets, flash, errors } =
        usePage<EditTransactionPageProps>().props;

    const { data, setData, put, processing, recentlySuccessful, reset } =
        useForm({
            user_wallet_id: transaction.user_wallet_id.toString(),
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description || "",
            date: transaction.date.split(" ")[0],
        });

    const [formattedAmount, setFormattedAmount] = useState(
        formatCurrency(transaction.amount)
    );
    const [showSuccess, setShowSuccess] = useState(false);
    const [originalWalletId] = useState(transaction.user_wallet_id.toString());

    useEffect(() => {
        if (data.amount) {
            setFormattedAmount(formatCurrency(data.amount));
        }
    }, []);

    // Handle flash messages
    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setData("amount", rawValue || "0");
        setFormattedAmount(
            rawValue
                ? new Intl.NumberFormat("id-ID").format(Number(rawValue))
                : ""
        );
    };

    const selectedWallet = useMemo(() => {
        return userWallets.find(
            (wallet) => wallet.id.toString() === data.user_wallet_id
        );
    }, [userWallets, data.user_wallet_id]);

    const hasSignificantChange =
        transaction.type !== data.type ||
        transaction.amount !== data.amount ||
        transaction.user_wallet_id.toString() !== data.user_wallet_id;

    const isOverdraft = useMemo(() => {
        if (!selectedWallet || data.type !== "debit") return false;
        if (data.user_wallet_id === originalWalletId) {
            const originalAmount = parseFloat(transaction.amount);
            const newAmount = parseFloat(data.amount);
            if (transaction.type === "debit") {
                if (newAmount > originalAmount) {
                    return (
                        newAmount - originalAmount >
                        parseFloat(selectedWallet.balance)
                    );
                }
                return false;
            } else if (data.type === "debit" && transaction.type === "credit") {
                return (
                    newAmount + originalAmount >
                    parseFloat(selectedWallet.balance)
                );
            }
        } else if (data.type === "debit") {
            return parseFloat(data.amount) > parseFloat(selectedWallet.balance);
        }

        return false;
    }, [data.type, data.amount, selectedWallet, originalWalletId, transaction]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route("transactions.update", transaction.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout title="Edit Transaksi">
            <Head title={`Edit Transaksi #${transaction.id}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={route("transactions.index")}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftCircle className="w-4 h-4 mr-1" />
                            Kembali ke Detail Transaksi
                        </Link>

                        <Link
                            href={route("transactions.index")}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            Daftar Transaksi
                        </Link>
                    </div>

                    {/* Success message */}
                    {showSuccess && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Check className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">
                                        Transaksi berhasil diperbarui!
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowSuccess(false)
                                            }
                                            className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">
                                                Dismiss
                                            </span>
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main form card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <FileEdit className="mr-2 h-5 w-5 text-blue-500" />
                                    Edit Transaksi #{transaction.id}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Perbarui informasi transaksi di bawah ini.
                                </p>
                            </div>
                            <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded flex items-center">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Dibuat:{" "}
                                {new Date(
                                    transaction.created_at || ""
                                ).toLocaleDateString("id-ID")}
                            </div>
                        </div>

                        {/* Transaction form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {hasSignificantChange && (
                                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                                    <span>
                                        Perubahan pada nominal, tipe, atau
                                        dompet akan menghitung ulang dan
                                        menyesuaikan saldo dompet terkait.
                                    </span>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Transaksi
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                                            data.type === "credit"
                                                ? "border-green-500 bg-green-50 ring-2 ring-green-500"
                                                : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            setData("type", "credit")
                                        }
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                Pemasukan
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Terima uang
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                                            data.type === "debit"
                                                ? "border-red-500 bg-red-50 ring-2 ring-red-500"
                                                : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setData("type", "debit")}
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                                                <ArrowUpRight className="w-5 h-5 text-red-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                Pengeluaran
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Belanja / Bayar
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.type}
                                    </p>
                                )}

                                {transaction.type !== data.type && (
                                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                                        Mengubah jenis transaksi akan
                                        mempengaruhi saldo dompet.
                                    </div>
                                )}
                            </div>

                            {/* Wallet Selection */}
                            <div>
                                <Label htmlFor="user_wallet_id">Dompet</Label>
                                <div className="relative mt-1">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <select
                                        id="user_wallet_id"
                                        value={data.user_wallet_id}
                                        onChange={(e) =>
                                            setData(
                                                "user_wallet_id",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 block w-full rounded-md shadow-sm text-sm ${
                                            errors.user_wallet_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="" disabled>
                                            Pilih dompet
                                        </option>
                                        {userWallets.map((userWallet) => (
                                            <option
                                                key={userWallet.id}
                                                value={userWallet.id}
                                            >
                                                {userWallet.wallet?.name} -
                                                (Saldo:{" "}
                                                {formatCurrency(
                                                    userWallet.balance
                                                )}
                                                )
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.user_wallet_id && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.user_wallet_id}
                                    </p>
                                )}
                            </div>

                            {/* Transaction Amount */}
                            <div>
                                <Label
                                    htmlFor="amount"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nominal
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                                        <span className="text-gray-500">
                                            Rp
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        id="amount"
                                        value={formattedAmount}
                                        onChange={handleAmountChange}
                                        className={`pl-16 block w-full rounded-md shadow-sm text-sm ${
                                            errors.amount
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.amount}
                                    </p>
                                )}
                                {isOverdraft && (
                                    <p className="mt-1 text-sm text-amber-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        Jumlah melebihi saldo yang tersedia di
                                        dompet ini.
                                    </p>
                                )}

                                {transaction.amount !== data.amount && (
                                    <div className="mt-2 text-xs flex items-center text-blue-600">
                                        <Info className="w-3.5 h-3.5 mr-1" />
                                        Nominal asli:{" "}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                )}
                            </div>

                            {/* Transaction Date */}
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Tanggal
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={data.date}
                                        onChange={(e) =>
                                            setData("date", e.target.value)
                                        }
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        } // Prevent future dates
                                        className={`pl-10 block w-full rounded-md ${
                                            errors.date
                                                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        } py-2 text-sm shadow-sm`}
                                    />
                                </div>
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Deskripsi{" "}
                                    <span className="text-gray-400 text-xs">
                                        (Opsional)
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="description"
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 block w-full rounded-md ${
                                            errors.description
                                                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        } py-2 text-sm shadow-sm`}
                                        placeholder="Contoh: Belanja bulanan, gaji, dll."
                                    />
                                </div>
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Transaction suggestions based on type */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi yang disarankan:
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.type === "credit" ? (
                                        // Credit suggestions
                                        <>
                                            {[
                                                "Gaji",
                                                "Bonus",
                                                "Penjualan",
                                                "Hadiah",
                                                "Transfer Masuk",
                                                "Pinjaman",
                                            ].map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                    onClick={() =>
                                                        setData(
                                                            "description",
                                                            suggestion
                                                        )
                                                    }
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </>
                                    ) : (
                                        // Debit suggestions
                                        <>
                                            {[
                                                "Belanja",
                                                "Makanan",
                                                "Transport",
                                                "Tagihan",
                                                "Hiburan",
                                                "Transfer Keluar",
                                            ].map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                    onClick={() =>
                                                        setData(
                                                            "description",
                                                            suggestion
                                                        )
                                                    }
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Warning for edits that affect balances */}
                            {(transaction.type !== data.type ||
                                transaction.amount !== data.amount ||
                                transaction.user_wallet_id.toString() !==
                                    data.user_wallet_id) && (
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-amber-700">
                                                Perubahan pada transaksi ini
                                                akan mempengaruhi saldo dompet
                                                Anda. Pastikan Anda yakin
                                                sebelum menyimpan perubahan.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="pt-4 flex justify-between">
                                <Link
                                    href={route(
                                        "transactions.show",
                                        transaction.id
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Batalkan
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing || isOverdraft}
                                    className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                    ${
                                        data.type === "credit"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-red-600 hover:bg-red-700"
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    ${
                                        data.type === "credit"
                                            ? "focus:ring-green-500"
                                            : "focus:ring-red-500"
                                    }
                                    ${
                                        processing || isOverdraft
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
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
                                        <>Perbarui Transaksi</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TransactionEdit;
