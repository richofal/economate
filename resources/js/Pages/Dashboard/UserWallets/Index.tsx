import { useState, Fragment, useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { PageProps, User, Wallet, UserWallet } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Wallet as WalletIcon,
    Plus,
    Edit,
    Trash2,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Calendar,
    Info,
    X,
} from "lucide-react";
import { CreateUserWalletModal } from "./Partials/CreateUserWalletModal";
import { EditUserWalletModal } from "./Partials/EditUserWalletModal";
import { DeleteUserWalletModal } from "./Partials/DeleteUserWalletModal";
import { Transition } from "@headlessui/react";

interface UserWalletsPageProps extends PageProps {
    userWallets: UserWallet[];
    wallets: Wallet[];
}

const UserWalletsIndex = () => {
    const { userWallets, wallets, flash, auth } =
        usePage<UserWalletsPageProps>().props;

    const [modalState, setModalState] = useState<{
        create: boolean;
        edit: UserWallet | null;
        delete: UserWallet | null;
    }>({
        create: false,
        edit: null,
        delete: null,
    });

    // State for alert messages
    const [alertMessage, setAlertMessage] = useState<{
        type: "success" | "error" | null;
        text: string | null;
    }>({ type: null, text: null });

    // State for search and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: "balance" | "created_at" | "wallet_name";
        direction: "asc" | "desc";
    }>({ key: "wallet_name", direction: "asc" });

    useEffect(() => {
        const key = flash.success ? "success" : flash.error ? "error" : null;
        if (key) {
            setAlertMessage({
                type: key as "success" | "error",
                text: flash[key],
            });
            const timer = setTimeout(
                () => setAlertMessage({ type: null, text: null }),
                3000
            );
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Format utilities
    const formatCurrency = (amount: string | number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(amount));

    const formatDate = (dateString?: string) =>
        dateString
            ? new Date(dateString).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              })
            : "-";

    // Filter master wallets that user doesn't have yet
    const availableWallets = useMemo(() => {
        const userWalletIds = new Set(userWallets.map((uw) => uw.wallet_id));
        return wallets.filter((w) => !userWalletIds.has(w.id));
    }, [wallets, userWallets]);

    // Handle sorting
    const requestSort = (key: "balance" | "created_at" | "wallet_name") => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort wallets
    const filteredAndSortedWallets = useMemo(() => {
        // Filter by search term
        const filtered = userWallets.filter((wallet) => {
            const walletName = wallet.wallet?.name?.toLowerCase() || "";
            const balanceStr = wallet.balance.toString();

            return (
                walletName.includes(searchTerm.toLowerCase()) ||
                balanceStr.includes(searchTerm.toLowerCase())
            );
        });

        // Sort based on current config
        return [...filtered].sort((a, b) => {
            if (sortConfig.key === "wallet_name") {
                const nameA = a.wallet?.name?.toLowerCase() || "";
                const nameB = b.wallet?.name?.toLowerCase() || "";
                return sortConfig.direction === "asc"
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            } else if (sortConfig.key === "balance") {
                const balanceA = Number(a.balance);
                const balanceB = Number(b.balance);
                return sortConfig.direction === "asc"
                    ? balanceA - balanceB
                    : balanceB - balanceA;
            } else {
                // Sort by date
                const dateA = new Date(a.created_at || "").getTime();
                const dateB = new Date(b.created_at || "").getTime();
                return sortConfig.direction === "asc"
                    ? dateA - dateB
                    : dateB - dateA;
            }
        });
    }, [userWallets, searchTerm, sortConfig]);

    // Render sort indicator
    const renderSortIcon = (key: "balance" | "created_at" | "wallet_name") => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
        }

        return sortConfig.direction === "asc" ? (
            <ArrowUp className="ml-1 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-1 h-4 w-4" />
        );
    };

    return (
        <AuthenticatedLayout title="Manajemen Dompet">
            <Head title="Dompet Saya" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header dan Tombol Tambah */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Dompet Saya
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Kelola dan pantau dompet pribadi Anda
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                setModalState({ ...modalState, create: true })
                            }
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Tambah Dompet
                        </button>
                    </div>

                    {/* Alert Message */}
                    <Transition
                        show={!!alertMessage.text}
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 transform -translate-y-2"
                        enterTo="opacity-100 transform translate-y-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 transform translate-y-0"
                        leaveTo="opacity-0 transform -translate-y-2"
                    >
                        <div
                            className={`mb-4 rounded-md p-4 ${
                                alertMessage.type === "success"
                                    ? "bg-green-50 border-l-4 border-green-500"
                                    : "bg-red-50 border-l-4 border-red-500"
                            }`}
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {alertMessage.type === "success" ? (
                                        <svg
                                            className="h-5 w-5 text-green-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="h-5 w-5 text-red-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p
                                        className={`text-sm ${
                                            alertMessage.type === "success"
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        {alertMessage.text}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setAlertMessage({
                                                    type: null,
                                                    text: null,
                                                })
                                            }
                                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                alertMessage.type === "success"
                                                    ? "text-green-500 hover:bg-green-100 focus:ring-green-500"
                                                    : "text-red-500 hover:bg-red-100 focus:ring-red-500"
                                            }`}
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
                    </Transition>

                    {/* Search Box */}
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Cari dompet..."
                        />
                    </div>

                    {/* Wallet Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            {userWallets.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    requestSort("wallet_name")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <span>Nama Dompet</span>
                                                    {renderSortIcon(
                                                        "wallet_name"
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    requestSort("balance")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <span>Saldo</span>
                                                    {renderSortIcon("balance")}
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
                                                    <span>Tanggal Dibuat</span>
                                                    {renderSortIcon(
                                                        "created_at"
                                                    )}
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
                                        {filteredAndSortedWallets.map(
                                            (userWallet, index) => (
                                                <tr
                                                    key={userWallet.id}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-gray-50"
                                                    }
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <WalletIcon className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {userWallet
                                                                        .wallet
                                                                        ?.name ||
                                                                        "Unnamed Wallet"}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    ID:{" "}
                                                                    {
                                                                        userWallet.id
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {formatCurrency(
                                                                userWallet.balance
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                                                            {formatDate(
                                                                userWallet.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    setModalState(
                                                                        {
                                                                            ...modalState,
                                                                            edit: userWallet,
                                                                        }
                                                                    )
                                                                }
                                                                className="p-1.5 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                                title="Edit Dompet"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setModalState(
                                                                        {
                                                                            ...modalState,
                                                                            delete: userWallet,
                                                                        }
                                                                    )
                                                                }
                                                                className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Hapus Dompet"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center">
                                    <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                                        Belum ada dompet
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Anda belum memiliki dompet. Buat dompet
                                        baru untuk mulai mengelola keuangan
                                        Anda.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() =>
                                                setModalState({
                                                    ...modalState,
                                                    create: true,
                                                })
                                            }
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Buat Dompet Baru
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Empty search state */}
                        {userWallets.length > 0 &&
                            filteredAndSortedWallets.length === 0 && (
                                <div className="p-8 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Info className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Tidak ada dompet yang sesuai dengan
                                        pencarian
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Coba ubah kata kunci pencarian Anda
                                    </p>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            <CreateUserWalletModal
                isOpen={modalState.create}
                onClose={() => setModalState({ ...modalState, create: false })}
                availableWallets={availableWallets}
            />

            <EditUserWalletModal
                isOpen={!!modalState.edit}
                onClose={() => setModalState({ ...modalState, edit: null })}
                userWallet={modalState.edit}
            />

            <DeleteUserWalletModal
                isOpen={!!modalState.delete}
                onClose={() => setModalState({ ...modalState, delete: null })}
                walletId={modalState.delete?.id || null}
                walletName={modalState.delete?.wallet?.name || ""}
            />
        </AuthenticatedLayout>
    );
};

export default UserWalletsIndex;
