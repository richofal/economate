// resources/js/Pages/Dashboard/Profile/Index.tsx

import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps, User } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    User as UserIcon,
    Phone,
    Shield,
    CheckCircle,
    Clock,
    UserCircle,
    Mars,
    Venus,
    Edit,
    Mail,
    MapPin,
    Calendar,
    KeyRound,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import React from "react";

// Tipe props halaman
interface ProfilePageProps extends PageProps {
    user: User;
}

// Komponen kecil untuk menampilkan satu item informasi
const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
        <dt className="text-sm font-medium text-gray-600 flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
        </dt>
        <dd className="text-sm text-gray-800 text-right font-semibold">
            {value || "-"}
        </dd>
    </div>
);

// Komponen kecil untuk menampilkan badge
const Badge = ({ text, className }: { text: string; className?: string }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-md ${className}`}>
        {text}
    </span>
);

export default function ProfileIndex() {
    const { user } = usePage<ProfilePageProps>().props;

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "inactive":
                return "bg-gray-100 text-gray-800";
            case "suspended":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const getGenderInfo = (gender?: string) => {
        if (gender === "male")
            return (
                <div className="flex items-center justify-end">
                    <Mars className="h-4 w-4 mr-1.5 text-blue-500" /> Laki-laki
                </div>
            );
        if (gender === "female")
            return (
                <div className="flex items-center justify-end">
                    <Venus className="h-4 w-4 mr-1.5 text-pink-500" /> Perempuan
                </div>
            );
        return "-";
    };

    return (
        <AuthenticatedLayout title="Profil Saya">
            <Head title="Profil Saya" />
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-lg rounded-xl">
                    <div className="relative">
                        <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400" />
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
                            <div className="h-32 w-32 rounded-full ring-4 ring-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                {user.image ? (
                                    <img
                                        // [PERBAIKAN] Tambahkan `/` di depan untuk membuat path absolut
                                        src={`/storage/${user.image}`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserCircle className="h-24 w-24 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 text-center border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.name}
                        </h1>
                        <p className="text-md text-blue-600 font-semibold mt-1">
                            {user.roles && user.roles.length > 0
                                ? user.roles.join(" / ")
                                : "User"}
                        </p>
                        <div className="mt-4">
                            <Badge
                                text={user.status}
                                className={getStatusBadgeClasses(user.status)}
                            />
                        </div>
                        <div className="mt-6">
                            <Link
                                href={route("profile.edit")}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profil
                            </Link>
                        </div>
                    </div>

                    <div className="p-6">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Informasi Pribadi
                                </h3>
                                <InfoItem
                                    icon={
                                        <UserIcon
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Nama Lengkap"
                                    value={user.name}
                                />
                                <InfoItem
                                    icon={
                                        <Mail
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Email"
                                    value={user.email}
                                />
                                <InfoItem
                                    icon={
                                        <Phone
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Telepon"
                                    value={user.phone}
                                />
                                <InfoItem
                                    icon={
                                        <MapPin
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Alamat"
                                    value={user.address}
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Informasi Akun
                                </h3>
                                <InfoItem
                                    icon={
                                        <Calendar
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Tanggal Lahir"
                                    value={
                                        user.birth_date
                                            ? formatDate(user.birth_date)
                                            : "-"
                                    }
                                />
                                <InfoItem
                                    icon={
                                        <UserIcon
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Jenis Kelamin"
                                    value={getGenderInfo(
                                        user.gender || undefined
                                    )}
                                />
                                <InfoItem
                                    icon={
                                        <CheckCircle
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Email Terverifikasi"
                                    value={
                                        user.email_verified_at
                                            ? formatDate(user.email_verified_at)
                                            : "Belum"
                                    }
                                />
                                <InfoItem
                                    icon={
                                        <Clock
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    }
                                    label="Bergabung Sejak"
                                    value={
                                        user.created_at
                                            ? formatDate(user.created_at)
                                            : "-"
                                    }
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Peran & Izin
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <InfoItem
                                        icon={
                                            <Shield
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        }
                                        label="Peran"
                                        value={
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                {user.roles?.map((role) => (
                                                    <Badge
                                                        key={role}
                                                        text={role}
                                                        className="bg-blue-100 text-blue-800"
                                                    />
                                                ))}
                                            </div>
                                        }
                                    />
                                    <InfoItem
                                        icon={
                                            <KeyRound
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        }
                                        label="Total Izin"
                                        value={`${user.permissions.length} Izin Diberikan`}
                                    />
                                </div>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
