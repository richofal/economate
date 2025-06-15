import { Transaction } from "@/types";
import { Link } from "@inertiajs/react";
import {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Calendar,
    CreditCard,
    Eye,
    Tag,
    ArrowRightLeft,
    EditIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatCurrency } from "@/lib/utils";
import React from "react";

type SortKey = keyof Transaction | "walletName" | "userName";

interface TransactionTableProps {
    transactions: Transaction[];
    sortConfig: { key: SortKey; direction: "asc" | "desc" };
    requestSort: (key: SortKey) => void;
    isAdmin: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    sortConfig,
    requestSort,
    isAdmin,
}) => {
    const renderSortIcon = (key: SortKey) => {
        if (sortConfig.key !== key)
            return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
        return sortConfig.direction === "asc" ? (
            <ArrowUp className="h-4 w-4 ml-1 text-blue-600" />
        ) : (
            <ArrowDown className="h-4 w-4 ml-1 text-blue-600" />
        );
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                onClick={() => requestSort("date")}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />{" "}
                                    Tanggal {renderSortIcon("date")}
                                </div>
                            </th>
                            {isAdmin && (
                                <th
                                    onClick={() => requestSort("userName")}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        Pengguna {renderSortIcon("userName")}
                                    </div>
                                </th>
                            )}
                            <th
                                onClick={() => requestSort("walletName")}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />{" "}
                                    Dompet {renderSortIcon("walletName")}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort("type")}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <Tag className="h-4 w-4 mr-2 text-gray-400" />{" "}
                                    Tipe {renderSortIcon("type")}
                                </div>
                            </th>
                            <th
                                onClick={() => requestSort("amount")}
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                <div className="flex items-center justify-end">
                                    Nominal {renderSortIcon("amount")}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <motion.tr
                                        key={transaction.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                            {formatDate(transaction.date)}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {
                                                    transaction.userWallet?.user
                                                        ?.name
                                                }
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {
                                                transaction.userWallet?.wallet
                                                    ?.name
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    transaction.type ===
                                                    "credit"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {transaction.type === "credit"
                                                    ? "Pemasukan"
                                                    : "Pengeluaran"}
                                            </span>
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                                                transaction.type === "credit"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {transaction.type === "credit"
                                                ? "+"
                                                : "-"}{" "}
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route(
                                                        "transactions.edit",
                                                        transaction.id
                                                    )}
                                                    className="text-amber-600 hover:text-amber-900 mr-2"
                                                >
                                                    <EditIcon className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "transactions.show",
                                                        transaction.id
                                                    )}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={isAdmin ? 7 : 6}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <ArrowRightLeft className="h-12 w-12 text-gray-300 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Transaksi Tidak Ditemukan
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Coba ubah filter pencarian Anda.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
