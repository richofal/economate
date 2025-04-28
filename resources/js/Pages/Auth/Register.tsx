"use client";

import { useState, type FormEventHandler } from "react";
import {
    Eye,
    EyeOff,
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
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

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
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

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
                                            Create Your Account
                                        </h2>

                                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 mt-3 border border-blue-100">
                                            <p className="text-xs sm:text-sm text-blue-700">
                                                Join over 10,000 businesses
                                                managing their customer
                                                relationships with our platform
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                                            <div className="flex items-center text-xs text-gray-600">
                                                <svg
                                                    className="h-4 w-4 mr-1 text-green-500"
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
                                                <span>Free 14-day trial</span>
                                            </div>

                                            <div className="flex items-center text-xs text-gray-600">
                                                <svg
                                                    className="h-4 w-4 mr-1 text-green-500"
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
                                                <span>
                                                    No credit card required
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Form Fields */}
                                <div className="px-6 sm:px-8 space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Full Name"
                                            className="text-sm font-medium text-gray-700"
                                        />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="pl-10 block w-full py-2 sm:py-3 pr-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                                                autoComplete="name"
                                                isFocused={true}
                                                placeholder="John Doe"
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {errors.name && (
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
                                                        message={errors.name}
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
                                                autoComplete="new-password"
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

                                        {/* Password strength indicator */}
                                        {data.password && !errors.password && (
                                            <div className="mt-2">
                                                <div className="flex space-x-1 mb-1">
                                                    {[...Array(4)].map(
                                                        (_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1 rounded-full flex-1 ${
                                                                    i <
                                                                    passwordStrength
                                                                        ? [
                                                                              "bg-red-400",
                                                                              "bg-orange-400",
                                                                              "bg-yellow-400",
                                                                              "bg-green-400",
                                                                          ][
                                                                              passwordStrength -
                                                                                  1
                                                                          ]
                                                                        : "bg-gray-200"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {passwordStrength < 2 &&
                                                        "Weak password"}
                                                    {passwordStrength === 2 &&
                                                        "Medium password"}
                                                    {passwordStrength === 3 &&
                                                        "Strong password"}
                                                    {passwordStrength === 4 &&
                                                        "Very strong password"}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password"
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
                                                id="password_confirmation"
                                                type={
                                                    showPasswordConfirmation
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                className="pl-10 block w-full py-2 sm:py-3 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPasswordConfirmation(
                                                            !showPasswordConfirmation
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                    aria-label={
                                                        showPasswordConfirmation
                                                            ? "Hide password"
                                                            : "Show password"
                                                    }
                                                >
                                                    {showPasswordConfirmation ? (
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
                                            {errors.password_confirmation && (
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
                                                            errors.password_confirmation
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

                                    {/* Password match indicator */}
                                    {data.password &&
                                        data.password_confirmation && (
                                            <div className="flex items-center text-sm">
                                                {data.password ===
                                                data.password_confirmation ? (
                                                    <div className="text-green-600 flex items-center">
                                                        <Check
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        Passwords match
                                                    </div>
                                                ) : (
                                                    <div className="text-red-600 flex items-center">
                                                        <AlertCircle
                                                            size={16}
                                                            className="mr-1"
                                                        />
                                                        Passwords do not match
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {/* Submit Button and Login Link */}
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
                                                    <UserPlus
                                                        size={18}
                                                        className="text-indigo-200 group-hover:text-indigo-100"
                                                    />
                                                )}
                                            </span>
                                            {processing
                                                ? "Creating account..."
                                                : "Create Account"}
                                        </motion.button>

                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                Already have an account?{" "}
                                                <Link
                                                    href={route("login")}
                                                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                                >
                                                    Sign in
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
                                        Your information is secure - We use
                                        encryption to protect your data
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

export default Register;
