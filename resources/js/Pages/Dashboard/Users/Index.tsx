import { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { PageProps, User } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    UserIcon,
    Plus,
    Search,
    Mail,
    Phone,
    Edit,
    Trash2,
    Eye,
    X,
    UserX,
    UserCheck,
    ShieldAlert,
    Filter,
    ChevronDown,
    ChevronUp,
    ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultUserImage from "@/Components/DefaultUserImage";

interface UsersIndexPageProps extends PageProps {
    users: User[];
}

const UsersIndex = () => {
    const { users, auth } = usePage<UsersIndexPageProps>().props;

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
    const [sortBy, setSortBy] = useState<"name" | "email" | "created_at">(
        "name"
    );
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Client-side filter states
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);

    // Get unique statuses and roles for filter dropdowns
    const availableStatuses = [
        ...new Set(users.map((u) => u.status).filter(Boolean)),
    ];

    const availableRoles = [
        ...new Set(
            users.flatMap((u) => {
                if (!u.roles) return [];
                return u.roles.map((role) =>
                    typeof role === "string"
                        ? role
                        : (role as { name: string }).name
                );
            })
        ),
    ];
    // Handle search and filtering
    useEffect(() => {
        let result = [...users];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (user) =>
                    user.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (user.phone &&
                        user.phone
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Apply status filter
        if (statusFilter) {
            result = result.filter((user) => user.status === statusFilter);
        }

        // Apply role filter
        if (roleFilter) {
            result = result.filter((user) => {
                if (!user.roles) return false;
                return user.roles.some((role) =>
                    typeof role === "string"
                        ? role === roleFilter
                        : (role as { name: string }).name === roleFilter
                );
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === "name") {
                return sortDirection === "asc"
                    ? (a.name || "").localeCompare(b.name || "")
                    : (b.name || "").localeCompare(a.name || "");
            } else if (sortBy === "email") {
                return sortDirection === "asc"
                    ? (a.email || "").localeCompare(b.email || "")
                    : (b.email || "").localeCompare(a.email || "");
            } else {
                const dateA = new Date(a.created_at || "").getTime();
                const dateB = new Date(b.created_at || "").getTime();
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            }
        });

        setFilteredUsers(result);
    }, [users, searchTerm, sortBy, sortDirection, statusFilter, roleFilter]);

    // Reset filters
    const resetFilters = () => {
        setStatusFilter(null);
        setRoleFilter(null);
        setShowFilters(false);
    };

    // Toggle sort direction
    const toggleSort = (column: "name" | "email" | "created_at") => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Handle delete confirmation
    const confirmDelete = (userId: number) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
            setCurrentUser(user);
            setIsDeleting(userId);
        }
    };

    const cancelDelete = () => {
        setIsDeleting(null);
        setCurrentUser(null);
    };

    const deleteUser = (userId: number) => {
        router.delete(route("users.destroy", userId), {
            onSuccess: () => {
                setIsDeleting(null);
                setCurrentUser(null);
            },
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

    const renderRoleBadges = (user: User) => {
        if (!user.roles || !user.roles.length) return null;

        // Extract role names properly, handling both string and object formats
        const roleNames = user.roles.map((role) =>
            typeof role === "string" ? role : (role as { name: string }).name
        );

        return (
            <div className="flex flex-wrap gap-1 mt-1">
                {roleNames.map((roleName, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                    >
                        {roleName}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout title="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Manajemen Pengguna
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola semua pengguna dalam sistem
                    </p>
                </div>

                {auth.user?.permissions?.includes("create-users") && (
                    <Link
                        href={route("users.create")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Pengguna Baru
                    </Link>
                )}
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cari berdasarkan nama, email, atau nomor telepon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter toggle */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                        {showFilters ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                    </button>

                    {(statusFilter || roleFilter) && (
                        <button
                            onClick={resetFilters}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Filter options */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter berdasarkan Status
                                    </label>
                                    <select
                                        value={statusFilter || ""}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target.value || null
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Status</option>
                                        {availableStatuses.map(
                                            (status, index) => (
                                                <option
                                                    key={index}
                                                    value={status}
                                                >
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Role filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter berdasarkan Peran
                                    </label>
                                    <select
                                        value={roleFilter || ""}
                                        onChange={(e) =>
                                            setRoleFilter(
                                                e.target.value || null
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Peran</option>
                                        {availableRoles.map((role, index) => (
                                            <option key={index} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active filters display */}
                {(statusFilter || roleFilter) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {statusFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                                Status: {statusFilter}
                                <X
                                    className="w-3 h-3 ml-1 cursor-pointer"
                                    onClick={() => setStatusFilter(null)}
                                />
                            </span>
                        )}
                        {roleFilter && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                                Peran: {roleFilter}
                                <X
                                    className="w-3 h-3 ml-1 cursor-pointer"
                                    onClick={() => setRoleFilter(null)}
                                />
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <AnimatePresence>
                    {filteredUsers.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="flex justify-center">
                                <UserIcon className="h-16 w-16 text-gray-300" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Tidak ada pengguna ditemukan
                            </h3>
                            <p className="mt-1 text-gray-500">
                                {searchTerm || statusFilter || roleFilter
                                    ? "Coba ubah filter pencarian Anda"
                                    : "Buat pengguna baru untuk mulai mengelola sistem Anda"}
                            </p>

                            {(searchTerm || statusFilter || roleFilter) && (
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium rounded-lg transition-colors text-sm"
                                >
                                    Reset Semua Filter
                                </button>
                            )}

                            {auth.user?.permissions?.includes("create-users") &&
                                !searchTerm &&
                                !statusFilter &&
                                !roleFilter && (
                                    <div className="mt-6">
                                        <Link
                                            href={route("users.create")}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            Tambah Pengguna Baru
                                        </Link>
                                    </div>
                                )}
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                                            <button
                                                onClick={() =>
                                                    toggleSort("name")
                                                }
                                                className="flex items-center hover:text-gray-900"
                                            >
                                                Nama
                                                {sortBy === "name" ? (
                                                    sortDirection === "asc" ? (
                                                        <ChevronUp className="ml-1 w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-1 w-4 h-4 opacity-50" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                                            <button
                                                onClick={() =>
                                                    toggleSort("email")
                                                }
                                                className="flex items-center hover:text-gray-900"
                                            >
                                                Email
                                                {sortBy === "email" ? (
                                                    sortDirection === "asc" ? (
                                                        <ChevronUp className="ml-1 w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="ml-1 w-4 h-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="ml-1 w-4 h-4 opacity-50" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                                            Telepon
                                        </th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                                            Status
                                        </th>
                                        <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`border-b border-gray-100 ${
                                                index % 2 === 1
                                                    ? "bg-gray-50/50"
                                                    : ""
                                            } hover:bg-blue-50/30`}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {user.image ? (
                                                            <img
                                                                src={
                                                                    user.image.startsWith(
                                                                        "http"
                                                                    )
                                                                        ? user.image
                                                                        : `/storage/${user.image}`
                                                                }
                                                                alt={user.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    // Fallback to default user image if loading fails
                                                                    e.currentTarget.onerror =
                                                                        null;
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                    const parent =
                                                                        e
                                                                            .currentTarget
                                                                            .parentElement;
                                                                    if (
                                                                        parent
                                                                    ) {
                                                                        const defaultImage =
                                                                            document.createElement(
                                                                                "div"
                                                                            );
                                                                        defaultImage.className =
                                                                            "w-full h-full flex items-center justify-center";
                                                                        defaultImage.innerHTML = `<div class="text-gray-400 font-medium text-sm">${user.name
                                                                            .substring(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .toUpperCase()}</div>`;
                                                                        parent.appendChild(
                                                                            defaultImage
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <DefaultUserImage
                                                                name={user.name}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-800">
                                                            {user.name}
                                                        </span>
                                                        {renderRoleBadges(user)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                <div className="flex items-center">
                                                    <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {user.phone ? (
                                                    <div className="flex items-center">
                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        Tidak ada nomor
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {renderUserStatus(user.status)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={route(
                                                            "users.show",
                                                            user.id
                                                        )}
                                                        className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>

                                                    {auth.user?.permissions?.includes(
                                                        "update-users"
                                                    ) && (
                                                        <Link
                                                            href={route(
                                                                "users.edit",
                                                                user.id
                                                            )}
                                                            className="p-1.5 rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                            title="Edit Pengguna"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    )}

                                                    {auth.user?.permissions?.includes(
                                                        "delete-users"
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    user.id
                                                                )
                                                            }
                                                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Hapus Pengguna"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleting !== null && currentUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg max-w-md w-full shadow-xl"
                        >
                            <div className="p-6">
                                <div className="flex items-center text-red-600 mb-4">
                                    <Trash2 className="h-6 w-6 mr-3" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Hapus Pengguna
                                    </h3>
                                </div>

                                <p className="text-gray-600 mb-1">
                                    Apakah Anda yakin ingin menghapus pengguna:
                                </p>
                                <p className="font-semibold text-gray-800 mb-4">
                                    "{currentUser.name}" ({currentUser.email})?
                                </p>

                                <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm mb-6">
                                    <p>
                                        Peringatan: Tindakan ini tidak dapat
                                        dibatalkan dan semua data terkait
                                        pengguna ini akan hilang.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={cancelDelete}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() =>
                                            isDeleting !== null &&
                                            deleteUser(isDeleting)
                                        }
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Hapus Pengguna
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
};

export default UsersIndex;
