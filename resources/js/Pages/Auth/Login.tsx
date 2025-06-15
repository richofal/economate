import { useState, FormEventHandler } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: "",
        password: "",
        remember: false,
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const EmailIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
        </svg>
    );

    const LockIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
        </svg>
    );

    const EyeIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
        </svg>
    );

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

    return (
        <GuestLayout
            showNavbar={true}
            showFooter={true}
            pageTitle="Login"
            withScrollIndicator={false}
        >
            <Head title="Login" />

            <div className="bg-gradient-to-br from-blue-50 to-[#e6f3ff] flex items-center justify-center min-h-screen w-full py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl flex w-11/12 max-w-5xl overflow-hidden"
                >
                    <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-gradient-to-br from-[#089BFF] to-[#0470b8] text-white p-8 rounded-l-2xl relative overflow-hidden flex-col justify-between">
                        <div className="flex flex-col h-full justify-between">
                            <div className="relative z-10">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold mb-4">
                                        Selamat Datang Kembali
                                    </h2>
                                    <p className="text-white/90 text-lg">
                                        Kelola keuangan lebih mudah dengan
                                        EconoMate, teman terbaik untuk
                                        merencanakan masa depan finansial Anda.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center relative z-10">
                                <img
                                    alt="EconoMate logo"
                                    className="mb-4"
                                    src="/images/logo.png"
                                    width={480}
                                    height={480}
                                />
                                <div className="mt-5 flex space-x-2">
                                    {[1, 2, 3].map((dot) => (
                                        <div
                                            key={dot}
                                            className="w-2 h-2 rounded-full bg-white/50"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Abstract shapes */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/20"></div>
                        <div className="absolute top-10 -right-20 w-40 h-40 rounded-full bg-blue-400/20"></div>
                    </div>

                    {/* Sign In Form */}
                    <div className="p-8 lg:p-12 w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-10 text-center md:text-left"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Masuk
                            </h2>
                            <p className="text-gray-500">
                                Kelola keuangan Anda dengan EconoMate
                            </p>
                        </motion.div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <EmailIcon />
                                    </div>
                                    <input
                                        id="email"
                                        className={`w-full pl-10 pr-4 py-3 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  transition duration-200`}
                                        placeholder="mail@example.com"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                </div>
                                <AnimatePresence>
                                    {errors.email && (
                                        <motion.span
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-red-500 text-xs mt-1 block"
                                        >
                                            {errors.email}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 mb-1 text-sm font-medium"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon />
                                    </div>
                                    <input
                                        id="password"
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/60 transition duration-200`}
                                        placeholder="Minimal 6 karakter"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon />
                                        ) : (
                                            <EyeIcon />
                                        )}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.span
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-red-500 text-xs mt-1 block"
                                        >
                                            {errors.password}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Remember Me & Forgot Password */}
                            <motion.div
                                className="flex justify-between items-center text-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label className="flex items-center cursor-pointer text-gray-600">
                                    <div className="relative w-4 h-4 mr-2">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <div
                                            className={`w-full h-full border-2 rounded flex items-center justify-center transition duration-200 ${
                                                data.remember
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {data.remember && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span>Ingat saya</span>
                                </label>
                                <Link
                                    href=""
                                    className="text-blue-500 hover:text-blue-700 font-medium transition"
                                >
                                    Lupa password?
                                </Link>
                            </motion.div>

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
                                    } transition duration-300`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
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
                                    </div>
                                ) : (
                                    "Masuk"
                                )}
                            </motion.button>
                        </form>

                        {/* Or Sign In with */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center my-6"
                        >
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="mx-4 text-gray-500 text-sm font-medium">
                                Atau masuk dengan
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </motion.div>

                        {/* Social Media Login Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-4"
                        >
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                            >
                                <GoogleIcon />
                                <span className="font-medium text-gray-700">
                                    Masuk dengan Google
                                </span>
                            </button>

                            <div className="mt-6 text-center text-gray-500 text-sm">
                                Belum punya akun?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-blue-500 font-medium hover:text-blue-700 transition"
                                >
                                    Daftar sekarang
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </GuestLayout>
    );
};

export default Login;
