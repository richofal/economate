import { FormEvent, useRef, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Transition } from "@headlessui/react";
import {
    Check,
    Eye,
    EyeOff,
    Shield,
    AlertCircle,
    X,
    CheckCircle,
    Lock,
} from "lucide-react";

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Password visibility toggles
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirmation: false,
    });

    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: "",
    });

    // Check password strength when password changes
    useEffect(() => {
        if (data.password) {
            const score = calculatePasswordStrength(data.password);
            setPasswordStrength({
                score,
                feedback: getPasswordFeedback(score),
            });
        } else {
            setPasswordStrength({ score: 0, feedback: "" });
        }
    }, [data.password]);

    // Function to calculate password strength (simple version)
    const calculatePasswordStrength = (password: string): number => {
        let score = 0;

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Complexity checks
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        return Math.min(score, 5);
    };

    // Get feedback based on password strength score
    const getPasswordFeedback = (score: number): string => {
        switch (score) {
            case 0:
            case 1:
                return "Sangat lemah";
            case 2:
                return "Lemah";
            case 3:
                return "Sedang";
            case 4:
                return "Kuat";
            case 5:
                return "Sangat kuat";
            default:
                return "";
        }
    };

    // Get color for password strength indicator
    const getStrengthColor = (score: number): string => {
        switch (score) {
            case 0:
            case 1:
                return "bg-red-500";
            case 2:
                return "bg-orange-500";
            case 3:
                return "bg-yellow-500";
            case 4:
                return "bg-blue-500";
            case 5:
                return "bg-green-500";
            default:
                return "bg-gray-200";
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (
        field: "current" | "new" | "confirmation"
    ) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [field]: !passwordVisibility[field],
        });
    };

    const updatePassword = (e: FormEvent) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPasswordStrength({ score: 0, feedback: "" });
            },
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    // Check if passwords match
    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;

    return (
        <section
            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
        >
            <header className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-medium text-gray-900">
                        Ubah Kata Sandi
                    </h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                    Pastikan akun Anda menggunakan kata sandi yang panjang dan
                    acak agar tetap aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="space-y-1">
                    <Label
                        htmlFor="current_password"
                        className="flex items-center gap-1.5"
                    >
                        <Lock className="h-3.5 w-3.5 text-gray-500" />
                        Kata Sandi Saat Ini
                    </Label>
                    <div className="relative">
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData("current_password", e.target.value)
                            }
                            type={
                                passwordVisibility.current ? "text" : "password"
                            }
                            autoComplete="current-password"
                            className={`pr-10 ${
                                errors.current_password
                                    ? "border-red-300 focus-visible:ring-red-500"
                                    : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                            {passwordVisibility.current ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.current_password && (
                        <div className="flex items-center text-red-600 text-xs mt-1.5">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {errors.current_password}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <Label
                        htmlFor="password"
                        className="flex items-center gap-1.5"
                    >
                        <Lock className="h-3.5 w-3.5 text-gray-500" />
                        Kata Sandi Baru
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            type={passwordVisibility.new ? "text" : "password"}
                            autoComplete="new-password"
                            className={`pr-10 ${
                                errors.password
                                    ? "border-red-300 focus-visible:ring-red-500"
                                    : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                            {passwordVisibility.new ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {/* Password strength indicator */}
                    {data.password && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">
                                    Kekuatan kata sandi
                                </span>
                                <span
                                    className={`text-xs font-medium ${
                                        passwordStrength.score <= 2
                                            ? "text-red-600"
                                            : passwordStrength.score === 3
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {passwordStrength.feedback}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${getStrengthColor(
                                        passwordStrength.score
                                    )}`}
                                    style={{
                                        width: `${
                                            (passwordStrength.score / 5) * 100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {errors.password && (
                        <div className="flex items-center text-red-600 text-xs mt-1.5">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <Label
                        htmlFor="password_confirmation"
                        className="flex items-center gap-1.5"
                    >
                        <Lock className="h-3.5 w-3.5 text-gray-500" />
                        Konfirmasi Kata Sandi
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type={
                                passwordVisibility.confirmation
                                    ? "text"
                                    : "password"
                            }
                            autoComplete="new-password"
                            className={`pr-10 ${
                                errors.password_confirmation
                                    ? "border-red-300 focus-visible:ring-red-500"
                                    : data.password_confirmation &&
                                      passwordsMatch
                                    ? "border-green-300 focus-visible:ring-green-500"
                                    : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                togglePasswordVisibility("confirmation")
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        >
                            {passwordVisibility.confirmation ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>

                        {/* Show check icon when passwords match */}
                        {data.password_confirmation && passwordsMatch && (
                            <div className="absolute inset-y-0 right-10 flex items-center pr-1 text-green-500">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                    {errors.password_confirmation && (
                        <div className="flex items-center text-red-600 text-xs mt-1.5">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {errors.password_confirmation}
                        </div>
                    )}
                </div>

                {/* Password requirements reminder */}
                <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                        Kata sandi harus:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-start">
                            <Check className="h-3 w-3 mr-1.5 mt-0.5 text-blue-600" />
                            Minimal 8 karakter
                        </li>
                        <li className="flex items-start">
                            <Check className="h-3 w-3 mr-1.5 mt-0.5 text-blue-600" />
                            Mengandung setidaknya 1 huruf besar dan huruf kecil
                        </li>
                        <li className="flex items-start">
                            <Check className="h-3 w-3 mr-1.5 mt-0.5 text-blue-600" />
                            Mengandung setidaknya 1 angka
                        </li>
                        <li className="flex items-start">
                            <Check className="h-3 w-3 mr-1.5 mt-0.5 text-blue-600" />
                            Tidak sama dengan kata sandi sebelumnya
                        </li>
                    </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-4">
                    {recentlySuccessful && (
                        <Transition
                            show={recentlySuccessful}
                            enterFrom="opacity-0"
                            leaveTo="opacity-0"
                        >
                            <div className="text-sm text-green-600 flex items-center bg-green-50 px-3 py-1 rounded-md">
                                <Check className="mr-1 h-4 w-4" /> Kata sandi
                                berhasil diperbarui
                            </div>
                        </Transition>
                    )}

                    <Button
                        disabled={
                            processing ||
                            !data.current_password ||
                            !data.password ||
                            !data.password_confirmation ||
                            !passwordsMatch
                        }
                        className={`${
                            !data.current_password ||
                            !data.password ||
                            !data.password_confirmation ||
                            !passwordsMatch
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
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
                                Memproses...
                            </>
                        ) : (
                            <>Perbarui Kata Sandi</>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
}
