import { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps, User, UserWallet } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Trash2,
    UserCog,
    Users,
    Wallet,
    History,
    ExternalLink,
    UserCheck,
    UserX,
    ShieldAlert,
    Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultUserImage from "@/Components/DefaultUserImage";

interface UserShowPageProps extends PageProps {
    user: User & {
        userWallets?: UserWallet[];
    };
    roles: string[];
    wallets: UserWallet[];
}

type TabType = "overview" | "wallets" | "activity" | "permissions";

const UsersShow = () => {
    const { auth, user, roles, wallets } = usePage<UserShowPageProps>().props;
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    // Format date helper function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Format date with time helper function
    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format user status with appropriate styling
    const renderUserStatus = (status?: string) => {
        if (!status) return null;

        let bgColor = "bg-gray-100 text-gray-800";
        let icon = null;

        switch (status?.toLowerCase()) {
            case "active":
                bgColor = "bg-green-100 text-green-800";
                icon = <UserCheck className="w-3.5 h-3.5 mr-1" />;
                break;
            case "inactive":
                bgColor = "bg-yellow-100 text-yellow-800";
                icon = <UserX className="w-3.5 h-3.5 mr-1" />;
                break;
            case "banned":
                bgColor = "bg-red-100 text-red-800";
                icon = <ShieldAlert className="w-3.5 h-3.5 mr-1" />;
                break;
        }

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
            >
                {icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout title={`Detail Pengguna: ${user.name}`}>
            <Head title={`Detail Pengguna: ${user.name}`} />

            {/* Back button and page header */}
            <div className="mb-6">
                <Link
                    href={route("users.index")}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Pengguna
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            <DefaultUserImage
                                user={user}
                                className="w-full h-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <p className="text-gray-600">#{user.id}</p>
                                {renderUserStatus(user.status)}

                                {/* Display user roles as badges */}
                                {roles && roles.length > 0 && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <div className="flex flex-wrap gap-1">
                                            {roles.map((role, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav
                    className="-mb-px flex space-x-6 overflow-x-auto"
                    aria-label="Tabs"
                >
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`whitespace-nowrap py-3 border-b-2 font-medium text-sm ${
                            activeTab === "overview"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <UserIcon className="w-4 h-4 inline-block mr-2" />
                        Ringkasan
                    </button>

                    <button
                        onClick={() => setActiveTab("wallets")}
                        className={`whitespace-nowrap py-3 border-b-2 font-medium text-sm ${
                            activeTab === "wallets"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Wallet className="w-4 h-4 inline-block mr-2" />
                        Dompet
                        {wallets?.length > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                {wallets.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`whitespace-nowrap py-3 border-b-2 font-medium text-sm ${
                            activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <History className="w-4 h-4 inline-block mr-2" />
                        Aktivitas
                    </button>

                    <button
                        onClick={() => setActiveTab("permissions")}
                        className={`whitespace-nowrap py-3 border-b-2 font-medium text-sm ${
                            activeTab === "permissions"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Users className="w-4 h-4 inline-block mr-2" />
                        Peran & Izin
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-sm"
                    >
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Informasi Pengguna
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Nama Lengkap
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Email
                                    </p>
                                    <div className="mt-1 flex items-center">
                                        <Mail className="h-4 w-4 text-gray-400 mr-1.5" />
                                        <p className="text-sm text-gray-900">
                                            {user.email}
                                        </p>

                                        {user.email_verified_at && (
                                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-md">
                                                Terverifikasi
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Telepon
                                    </p>
                                    <div className="mt-1 flex items-center">
                                        {user.phone ? (
                                            <>
                                                <Phone className="h-4 w-4 text-gray-400 mr-1.5" />
                                                <p className="text-sm text-gray-900">
                                                    {user.phone}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                Tidak ada nomor telepon
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Alamat
                                    </p>
                                    <div className="mt-1 flex items-start">
                                        {user.address ? (
                                            <>
                                                <MapPin className="h-4 w-4 text-gray-400 mr-1.5 mt-0.5" />
                                                <p className="text-sm text-gray-900">
                                                    {user.address}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                Tidak ada alamat
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Tanggal Lahir
                                    </p>
                                    <div className="mt-1 flex items-center">
                                        {user.birth_date ? (
                                            <>
                                                <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                                                <p className="text-sm text-gray-900">
                                                    {formatDate(
                                                        user.birth_date
                                                    )}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                Tidak ada data
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Jenis Kelamin
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.gender
                                            ? user.gender === "male"
                                                ? "Laki-laki"
                                                : "Perempuan"
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <hr className="my-6" />

                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Informasi Akun
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        ID Pengguna
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.id}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Status
                                    </p>
                                    <p className="mt-1">
                                        {renderUserStatus(user.status)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Tanggal Bergabung
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {formatDateTime(user.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Terakhir Diperbarui
                                    </p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {formatDateTime(user.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Wallets Tab */}
                {activeTab === "wallets" && (
                    <motion.div
                        key="wallets"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-sm"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Dompet Pengguna
                                </h2>

                                {auth.user.permissions?.includes(
                                    "manage-wallets"
                                ) && (
                                    <Link
                                        href={route("user-wallets.create", {
                                            userId: user.id,
                                        })}
                                        className="mt-2 md:mt-0 inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                    >
                                        Tambah Dompet
                                    </Link>
                                )}
                            </div>

                            {wallets && wallets.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama Dompet
                                                </th>
                                                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Saldo
                                                </th>
                                                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Dibuat
                                                </th>
                                                <th className="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {wallets.map((wallet) => (
                                                <tr
                                                    key={wallet.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Wallet className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        wallet
                                                                            .wallet
                                                                            ?.name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            Rp{" "}
                                                            {parseFloat(
                                                                wallet.balance
                                                            ).toLocaleString(
                                                                "id-ID"
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                                                        {formatDate(
                                                            wallet.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-1">
                                                            <Link
                                                                href={route(
                                                                    "user-wallets.show",
                                                                    wallet.id
                                                                )}
                                                                className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                                title="Lihat Detail"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>

                                                            {auth.user.permissions?.includes(
                                                                "manage-wallets"
                                                            ) && (
                                                                <Link
                                                                    href={route(
                                                                        "user-wallets.edit",
                                                                        wallet.id
                                                                    )}
                                                                    className="p-1.5 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                                    title="Edit Dompet"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto h-12 w-12 text-gray-300">
                                        <Wallet className="h-12 w-12" />
                                    </div>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Tidak ada dompet
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pengguna ini belum memiliki dompet
                                        apapun.
                                    </p>

                                    {auth.user.permissions?.includes(
                                        "manage-wallets"
                                    ) && (
                                        <div className="mt-6">
                                            <Link
                                                href={route(
                                                    "user-wallets.create",
                                                    { userId: user.id }
                                                )}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Tambah Dompet Baru
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                    <motion.div
                        key="activity"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-sm"
                    >
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">
                                Aktivitas Pengguna
                            </h2>

                            <div className="text-center py-8">
                                <div className="mx-auto h-12 w-12 text-gray-300">
                                    <History className="h-12 w-12" />
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Tidak ada aktivitas
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Riwayat aktivitas pengguna ini akan
                                    ditampilkan di sini.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Permissions Tab */}
                {activeTab === "permissions" && (
                    <motion.div
                        key="permissions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-sm"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Peran & Izin
                                </h2>

                                {auth.user.permissions?.includes(
                                    "assign-roles"
                                ) && (
                                    <Link
                                        href={route("users.roles", user.id)}
                                        className="mt-2 md:mt-0 inline-flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                    >
                                        <UserCog className="w-4 h-4 mr-2" />
                                        Kelola Peran & Izin
                                    </Link>
                                )}
                            </div>

                            {/* Roles Section */}
                            <div className="mb-6">
                                <h3 className="text-base font-semibold text-gray-700 mb-3">
                                    Peran
                                </h3>

                                {roles && roles.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((role, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 rounded-md bg-blue-50 text-blue-700"
                                            >
                                                <span className="font-medium">
                                                    {role}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        Pengguna ini tidak memiliki peran yang
                                        ditetapkan.
                                    </p>
                                )}
                            </div>

                            {/* Permissions Section */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-700 mb-3">
                                    Izin
                                </h3>

                                {user.permissions &&
                                user.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map(
                                            (permission, index) => (
                                                <div
                                                    key={index}
                                                    className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm"
                                                >
                                                    {permission}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">
                                        Pengguna ini tidak memiliki izin
                                        langsung. Izin diberikan melalui peran.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
};

export default UsersShow;
