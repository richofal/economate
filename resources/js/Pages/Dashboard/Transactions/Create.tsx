import { useState, useEffect, useMemo } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, UserWallet } from "@/types";
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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Label } from "@/Components/ui/label";

interface CreateTransactionProps extends PageProps {
    userWallets: UserWallet[];
}

const TransactionCreate = () => {
    const { userWallets, flash } = usePage<CreateTransactionProps>().props;
    const { data, setData, post, errors, processing, reset } = useForm({
        user_wallet_id: "",
        type: "debit",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [formattedAmount, setFormattedAmount] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const parseFormattedCurrency = (formattedValue: string) => {
        return formattedValue.replace(/[^0-9]/g, "");
    };
    useEffect(() => {
        if (data.amount) {
            setFormattedAmount(formatCurrency(data.amount));
        }
    }, [data.amount]);

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setData("amount", rawValue);
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

    const isOverdraft = useMemo(() => {
        if (data.type === "debit" && selectedWallet && data.amount) {
            return parseFloat(data.amount) > parseFloat(selectedWallet.balance);
        }
        return false;
    }, [data.type, data.amount, selectedWallet]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("transactions.store"), {
            onSuccess: () => {
                reset();
                setFormattedAmount("");
            },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout title="Tambah Transaksi">
            <Head title="Tambah Transaksi" />

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

                    {/* Success message */}
                    {showSuccess && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Check className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">
                                        Transaksi berhasil ditambahkan!
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
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                Tambah Transaksi Baru
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Lengkapi informasi di bawah ini untuk
                                menambahkan transaksi baru.
                            </p>
                        </div>

                        {/* Transaction form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Transaction Type Selection */}
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
                            </div>

                            {/* Wallet Selection */}
                            <div>
                                <Label
                                    htmlFor="wallet_id"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Dompet
                                </Label>
                                <div className="relative">
                                    {/* ... (JSX untuk ikon CreditCard) ... */}
                                    <select
                                        id="wallet_id"
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
                                        required
                                    >
                                        <option value="" disabled>
                                            Pilih dompet
                                        </option>
                                        {/* PERBAIKAN: Map dari userWallets */}
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
                                {selectedWallet && (
                                    <div className="mt-2 text-xs flex items-center text-gray-600">
                                        <Info className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                        Saldo tersedia:{" "}
                                        <span className="font-medium ml-1">
                                            {formatCurrency(
                                                selectedWallet.balance
                                            )}
                                        </span>
                                    </div>
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
                                    {/* ... (JSX untuk ikon DollarSign) ... */}
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

                            {/* Submit button */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        (selectedWallet &&
                                            data.type === "debit" &&
                                            parseFloat(data.amount) >
                                                parseFloat(
                                                    selectedWallet.balance
                                                ))
                                    }
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
                                        processing ||
                                        (selectedWallet &&
                                            data.type === "debit" &&
                                            parseFloat(data.amount) >
                                                parseFloat(
                                                    selectedWallet.balance
                                                ))
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
                                        <>
                                            {data.type === "credit" ? (
                                                <>
                                                    <ArrowDownLeft className="w-4 h-4 mr-1.5" />
                                                    Simpan Pemasukan
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowUpRight className="w-4 h-4 mr-1.5" />
                                                    Simpan Pengeluaran
                                                </>
                                            )}
                                        </>
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

export default TransactionCreate;
