"use client";

import { useState, type FormEventHandler } from "react";
import {
    Eye,
    EyeOff,
    LogIn,
    Mail,
    Lock,
    AlertCircle,
    Loader,
    Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
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

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:py-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden py-4">
                            {/* Form with Header inside */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Header now inside the form */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center pt-8 px-6 sm:px-8"
                                >
                                    <div className="space-y-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
                                            PT SMART
                                        </h1>
                                    </div>

                                    <div className="mt-4 sm:mt-6 max-w-md mx-auto">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                            Sign In To Your Account
                                        </h2>

                                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 mt-3 border border-blue-100">
                                            <p className="text-xs sm:text-sm text-blue-700">
                                                Welcome back! Please enter your
                                                credentials to access your
                                                account
                                            </p>
                                        </div>

                                        {status && (
                                            <div className="bg-green-50 rounded-lg p-2 sm:p-3 mt-3 border border-green-100">
                                                <p className="text-xs sm:text-sm text-green-700">
                                                    {status}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Form Fields */}
                                <div className="px-6 sm:px-8 space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email Address"
                                            className="text-sm font-medium text-gray-700"
                                        />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="pl-10 block w-full py-2 sm:py-3 pr-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                                                autoComplete="username"
                                                placeholder="name@company.com"
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                isFocused={true}
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                >
                                                    <InputError
                                                        message={errors.email}
                                                        className="mt-2 flex items-center"
                                                    >
                                                        <AlertCircle
                                                            size={16}
                                                            className="mr-1 flex-shrink-0"
                                                        />
                                                    </InputError>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                            className="text-sm font-medium text-gray-700"
                                        />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <TextInput
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                className="pl-10 block w-full py-2 sm:py-3 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                    aria-label={
                                                        showPassword
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff
                                                            size={18}
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Eye
                                                            size={18}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        height: "auto",
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        height: 0,
                                                    }}
                                                >
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                        className="mt-2 flex items-center"
                                                    >
                                                        <AlertCircle
                                                            size={16}
                                                            className="mr-1 flex-shrink-0"
                                                        />
                                                    </InputError>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Remember Me & Forgot Password Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember"
                                                name="remember"
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor="remember"
                                                className="ml-2 block text-sm text-gray-600"
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Button and Register Link */}
                                    <div className="pt-2">
                                        <motion.button
                                            type="submit"
                                            disabled={processing}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
                                        >
                                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                {processing ? (
                                                    <Loader
                                                        size={18}
                                                        className="animate-spin text-blue-300"
                                                    />
                                                ) : (
                                                    <LogIn
                                                        size={18}
                                                        className="text-indigo-200 group-hover:text-indigo-100"
                                                    />
                                                )}
                                            </span>
                                            {processing
                                                ? "Signing in..."
                                                : "Sign In"}
                                        </motion.button>

                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                Don't have an account?{" "}
                                                <Link
                                                    href={route("register")}
                                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                                >
                                                    Create account
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="text-center mt-4 mb-6 px-6"
                                >
                                    <p className="text-xs text-gray-500 flex items-center justify-center">
                                        <Shield
                                            size={16}
                                            className="mr-1 text-gray-400"
                                        />
                                        Your connection is secure - We protect
                                        your login information
                                    </p>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Login;
