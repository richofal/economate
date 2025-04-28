"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
    Menu,
    X,
    ChevronDown,
    Globe,
    User,
    Bell,
    Search,
    LogOut,
    Settings,
    LayoutDashboard,
} from "lucide-react";
import { usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
    transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
    const { auth } = usePage().props as any;

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [servicesDropdown, setServicesDropdown] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Check if current route matches given route name
    const isCurrentRoute = (routeName: string) => {
        return route().current(routeName);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (
                servicesDropdown &&
                !target.closest(".services-dropdown-container")
            ) {
                setServicesDropdown(false);
            }

            if (
                profileDropdown &&
                !target.closest(".profile-dropdown-container")
            ) {
                setProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [servicesDropdown, profileDropdown]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine navbar background style based on scroll state and transparent prop
    const navbarBg = () => {
        if (scrolled) {
            return "bg-white text-blue-800 shadow-lg py-2";
        } else if (transparent) {
            return "bg-transparent text-white py-4";
        } else {
            return "bg-gradient-to-r from-blue-600/90 to-blue-800/90 backdrop-blur-sm text-white py-4";
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg()}`}
        >
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo and brand */}
                    <Link
                        href={route("welcome")}
                        className="flex items-center space-x-3 group"
                    >
                        <div
                            className={`rounded-full p-2 ${
                                scrolled
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/20 backdrop-blur-sm"
                            }`}
                        >
                            <Globe className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                            PT. Smart{" "}
                            <span
                                className={`${
                                    scrolled ? "text-blue-600" : "text-blue-200"
                                }`}
                            >
                                CRM
                            </span>
                        </h1>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center">
                        <ul className="flex items-center space-x-1">
                            <li>
                                <Link
                                    href={route("welcome")}
                                    className={`px-3 py-2 rounded-md font-medium relative group transition-colors duration-300 ${
                                        isCurrentRoute("welcome")
                                            ? scrolled
                                                ? "text-blue-600"
                                                : "text-white bg-white/10"
                                            : scrolled
                                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                            : "text-white hover:text-blue-200 hover:bg-white/10"
                                    }`}
                                >
                                    Beranda
                                    {isCurrentRoute("welcome") && (
                                        <span className="absolute bottom-0 left-0 right-0 mx-auto w-10 h-0.5 bg-blue-600"></span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("about")}
                                    className={`px-3 py-2 rounded-md font-medium relative group transition-colors duration-300 ${
                                        isCurrentRoute("about")
                                            ? scrolled
                                                ? "text-blue-600"
                                                : "text-white bg-white/10"
                                            : scrolled
                                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                            : "text-white hover:text-blue-200 hover:bg-white/10"
                                    }`}
                                >
                                    Tentang Kami
                                    {isCurrentRoute("about") && (
                                        <span className="absolute bottom-0 left-0 right-0 mx-auto w-10 h-0.5 bg-blue-600"></span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("products")}
                                    className={`px-3 py-2 rounded-md font-medium relative group transition-colors duration-300 ${
                                        isCurrentRoute("products")
                                            ? scrolled
                                                ? "text-blue-600"
                                                : "text-white bg-white/10"
                                            : scrolled
                                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                            : "text-white hover:text-blue-200 hover:bg-white/10"
                                    }`}
                                >
                                    Produk Kami
                                    {isCurrentRoute("products") && (
                                        <span className="absolute bottom-0 left-0 right-0 mx-auto w-10 h-0.5 bg-blue-600"></span>
                                    )}
                                </Link>
                            </li>
                            <li>
                                {/* <Link
                                    href=""
                                    className={`px-3 py-2 rounded-md font-medium relative group transition-colors duration-300 ${
                                        isCurrentRoute("contact")
                                            ? scrolled
                                                ? "text-blue-600"
                                                : "text-white bg-white/10"
                                            : scrolled
                                            ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                            : "text-white hover:text-blue-200 hover:bg-white/10"
                                    }`}
                                >
                                    Kontak
                                    {isCurrentRoute("contact") && (
                                        <span className="absolute bottom-0 left-0 right-0 mx-auto w-10 h-0.5 bg-blue-600"></span>
                                    )}
                                </Link> */}
                            </li>
                        </ul>

                        {/* Search button */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={`ml-2 p-2 rounded-full transition-colors duration-200 ${
                                scrolled
                                    ? "text-gray-600 hover:bg-gray-100"
                                    : "text-white/80 hover:bg-white/10"
                            }`}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Search input (animated) */}
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "200px", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="ml-2 relative"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={`w-full py-1.5 pl-3 pr-8 rounded-md text-sm ${
                                            scrolled
                                                ? "bg-gray-100 text-gray-800 focus:bg-white"
                                                : "bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                        } outline-none transition-colors`}
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setSearchOpen(false)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        aria-label="Close search"
                                    >
                                        <X
                                            size={16}
                                            className={
                                                scrolled
                                                    ? "text-gray-500"
                                                    : "text-white/70"
                                            }
                                        />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Auth buttons or user profile */}
                        <div className="ml-6 flex items-center">
                            {auth?.user ? (
                                // Authenticated user - show profile dropdown
                                <div className="relative profile-dropdown-container">
                                    <div className="flex items-center">
                                        {/* Notification bell */}
                                        <button
                                            className={`p-2 rounded-full relative mr-2 transition-colors duration-200 ${
                                                scrolled
                                                    ? "text-gray-600 hover:bg-gray-100"
                                                    : "text-white/80 hover:bg-white/10"
                                            }`}
                                            aria-label="Notifications"
                                        >
                                            <Bell size={20} />
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        </button>

                                        {/* User avatar and dropdown trigger */}
                                        <button
                                            onClick={() =>
                                                setProfileDropdown(
                                                    !profileDropdown
                                                )
                                            }
                                            className="flex items-center focus:outline-none"
                                            aria-expanded={profileDropdown}
                                            aria-haspopup="true"
                                        >
                                            <div className="relative">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                                        scrolled
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-white/10 text-white"
                                                    }`}
                                                >
                                                    {auth.user.avatar ? (
                                                        <img
                                                            src={
                                                                auth.user
                                                                    .avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={auth.user.name}
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={20} />
                                                    )}
                                                </div>
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <span
                                                className={`ml-2 font-medium text-sm hidden sm:block ${
                                                    scrolled
                                                        ? "text-gray-700"
                                                        : "text-white"
                                                }`}
                                            >
                                                {auth.user.name.split(" ")[0]}
                                            </span>
                                            <ChevronDown
                                                size={16}
                                                className={`ml-1 transition-transform duration-200 ${
                                                    profileDropdown
                                                        ? "rotate-180"
                                                        : ""
                                                } ${
                                                    scrolled
                                                        ? "text-gray-500"
                                                        : "text-white/70"
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {profileDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {auth.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {auth.user.email}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={route("dashboard")}
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                >
                                                    <LayoutDashboard
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    href=""
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                >
                                                    <Settings
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Settings
                                                </Link>

                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                                    >
                                                        <LogOut
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Logout
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                // Guest user - show Register and Login links
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={route("register")}
                                        className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                                            scrolled
                                                ? "text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                                : "text-blue-100 hover:text-white border border-white/30 hover:border-white/60 hover:bg-white/10"
                                        }`}
                                    >
                                        Daftar
                                    </Link>
                                    <Link
                                        href={route("login")}
                                        className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                                            scrolled
                                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                                                : "bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white hover:text-blue-700 shadow-md hover:shadow-lg"
                                        }`}
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="flex items-center lg:hidden">
                        {/* Search button on mobile */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className={`p-2 mr-1 rounded-full transition-colors duration-200 ${
                                scrolled
                                    ? "text-gray-600 hover:bg-gray-100"
                                    : "text-white/80 hover:bg-white/10"
                            }`}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Notification bell on mobile (only for authenticated users) */}
                        {auth?.user && (
                            <button
                                className={`p-2 rounded-full relative mr-1 transition-colors duration-200 ${
                                    scrolled
                                        ? "text-gray-600 hover:bg-gray-100"
                                        : "text-white/80 hover:bg-white/10"
                                }`}
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        )}

                        {/* Menu toggle button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                                scrolled
                                    ? "text-blue-600 hover:bg-gray-100"
                                    : "text-white hover:bg-white/10"
                            }`}
                            aria-expanded={isOpen}
                            aria-label="Toggle menu"
                        >
                            <span className="sr-only">
                                {isOpen ? "Close menu" : "Open menu"}
                            </span>
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search input on mobile (animated) */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden border-t border-gray-200 bg-white"
                    >
                        <div className="container mx-auto px-4 py-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 text-gray-800 focus:bg-white border border-gray-200 outline-none transition-colors"
                                    autoFocus
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    aria-label="Close search"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile menu - Slide down animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-20"
                    >
                        <div className="container mx-auto px-4 py-4">
                            {/* User info for mobile (only if authenticated) */}
                            {auth?.user && (
                                <div className="flex items-center space-x-3 p-3 mb-3 bg-gray-50 rounded-lg">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            {auth.user.avatar ? (
                                                <img
                                                    src={
                                                        auth.user.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={auth.user.name}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href={route("welcome")}
                                        className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                                            isCurrentRoute("welcome")
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Beranda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("about")}
                                        className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                                            isCurrentRoute("about")
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Tentang Kami
                                    </Link>
                                </li>

                                <li>
                                    {/* <Link
                                        href=""
                                        className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200 ${
                                            isCurrentRoute("contact")
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Kontak
                                    </Link> */}
                                </li>
                            </ul>

                            {/* Auth links or user actions */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                {auth?.user ? (
                                    <div className="space-y-1">
                                        <Link
                                            href={route("dashboard")}
                                            className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LayoutDashboard
                                                size={18}
                                                className="mr-2"
                                            />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href=""
                                            className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Settings
                                                size={18}
                                                className="mr-2"
                                            />
                                            Settings
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center px-3 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <LogOut
                                                size={18}
                                                className="mr-2"
                                            />
                                            Logout
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link
                                            href={route("register")}
                                            className="w-full sm:w-auto text-center px-6 py-2 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Daftar
                                        </Link>
                                        <Link
                                            href={route("login")}
                                            className="w-full sm:w-auto text-center px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-300"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
