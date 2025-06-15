import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Transaction } from "@/types";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Search,
    Plus,
    FileText,
    ArrowRightLeft,
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";
import { SummaryCard } from "@/Components/transactions/SummaryCard";
import { TransactionTable } from "@/Components/transactions/TransactionTable";

interface TransactionIndexPageProps extends PageProps {
    transactions: Transaction[];
    isAdmin: boolean;
}

const TransactionIndex: React.FC = () => {
    const { transactions, isAdmin } =
        usePage<TransactionIndexPageProps>().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "debit" | "credit">(
        "all"
    );
    const [dateFilter, setDateFilter] = useState<{
        startDate: string | null;
        endDate: string | null;
    }>({
        startDate: null,
        endDate: null,
    });

    // State for sorting
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Transaction | "walletName" | "userName";
        direction: "asc" | "desc";
    }>({
        key: "date",
        direction: "desc",
    });

    // Handle sorting
    const requestSort = (key: typeof sortConfig.key) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm("");
        setTypeFilter("all");
        setDateFilter({
            startDate: null,
            endDate: null,
        });
    };

    const processedTransactions = useMemo(() => {
        const lowercaseSearch = searchTerm.toLowerCase();

        let filtered = transactions.filter((transaction) => {
            // Filter Tipe
            if (typeFilter !== "all" && transaction.type !== typeFilter)
                return false;

            // Filter Tanggal
            if (dateFilter.startDate && transaction.date < dateFilter.startDate)
                return false;
            if (dateFilter.endDate) {
                // Tambah 1 hari ke end date agar inklusif
                const endDate = new Date(dateFilter.endDate);
                endDate.setDate(endDate.getDate() + 1);
                if (new Date(transaction.date) >= endDate) return false;
            }

            // Filter Pencarian
            if (!lowercaseSearch) return true;
            return (
                transaction.userWallet?.wallet?.name
                    ?.toLowerCase()
                    .includes(lowercaseSearch) ||
                (isAdmin &&
                    transaction.userWallet?.user?.name
                        ?.toLowerCase()
                        .includes(lowercaseSearch)) ||
                transaction.amount.toString().includes(lowercaseSearch) ||
                transaction.description?.toLowerCase().includes(lowercaseSearch)
            );
        });

        // Logika Sorting
        return filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortConfig.key) {
                case "walletName":
                    aValue = a.userWallet?.wallet?.name || "";
                    bValue = b.userWallet?.wallet?.name || "";
                    break;
                case "userName":
                    aValue = a.userWallet?.user?.name || "";
                    bValue = b.userWallet?.user?.name || "";
                    break;
                case "amount":
                    aValue = parseFloat(a.amount);
                    bValue = parseFloat(b.amount);
                    break;
                case "date":
                    aValue = new Date(a.date).getTime();
                    bValue = new Date(b.date).getTime();
                    break;
                default:
                    aValue = a[sortConfig.key as keyof Transaction] || "";
                    bValue = b[sortConfig.key as keyof Transaction] || "";
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return sortConfig.direction === "asc"
                ? aValue - bValue
                : bValue - aValue;
        });
    }, [transactions, searchTerm, typeFilter, dateFilter, sortConfig]);

    const summary = useMemo(() => {
        // Logika summary sama, tapi menggunakan processedTransactions
        const creditTotal = processedTransactions
            .filter((t) => t.type === "credit")
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const debitTotal = processedTransactions
            .filter((t) => t.type === "debit")
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return {
            total: processedTransactions.length,
            creditTotal,
            debitTotal,
            balance: creditTotal - debitTotal,
        };
    }, [processedTransactions]);

    return (
        <AuthenticatedLayout title="Transaksi">
            <Head title="Transaksi" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Daftar Transaksi
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {isAdmin
                                    ? "Melihat semua transaksi dalam sistem"
                                    : "Melihat riwayat transaksi Anda"}
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                            <Link
                                href={route("transactions.create")}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Transaksi Baru
                            </Link>
                        </div>
                    </div>

                    {/* Filters section */}
                    <div className="bg-white shadow rounded-lg p-4 mb-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Search */}
                            <div className="relative w-full md:w-1/3">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Cari transaksi..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Type filter */}
                                <div className="w-full sm:w-auto">
                                    <select
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        value={typeFilter}
                                        onChange={(e) =>
                                            setTypeFilter(e.target.value as any)
                                        }
                                    >
                                        <option value="all">Semua tipe</option>
                                        <option value="debit">
                                            Pengeluaran
                                        </option>
                                        <option value="credit">
                                            Pemasukan
                                        </option>
                                    </select>
                                </div>

                                {/* Date range */}
                                <div className="w-full sm:w-auto flex items-center gap-2">
                                    <input
                                        type="date"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        value={dateFilter.startDate || ""}
                                        onChange={(e) =>
                                            setDateFilter({
                                                ...dateFilter,
                                                startDate:
                                                    e.target.value || null,
                                            })
                                        }
                                    />
                                    <span className="text-gray-500">s/d</span>
                                    <input
                                        type="date"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        value={dateFilter.endDate || ""}
                                        onChange={(e) =>
                                            setDateFilter({
                                                ...dateFilter,
                                                endDate: e.target.value || null,
                                            })
                                        }
                                    />
                                </div>

                                {/* Reset filter */}
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Total Transaksi"
                            value={summary.total}
                            icon={
                                <FileText className="h-5 w-5 text-blue-600" />
                            }
                            colorClass="border-blue-500"
                        />
                        <SummaryCard
                            title="Total Pemasukan"
                            value={summary.creditTotal}
                            icon={
                                <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            }
                            colorClass="border-green-500"
                        />
                        <SummaryCard
                            title="Total Pengeluaran"
                            value={summary.debitTotal}
                            icon={
                                <ArrowUpRight className="h-5 w-5 text-red-600" />
                            }
                            colorClass="border-red-500"
                        />
                        <SummaryCard
                            title="Saldo Akhir"
                            value={summary.balance}
                            icon={
                                <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                            }
                            colorClass="border-indigo-500"
                        />
                    </div>

                    {/* Transactions table */}
                    <TransactionTable
                        transactions={processedTransactions}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default TransactionIndex;
