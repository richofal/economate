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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateWalletModal } from "./Partials/CreateWalletModal";
import { EditWalletModal } from "./Partials/EditWalletModal";
import { DeleteWalletModal } from "./Partials/DeleteWalletModal";

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

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";

        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            No
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => toggleSort("name")}
                                        >
                                            <div className="flex items-center">
                                                <span>Nama Dompet</span>
                                                <span className="ml-1">
                                                    {sortBy === "name" ? (
                                                        sortDirection ===
                                                        "asc" ? (
                                                            <ArrowUp className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowDown className="h-4 w-4" />
                                                        )
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    )}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Deskripsi
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() =>
                                                toggleSort("created_at")
                                            }
                                        >
                                            <div className="flex items-center">
                                                <span>Tanggal Dibuat</span>
                                                <span className="ml-1">
                                                    {sortBy === "created_at" ? (
                                                        sortDirection ===
                                                        "asc" ? (
                                                            <ArrowUp className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowDown className="h-4 w-4" />
                                                        )
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    )}
                                                </span>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <AnimatePresence initial={false}>
                                        {filteredAndSortedWallets.map(
                                            (wallet, index) => (
                                                <motion.tr
                                                    key={wallet.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-gray-50"
                                                    }
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
                                                                    Tidak ada
                                                                    deskripsi
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                            {formatDate(
                                                                wallet.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
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
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Empty state */}
                        {filteredAndSortedWallets.length === 0 && (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Info className="h-6 w-6" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    {searchTerm
                                        ? "Tidak ada dompet yang sesuai dengan pencarian"
                                        : "Belum ada dompet"}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm
                                        ? "Coba ubah kata kunci pencarian Anda"
                                        : "Mulai dengan menambahkan dompet baru ke sistem"}
                                </p>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() => openModal("create")}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Dompet
                                    </button>
                                </div>
                            </div>
                        )}
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
