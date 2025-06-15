import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, SplitBill } from "@/types";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    ArrowUpDown,
    Filter,
    CalendarDays,
    ReceiptText,
    DollarSign,
    UserPlus,
    ArrowUp,
    ArrowDown,
    XCircle,
    Calendar,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreateSplitBillModal } from "./Partials/CreateSplitBillModal";
import { DeleteSplitBillModal } from "./Partials/DeleteSplitBillModal";
import { Button } from "@/Components/ui/button";
import EmptyState from "@/Components/EmptyState";

interface SplitBillIndexPageProps extends PageProps {
    splitBills: SplitBill[];
    isAdmin: boolean;
}

const SplitBillIndex: React.FC = () => {
    const { splitBills, isAdmin } = usePage<SplitBillIndexPageProps>().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof SplitBill | "user_name";
        direction: "asc" | "desc";
    }>({ key: "created_at", direction: "desc" });

    const [modalState, setModalState] = useState<{
        mode: "create" | "delete" | "none";
        bill: SplitBill | null;
    }>({
        mode: "none",
        bill: null,
    });

    // Handle sorting
    const requestSort = (key: typeof sortConfig.key) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort split bills
    const filteredAndSortedBills = useMemo(() => {
        let filtered = [...splitBills];
        if (searchTerm) {
            const lowercaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((bill) => {
                const userMatch = bill.user?.name
                    ?.toLowerCase()
                    .includes(lowercaseSearch);
                const titleMatch = bill.title
                    .toLowerCase()
                    .includes(lowercaseSearch);
                const amountMatch = bill.total_amount
                    .toString()
                    .includes(lowercaseSearch);

                return userMatch || titleMatch || amountMatch;
            });
        }
        return filtered.sort((a, b) => {
            if (sortConfig.key === "user_name") {
                const aValue = a.user?.name || "";
                const bValue = b.user?.name || "";
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            if (sortConfig.key === "created_at") {
                const aDate = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                const bDate = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                return sortConfig.direction === "asc"
                    ? aDate - bDate
                    : bDate - aDate;
            }

            // For sorting by amount
            if (sortConfig.key === "total_amount") {
                return sortConfig.direction === "asc"
                    ? parseFloat(a.total_amount) - parseFloat(b.total_amount)
                    : parseFloat(b.total_amount) - parseFloat(a.total_amount);
            }

            // Default string comparison
            const aValue = String(a[sortConfig.key as keyof SplitBill] || "");
            const bValue = String(b[sortConfig.key as keyof SplitBill] || "");

            return sortConfig.direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
    }, [splitBills, searchTerm, sortConfig]);

    const openModal = (
        mode: "create" | "delete",
        bill: SplitBill | null = null
    ) => {
        setModalState({ mode, bill });
    };

    const closeModal = () => {
        setModalState({ mode: "none", bill: null });
    };

    // Render sort indicator
    const renderSortIcon = (key: typeof sortConfig.key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
        }

        return sortConfig.direction === "asc" ? (
            <ArrowUp className="h-4 w-4 ml-1 text-blue-600" />
        ) : (
            <ArrowDown className="h-4 w-4 ml-1 text-blue-600" />
        );
    };

    // Calculate totals
    const totalSplitBills = splitBills.length;
    const totalAmount = splitBills.reduce(
        (sum, bill) => sum + parseFloat(bill.total_amount),
        0
    );
    const averageParticipants = splitBills.length
        ? splitBills.reduce(
              (sum, bill) => sum + (bill.participants?.length || 0),
              0
          ) / splitBills.length
        : 0;

    return (
        <AuthenticatedLayout title="Split Bills">
            <Head title="Split Bills" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Split Bills
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {isAdmin
                                    ? "Manage all split bills in the system"
                                    : "Manage your split bills and expenses with friends"}
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <Button
                                onClick={() => openModal("create")}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Split Bill
                            </Button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Total Split Bills */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <ReceiptText className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Split Bills
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {totalSplitBills}
                                </p>
                            </div>
                        </div>

                        {/* Total Amount */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Total Amount
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>
                        </div>

                        {/* Average Participants */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Avg Participants
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {averageParticipants.toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search split bills..."
                                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Filter className="h-4 w-4 mr-1" />
                                    Filter
                                </button>

                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSortConfig({
                                            key: "created_at",
                                            direction: "desc",
                                        });
                                    }}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Split Bills Table */}
                    <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                        <div className="overflow-x-auto">
                            {filteredAndSortedBills.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {isAdmin && (
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        requestSort("user_name")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Creator
                                                        {renderSortIcon(
                                                            "user_name"
                                                        )}
                                                    </div>
                                                </th>
                                            )}
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    requestSort("title")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Title
                                                    {renderSortIcon("title")}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    requestSort("total_amount")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Total Amount
                                                    {renderSortIcon(
                                                        "total_amount"
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    requestSort("created_at")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Date
                                                    {renderSortIcon(
                                                        "created_at"
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {filteredAndSortedBills.map(
                                                (bill, index) => (
                                                    <motion.tr
                                                        key={bill.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{
                                                            duration: 0.2,
                                                            delay: index * 0.05,
                                                        }}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        {isAdmin && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                <div className="flex items-center">
                                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium uppercase">
                                                                        {bill.user?.name?.charAt(
                                                                            0
                                                                        ) ||
                                                                            "?"}
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <p className="font-medium">
                                                                            {
                                                                                bill
                                                                                    .user
                                                                                    ?.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-gray-500 text-xs">
                                                                            {
                                                                                bill
                                                                                    .user
                                                                                    ?.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}

                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Link
                                                                href={route(
                                                                    "splitBills.show",
                                                                    bill.id
                                                                )}
                                                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                                            >
                                                                {bill.title}
                                                            </Link>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    bill.total_amount
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CalendarDays className="h-4 w-4 text-gray-400 mr-1.5" />
                                                                <span className="text-sm text-gray-900">
                                                                    {formatDate(
                                                                        bill.created_at ||
                                                                            ""
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link
                                                                    href={route(
                                                                        "splitBills.show",
                                                                        bill.id
                                                                    )}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="View"
                                                                >
                                                                    <Eye className="h-5 w-5" />
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "splitBills.edit",
                                                                        bill.id
                                                                    )}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="h-5 w-5" />
                                                                </Link>
                                                                <button
                                                                    onClick={() =>
                                                                        openModal(
                                                                            "delete",
                                                                            bill
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            ) : (
                                <EmptyState
                                    title="No split bills found"
                                    description={
                                        searchTerm
                                            ? "No results match your search criteria"
                                            : "You haven't created any split bills yet"
                                    }
                                    icon={
                                        <Calendar className="h-12 w-12 text-gray-400" />
                                    }
                                    action={
                                        !searchTerm ? (
                                            <Button
                                                onClick={() =>
                                                    openModal("create")
                                                }
                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Split Bill
                                            </Button>
                                        ) : null
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CreateSplitBillModal
                isOpen={modalState.mode === "create"}
                onClose={closeModal}
            />
            <DeleteSplitBillModal
                isOpen={modalState.mode === "delete"}
                onClose={closeModal}
                bill={modalState.bill}
            />
        </AuthenticatedLayout>
    );
};

export default SplitBillIndex;
