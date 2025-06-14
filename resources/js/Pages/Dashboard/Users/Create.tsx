import { useState, FormEventHandler } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save,
    Loader,
    Info,
    X,
    Eye,
    EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import InputError from "@/Components/InputError";

interface CreateUserPageProps extends PageProps {
    roles?: Array<{
        id: number;
        name: string;
    }>;
}

const UsersCreate = () => {
    const { auth, roles = [] } = usePage<CreateUserPageProps>().props;
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorSummary, setShowErrorSummary] = useState(false);

    // Form state using Inertia's useForm
    const form = useForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        birth_date: "",
        gender: "",
        password: "",
        password_confirmation: "",
        roles: [] as string[],
        status: "active",
    });

    // Handle role selection
    const handleRoleToggle = (roleName: string) => {
        const currentRoles = [...form.data.roles];
        if (currentRoles.includes(roleName)) {
            form.setData(
                "roles",
                currentRoles.filter((role) => role !== roleName)
            );
        } else {
            form.setData("roles", [...currentRoles, roleName]);
        }
    };

    // Form submission
    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route("users.store"), {
            onError: () => {
                if (Object.keys(form.errors).length > 0) {
                    setShowErrorSummary(true);
                    // Scroll to top to show the error summary
                    window.scrollTo(0, 0);
                }
            },
        });
    };

    return (
        <AuthenticatedLayout title="Tambah Pengguna Baru">
            <Head title="Tambah Pengguna Baru" />

            {/* Back button and page title */}
            <div className="mb-6">
                <Link
                    href={route("users.index")}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Daftar Pengguna
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    Tambah Pengguna Baru
                </h1>
            </div>

            {/* Error Summary */}
            {showErrorSummary && Object.keys(form.errors).length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Terdapat {Object.keys(form.errors).length}{" "}
                                kesalahan pada formulir
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {Object.entries(form.errors).map(
                                        ([field, error]) => (
                                            <li key={field}>{error}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    onClick={() => setShowErrorSummary(false)}
                                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Informasi Dasar
                            </h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nama Lengkap{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="name"
                                            type="text"
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.name
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.name}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.email
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } pl-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.email}
                                            onChange={(e) =>
                                                form.setData(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={form.errors.email}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Nomor Telepon
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="phone"
                                            type="text"
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.phone
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } pl-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.phone}
                                            onChange={(e) =>
                                                form.setData(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={form.errors.phone}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Alamat
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="address"
                                            type="text"
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.address
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } pl-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.address}
                                            onChange={(e) =>
                                                form.setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={form.errors.address}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label
                                        htmlFor="birth_date"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tanggal Lahir
                                    </label>
                                    <div className="mt-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="birth_date"
                                            type="date"
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.birth_date
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } pl-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.birth_date}
                                            onChange={(e) =>
                                                form.setData(
                                                    "birth_date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={form.errors.birth_date}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="gender"
                                        className={`mt-1 block w-full rounded-md border ${
                                            form.errors.gender
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                        value={form.data.gender}
                                        onChange={(e) =>
                                            form.setData(
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Pilih Jenis Kelamin
                                        </option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">
                                            Perempuan
                                        </option>
                                    </select>
                                    <InputError
                                        message={form.errors.gender}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Authentication Section */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Informasi Autentikasi
                            </h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors.password
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } pr-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={form.data.password}
                                            onChange={(e) =>
                                                form.setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Minimal 8 karakter
                                    </p>
                                    <InputError
                                        message={form.errors.password}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Password Confirmation */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Konfirmasi Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password_confirmation"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className={`mt-1 block w-full rounded-md border ${
                                                form.errors
                                                    .password_confirmation
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                            value={
                                                form.data.password_confirmation
                                            }
                                            onChange={(e) =>
                                                form.setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                form.errors
                                                    .password_confirmation
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status and Roles Section */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                                Status & Peran
                            </h2>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Field */}
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className={`mt-1 block w-full rounded-md border ${
                                            form.errors.status
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
                                        value={form.data.status}
                                        onChange={(e) =>
                                            form.setData(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">
                                            Tidak Aktif
                                        </option>
                                        <option value="banned">Diblokir</option>
                                    </select>
                                    <InputError
                                        message={form.errors.status}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Roles Field */}
                                {roles.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pilih Peran
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.id}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        id={`role-${role.id}`}
                                                        name="roles"
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        checked={form.data.roles.includes(
                                                            role.name
                                                        )}
                                                        onChange={() =>
                                                            handleRoleToggle(
                                                                role.name
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`role-${role.id}`}
                                                        className="ml-2 block text-sm text-gray-700"
                                                    >
                                                        {role.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError
                                            message={
                                                form.errors.roles as string
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end border-t pt-6 gap-3">
                        <Link
                            href={route("users.index")}
                            className="inline-flex justify-center py-2.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                        >
                            {form.processing ? (
                                <>
                                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Pengguna
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default UsersCreate;
