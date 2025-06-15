import { useForm } from "@inertiajs/react";
import { FormEvent, useState, ChangeEvent, useRef, useEffect } from "react";
import { PageProps, User } from "@/types";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    UserCircle,
    Check,
    Mail,
    Phone,
    MapPin,
    Calendar,
    User as UserIcon,
    Camera,
    X,
    Upload,
    Clock,
    Mars,
    Venus,
} from "lucide-react";
import { Transition } from "@headlessui/react";
import { formatDate } from "@/lib/utils";

export default function UpdateProfileInformationForm({
    className = "",
    user,
}: {
    className?: string;
    user: User;
}) {
    const photoInput = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showDeletePhotoButton, setShowDeletePhotoButton] = useState(
        !!user.image
    );

    const getImageUrl = (path: string | null | undefined) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `/storage/${path}`;
    };

    const [photoPreview, setPhotoPreview] = useState<string | null>(
        getImageUrl(user.image)
    );

    const {
        data,
        setData,
        post,
        errors,
        processing,
        recentlySuccessful,
        reset,
    } = useForm({
        _method: "PATCH",
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        birth_date: user.birth_date || "",
        gender: user.gender || "",
        image: null as File | null,
        _remove_image: false as boolean,
    });

    useEffect(() => {
        if (recentlySuccessful) {
            const timer = setTimeout(() => {
                // Reset success message after 3 seconds
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        processImageFile(file);
    };

    const processImageFile = (file: File) => {
        if (!file.type.match(/image\/(jpeg|png|gif|jpg|webp)/)) {
            alert("Format file tidak didukung! Gunakan JPG, PNG, atau GIF.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file terlalu besar! Maksimal 2MB");
            return;
        }

        setData("image", file);
        setPhotoPreview(URL.createObjectURL(file));
        setShowDeletePhotoButton(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        processImageFile(file);
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setData("image", null);
        setData("_remove_image", true);
        setShowDeletePhotoButton(false);
        if (photoInput.current) {
            photoInput.current.value = "";
        }
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route("profile.update"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <section
            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
        >
            <header className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-medium text-gray-900">
                        Informasi Profil
                    </h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Photo Upload Section with drag and drop */}
                <div className="border-b border-gray-200 pb-6">
                    <Label
                        htmlFor="image"
                        className="block text-sm font-medium mb-3"
                    >
                        Foto Profil
                    </Label>
                    <div className="flex items-center gap-6">
                        {/* Photo preview */}
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="h-24 w-24 object-cover"
                                    />
                                ) : (
                                    <UserCircle className="h-16 w-16 text-gray-300" />
                                )}
                            </div>

                            {/* Overlay edit button */}
                            <button
                                type="button"
                                onClick={() => photoInput.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Drag & Drop area */}
                        <div className="flex-1">
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                    isDragging
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                onClick={() => photoInput.current?.click()}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium text-blue-600">
                                            Klik untuk upload
                                        </span>{" "}
                                        atau drag &amp; drop
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        PNG, JPG, GIF (Max. 2MB)
                                    </span>
                                </div>
                            </div>

                            <input
                                id="image"
                                type="file"
                                ref={photoInput}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif, image/webp"
                            />

                            {/* Photo options */}
                            <div className="flex mt-2 gap-2 justify-end">
                                {showDeletePhotoButton && (
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        className="text-xs flex items-center text-red-600 hover:text-red-800"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Hapus foto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {errors.image && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.image}
                        </p>
                    )}
                </div>

                {/* Personal Information Section */}
                <div className="space-y-6">
                    <h3 className="text-md font-medium text-gray-900">
                        Data Pribadi
                    </h3>

                    {/* Full Name */}
                    <div>
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-1.5"
                        >
                            <UserIcon className="h-3.5 w-3.5 text-gray-500" />
                            Nama Lengkap
                        </Label>
                        <div className="mt-1">
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                className={
                                    errors.name
                                        ? "border-red-300 focus:ring-red-500"
                                        : ""
                                }
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label
                            htmlFor="email"
                            className="flex items-center gap-1.5"
                        >
                            <Mail className="h-3.5 w-3.5 text-gray-500" />
                            Alamat Email
                        </Label>
                        <div className="mt-1 relative">
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                className={
                                    errors.email
                                        ? "border-red-300 focus:ring-red-500"
                                        : ""
                                }
                            />
                            {user.email_verified_at && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                            )}
                        </div>
                        {errors.email ? (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        ) : user.email_verified_at ? (
                            <p className="text-green-600 text-xs mt-1">
                                Email terverifikasi
                            </p>
                        ) : (
                            <p className="text-amber-600 text-xs mt-1">
                                Email belum terverifikasi
                            </p>
                        )}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div>
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-1.5"
                            >
                                <Phone className="h-3.5 w-3.5 text-gray-500" />
                                Nomor Telepon
                            </Label>
                            <div className="mt-1">
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="+62"
                                    className={
                                        errors.phone
                                            ? "border-red-300 focus:ring-red-500"
                                            : ""
                                    }
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Birth Date */}
                        <div>
                            <Label
                                htmlFor="birth_date"
                                className="flex items-center gap-1.5"
                            >
                                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                Tanggal Lahir
                            </Label>
                            <div className="mt-1">
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={formatDate(data.birth_date)}
                                    onChange={(e) =>
                                        setData("birth_date", e.target.value)
                                    }
                                    max={new Date().toISOString().split("T")[0]}
                                    className={
                                        errors.birth_date
                                            ? "border-red-300 focus:ring-red-500"
                                            : ""
                                    }
                                />
                            </div>
                            {errors.birth_date && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.birth_date}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <Label
                            htmlFor="gender"
                            className="flex items-center gap-1.5 mb-2"
                        >
                            {data.gender === "male" ? (
                                <Mars className="h-3.5 w-3.5 text-blue-500" />
                            ) : data.gender === "female" ? (
                                <Venus className="h-3.5 w-3.5 text-pink-500" />
                            ) : (
                                <UserIcon className="h-3.5 w-3.5 text-gray-500" />
                            )}
                            Jenis Kelamin
                        </Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={data.gender === "male"}
                                    onChange={() => setData("gender", "male")}
                                    className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <span className="text-sm">Laki-laki</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={data.gender === "female"}
                                    onChange={() => setData("gender", "female")}
                                    className="text-pink-600 focus:ring-pink-500 h-4 w-4"
                                />
                                <span className="text-sm">Perempuan</span>
                            </label>
                        </div>
                        {errors.gender && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.gender}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <Label
                            htmlFor="address"
                            className="flex items-center gap-1.5"
                        >
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            Alamat
                        </Label>
                        <div className="mt-1">
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                rows={3}
                                placeholder="Masukkan alamat lengkap Anda"
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${
                                    errors.address
                                        ? "border-red-300 focus:ring-red-500"
                                        : ""
                                }`}
                            />
                        </div>
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Terakhir diupdate: {formatDate(user.updated_at || "")}
                    </p>

                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={processing}
                        >
                            Kembali
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-6"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Menyimpan...
                                </>
                            ) : (
                                <>Simpan Perubahan</>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Success message */}
                <Transition
                    show={recentlySuccessful}
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-800">
                                    Informasi profil berhasil diperbarui!
                                </p>
                            </div>
                        </div>
                    </div>
                </Transition>
            </form>
        </section>
    );
}
