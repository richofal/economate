// resources/js/Pages/Wallets/Index.tsx

import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, Wallet } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowUp,
    ArrowDown,
    ChevronDown,
    Calendar,
    Info,
    ChevronUp,
    ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateWalletModal } from "./Partials/CreateWalletModal";
import { EditWalletModal } from "./Partials/EditWalletModal";
import { DeleteWalletModal } from "./Partials/DeleteWalletModal";
import EmptyState from "@/Components/EmptyState";
import { formatDate } from "@/lib/utils";

interface WalletsIndexPageProps extends PageProps {
    wallets: Wallet[];
}

const WalletsIndex = () => {
    const { wallets } = usePage<WalletsIndexPageProps>().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "created_at">("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [modalState, setModalState] = useState<{
        mode: "create" | "edit" | "delete" | "none";
        wallet: Wallet | null;
    }>({
        mode: "none",
        wallet: null,
    });
    const [showFilters, setShowFilters] = useState(false);

    const filteredAndSortedWallets = [...wallets]
        .filter(
            (wallet) =>
                wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                wallet.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "name") {
                return sortDirection === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                const dateA = new Date(a.created_at || "").getTime();
                const dateB = new Date(b.created_at || "").getTime();
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }
        });

    const toggleSort = (column: "name" | "created_at") => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    const resetFilters = () => {
        setShowFilters(false);
        setSearchTerm("");
    };

    // Handler untuk membuka modal
    const openModal = (
        mode: "create" | "edit" | "delete",
        wallet: Wallet | null = null
    ) => {
        setModalState({ mode, wallet });
    };

    // Handler untuk menutup semua modal
    const closeModal = () => {
        setModalState({ mode: "none", wallet: null });
    };

    return (
        <AuthenticatedLayout title="Daftar Dompet">
            <Head title="Daftar Dompet" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header and action buttons */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Daftar Dompet
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Kelola semua jenis dompet dalam sistem.
                            </p>
                        </div>
                        <button
                            onClick={() => openModal("create")}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Dompet Baru
                        </button>
                    </div>

                    {/* Search box */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Cari dompet berdasarkan nama atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Wallets table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <AnimatePresence>
                            {filteredAndSortedWallets.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <EmptyState
                                        title="Tidak ada dompet ditemukan"
                                        description={
                                            searchTerm
                                                ? "Coba ubah filter pencarian Anda"
                                                : "Mulai dengan menambahkan dompet baru ke sistem"
                                        }
                                        icon={
                                            <Search className="h-6 w-6 text-gray-400" />
                                        }
                                        action={
                                            <button
                                                onClick={() => {
                                                    if (searchTerm) {
                                                        resetFilters();
                                                    } else {
                                                        openModal("create");
                                                    }
                                                }}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                            >
                                                {searchTerm ? (
                                                    "Reset Semua Filter"
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Tambah Dompet
                                                    </>
                                                )}
                                            </button>
                                        }
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    No
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        toggleSort("name")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <span>Nama Dompet</span>
                                                        <span className="ml-1">
                                                            {sortBy ===
                                                            "name" ? (
                                                                sortDirection ===
                                                                "asc" ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )
                                                            ) : (
                                                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                            )}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deskripsi
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() =>
                                                        toggleSort("created_at")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <span>
                                                            Tanggal Dibuat
                                                        </span>
                                                        <span className="ml-1">
                                                            {sortBy ===
                                                            "created_at" ? (
                                                                sortDirection ===
                                                                "asc" ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )
                                                            ) : (
                                                                <ArrowUpDown className="h-4 w-4 opacity-50" />
                                                            )}
                                                        </span>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAndSortedWallets.map(
                                                (wallet, index) => (
                                                    <motion.tr
                                                        key={wallet.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            delay: index * 0.03,
                                                        }}
                                                        className={`border-b border-gray-100 ${
                                                            index % 2 === 1
                                                                ? "bg-gray-50/50"
                                                                : ""
                                                        } hover:bg-blue-50/30`}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-blue-800 font-medium text-sm">
                                                                        {wallet.name
                                                                            .substring(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            wallet.name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-600 max-w-xs truncate">
                                                                {wallet.description || (
                                                                    <span className="text-gray-400 italic">
                                                                        Tidak
                                                                        ada
                                                                        deskripsi
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                                {formatDate(
                                                                    wallet.created_at ||
                                                                        ""
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        openModal(
                                                                            "edit",
                                                                            wallet
                                                                        )
                                                                    }
                                                                    className="p-1.5 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                                    title="Edit Dompet"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        openModal(
                                                                            "delete",
                                                                            wallet
                                                                        )
                                                                    }
                                                                    className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                    title="Hapus Dompet"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            <CreateWalletModal
                isOpen={modalState.mode === "create"}
                onClose={closeModal}
            />
            <EditWalletModal
                isOpen={modalState.mode === "edit"}
                onClose={closeModal}
                wallet={modalState.wallet}
            />
            <DeleteWalletModal
                isOpen={modalState.mode === "delete"}
                onClose={closeModal}
                wallet={modalState.wallet}
            />
        </AuthenticatedLayout>
    );
};

export default WalletsIndex;
