import { useState, type FormEventHandler } from "react";
import {
    Eye as RiEyeLine,
    EyeOff as RiEyeOffLine,
    UserPlus,
    Mail,
    Lock,
    User,
    AlertCircle,
    Loader,
    Shield,
    Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 48 48"
    >
        <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
    </svg>
);

const Register = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    const passwordStrength = getPasswordStrength(data.password);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
            onSuccess: () => setRegisterSuccess(true),
        });
    };

    return (
        <GuestLayout
            showNavbar={true}
            showFooter={true}
            pageTitle="Register"
            withScrollIndicator={false}
        >
            <Head title="Register" />

            <div className="bg-gradient-to-br from-blue-50 to-[#e6f3ff] flex items-center justify-center min-h-screen w-full py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl flex w-11/12 max-w-5xl overflow-hidden"
                >
                    {/* Form Section */}
                    <div className="p-8 lg:p-12 w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 text-center md:text-left"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Daftar Akun
                            </h2>
                            <p className="text-gray-500">
                                Buat akun untuk mulai mengelola keuangan Anda
                            </p>
                        </motion.div>

                        {registerSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 rounded-lg bg-green-100 text-green-700 text-sm flex items-start"
                            >
                                <Check
                                    size={18}
                                    className="mr-2 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    Registrasi berhasil! Silahkan cek email Anda
                                    untuk verifikasi atau
                                    <Link
                                        href={route("login")}
                                        className="ml-1 text-green-800 font-medium hover:underline"
                                    >
                                        login sekarang
                                    </Link>
                                </span>
                            </motion.div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                    htmlFor="name"
                                >
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="name"
                                        className={`w-full pl-10 pr-4 py-3 border ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60`}
                                        placeholder="Masukkan nama lengkap"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                                <AnimatePresence>
                                    {errors.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex items-center text-red-500 text-xs mt-1"
                                        >
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            <span>{errors.name}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="email"
                                        className={`w-full pl-10 pr-4 py-3 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60`}
                                        placeholder="contoh@email.com"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                                <AnimatePresence>
                                    {errors.email && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex items-center text-red-500 text-xs mt-1"
                                        >
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            <span>{errors.email}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60`}
                                        placeholder="Minimal 8 karakter"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <RiEyeOffLine size={20} />
                                        ) : (
                                            <RiEyeLine size={20} />
                                        )}
                                    </button>
                                </div>

                                {/* Password strength indicator */}
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs text-gray-500">
                                                Kekuatan Password:
                                            </span>
                                            <span className="text-xs font-medium">
                                                {passwordStrength === 0 &&
                                                    "Sangat lemah"}
                                                {passwordStrength === 1 &&
                                                    "Lemah"}
                                                {passwordStrength === 2 &&
                                                    "Sedang"}
                                                {passwordStrength === 3 &&
                                                    "Kuat"}
                                                {passwordStrength === 4 &&
                                                    "Sangat kuat"}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength === 0
                                                        ? "bg-red-500 w-[10%]"
                                                        : passwordStrength === 1
                                                        ? "bg-orange-500 w-[25%]"
                                                        : passwordStrength === 2
                                                        ? "bg-yellow-500 w-[50%]"
                                                        : passwordStrength === 3
                                                        ? "bg-lime-500 w-[75%]"
                                                        : "bg-green-500 w-full"
                                                }`}
                                            ></div>
                                        </div>

                                        {/* Password requirements */}
                                        <div className="mt-2 grid grid-cols-2 gap-1">
                                            <div className="flex items-center text-xs">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-1.5 transition-colors ${
                                                        data.password.length >=
                                                        8
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        data.password.length >=
                                                        8
                                                            ? "text-gray-700"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Minimal 8 karakter
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-1.5 transition-colors ${
                                                        /[A-Z]/.test(
                                                            data.password
                                                        )
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        /[A-Z]/.test(
                                                            data.password
                                                        )
                                                            ? "text-gray-700"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Huruf kapital
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-1.5 transition-colors ${
                                                        /[0-9]/.test(
                                                            data.password
                                                        )
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        /[0-9]/.test(
                                                            data.password
                                                        )
                                                            ? "text-gray-700"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Angka
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-1.5 transition-colors ${
                                                        /[^A-Za-z0-9]/.test(
                                                            data.password
                                                        )
                                                            ? "bg-green-500"
                                                            : "bg-gray-300"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={
                                                        /[^A-Za-z0-9]/.test(
                                                            data.password
                                                        )
                                                            ? "text-gray-700"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    Karakter khusus
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex items-center text-red-500 text-xs mt-1"
                                        >
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            <span>{errors.password}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                    htmlFor="password_confirmation"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Shield
                                            size={18}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.password_confirmation
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60`}
                                        placeholder="Masukkan password lagi"
                                        type={
                                            showPasswordConfirmation
                                                ? "text"
                                                : "password"
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                !showPasswordConfirmation
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? (
                                            <RiEyeOffLine size={20} />
                                        ) : (
                                            <RiEyeLine size={20} />
                                        )}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {errors.password_confirmation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex items-center text-red-500 text-xs mt-1"
                                        >
                                            <AlertCircle
                                                size={14}
                                                className="mr-1"
                                            />
                                            <span>
                                                {errors.password_confirmation}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center 
                                ${
                                    processing
                                        ? "bg-blue-400 text-white cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                                } transition duration-300 mt-2`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <UserPlus className="mr-2" size={20} />
                                        <span>Daftar</span>
                                    </div>
                                )}
                            </motion.button>
                        </form>

                        {/* Or Sign Up with */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center my-6"
                        >
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="mx-4 text-gray-500 text-sm font-medium">
                                Atau daftar dengan
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </motion.div>

                        {/* Social Media Registration Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-4"
                        >
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                                onClick={() =>
                                    (window.location.href =
                                        route("auth.google"))
                                }
                            >
                                <GoogleIcon />
                                <span className="font-medium text-gray-700">
                                    Daftar dengan Google
                                </span>
                            </button>

                            <div className="mt-6 text-center text-gray-500 text-sm">
                                Sudah punya akun?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-500 font-medium hover:text-blue-700 transition"
                                >
                                    Masuk disini
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Section - Illustration */}
                    <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-gradient-to-br from-[#089BFF] to-[#0470b8] text-white p-8 rounded-r-2xl relative overflow-hidden flex-col justify-center">
                        <div className="relative z-10">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-4">
                                    Atur Keuangan dengan Mudah
                                </h2>
                                <p className="text-white/90 text-lg">
                                    Mulai perjalanan finansial yang lebih baik
                                    dengan EconoMate, teman terbaik untuk
                                    merencanakan masa depan finansial Anda.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center relative z-10">
                            <img
                                alt="EconoMate logo"
                                className="mb-6"
                                src="/images/logo.png"
                                width={240}
                                height={240}
                            />

                            <div className="mt-5 flex space-x-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center flex-1">
                                    <h3 className="text-lg font-semibold mb-1">
                                        Cepat
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        Langsung akses Layanan
                                    </p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-center flex-1">
                                    <h3 className="text-lg font-semibold mb-1">
                                        Mudah
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        Antarmuka ramah pengguna
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Abstract shapes */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/20"></div>
                        <div className="absolute top-10 -right-20 w-40 h-40 rounded-full bg-blue-400/20"></div>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
};

export default Register;
