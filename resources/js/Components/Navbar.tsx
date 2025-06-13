import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { auth } = usePage().props;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const startLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    const isActive = (path: string) => {
        return window.location.pathname === path;
    };

    return (
        <>
            <nav
                className={`flex items-center justify-between py-3 px-4 md:px-8 w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white shadow-md"
                        : "bg-gradient-to-r from-[#089BFF] to-[#0081d6]"
                }`}
            >
                <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => {
                        if (isMenuOpen) toggleMenu();
                        startLoading();
                    }}
                >
                    <img
                        alt="Logo of EconoMate"
                        className="transition-all duration-300"
                        src={isScrolled ? "/logo.png" : "/logo.png"}
                        width={150}
                        height={40}
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className={`text-[16px] font-medium hover:opacity-80 transition duration-300 ${
                            isScrolled
                                ? isActive("/")
                                    ? "text-[#089BFF] font-bold"
                                    : "text-gray-700"
                                : "text-white"
                        }`}
                        onClick={startLoading}
                    >
                        Home
                    </Link>
                    <Link
                        href="/features"
                        className={`text-[16px] font-medium hover:opacity-80 transition duration-300 ${
                            isScrolled
                                ? isActive("/features")
                                    ? "text-[#089BFF] font-bold"
                                    : "text-gray-700"
                                : "text-white"
                        }`}
                        onClick={startLoading}
                    >
                        Fitur
                    </Link>
                    <Link
                        href="/pricing"
                        className={`text-[16px] font-medium hover:opacity-80 transition duration-300 ${
                            isScrolled
                                ? isActive("/pricing")
                                    ? "text-[#089BFF] font-bold"
                                    : "text-gray-700"
                                : "text-white"
                        }`}
                        onClick={startLoading}
                    >
                        Harga
                    </Link>

                    {auth?.user ? (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-2"
                            >
                                <div
                                    className={`h-9 w-9 rounded-full flex items-center justify-center bg-blue-100 ${
                                        isScrolled
                                            ? "text-[#089BFF]"
                                            : "text-white bg-blue-500"
                                    }`}
                                >
                                    {auth.user.name?.charAt(0).toUpperCase() ||
                                        "U"}
                                </div>
                                <span
                                    className={
                                        isScrolled
                                            ? "text-gray-700"
                                            : "text-white"
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </button>

                            <Transition
                                show={isUserMenuOpen}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm text-gray-700">
                                            Signed in as
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={startLoading}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={startLoading}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </Transition>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`${
                                    isScrolled
                                        ? "text-[#089BFF] border border-[#089BFF] hover:bg-blue-50"
                                        : "text-white border border-white hover:bg-white hover:text-[#089BFF]"
                                } text-[15px] font-medium py-2 px-5 rounded-full transition duration-300`}
                                onClick={startLoading}
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className={`bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white text-[15px] font-semibold py-2 px-5 rounded-full hover:shadow-lg transition duration-300 ${
                                    isScrolled
                                        ? "hover:opacity-90"
                                        : "hover:bg-blue-600"
                                }`}
                                onClick={startLoading}
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className={isScrolled ? "text-[#089BFF]" : "text-white"}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <Transition
                    show={isMenuOpen}
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="flex flex-col space-y-4 p-6">
                        <Link
                            href="/"
                            className={`text-gray-800 text-lg py-3 border-b border-gray-100 ${
                                isActive("/") ? "font-bold text-[#089BFF]" : ""
                            }`}
                            onClick={() => {
                                toggleMenu();
                                startLoading();
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            href="/features"
                            className={`text-gray-800 text-lg py-3 border-b border-gray-100 ${
                                isActive("/features")
                                    ? "font-bold text-[#089BFF]"
                                    : ""
                            }`}
                            onClick={() => {
                                toggleMenu();
                                startLoading();
                            }}
                        >
                            Fitur
                        </Link>
                        <Link
                            href="/pricing"
                            className={`text-gray-800 text-lg py-3 border-b border-gray-100 ${
                                isActive("/pricing")
                                    ? "font-bold text-[#089BFF]"
                                    : ""
                            }`}
                            onClick={() => {
                                toggleMenu();
                                startLoading();
                            }}
                        >
                            Harga
                        </Link>

                        {auth?.user ? (
                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <div className="flex items-center mb-4 space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-medium">
                                        {auth.user.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="block text-gray-700 py-3 border-t border-gray-100"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block text-gray-700 py-3 border-t border-gray-100"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full text-left text-red-600 py-3 border-t border-gray-100"
                                    onClick={() => toggleMenu()}
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3 mt-4">
                                <Link
                                    href="/login"
                                    className="border border-[#089BFF] text-[#089BFF] py-3 px-4 rounded-lg text-center text-[16px]"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white text-[16px] font-semibold py-3 px-4 rounded-lg text-center"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </Transition>
            </nav>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#089BFF] to-[#0081d6] bg-opacity-95 z-50">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <img
                                alt="Logo EconoMate"
                                src="/logo.png"
                                width={180}
                                height={60}
                                className="animate-pulse"
                            />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </div>
                        <p className="text-white font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {/* Spacer to prevent content from being hidden under the navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;
