import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import DefaultUserImage from "./DefaultUserImage";

const Navbar: React.FC = () => {
    const scrollToSection = (sectionId: string, event: React.MouseEvent) => {
        event.preventDefault();
        if (isMenuOpen) toggleMenu();
        if (window.location.pathname === "/") {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.location.href = `/?section=${sectionId}`;
        }
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { auth } = usePage().props;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get("section");

        if (section) {
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.pathname
                    );
                }
            }, 500);
        }
    }, []);

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
                        src={
                            isScrolled ? "/images/logo.png" : "/images/logo.png"
                        }
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
                    <a
                        href="#layanan-section"
                        className={`text-[16px] font-medium hover:opacity-80 transition duration-300 ${
                            isScrolled
                                ? isActive("/layanan")
                                    ? "text-[#089BFF] font-bold"
                                    : "text-gray-700"
                                : "text-white"
                        }`}
                        onClick={(e) => scrollToSection("layanan-section", e)}
                    >
                        Layanan
                    </a>
                    {auth?.user ? (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center space-x-2 group"
                            >
                                <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200">
                                    <DefaultUserImage user={auth.user} />
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
                                        className="h-5 w-5 transition-transform duration-200 group-hover:rotate-180"
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
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-full overflow-hidden">
                                                <DefaultUserImage
                                                    user={auth.user}
                                                />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={route("dashboard")}
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={startLoading}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2.5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                            />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route("profile.index")}
                                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={startLoading}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2.5 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Profil Saya
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link
                                        href={route("logout")}
                                        as="button"
                                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Keluar
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
                        <a
                            href="#layanan-section"
                            className={`text-gray-800 text-lg py-3 border-b border-gray-100 ${
                                isActive("/features")
                                    ? "font-bold text-[#089BFF]"
                                    : ""
                            }`}
                            onClick={(e) =>
                                scrollToSection("layanan-section", e)
                            }
                        >
                            Layanan
                        </a>
                        {auth?.user ? (
                            <div className="border-t border-gray-100 pt-4 mt-2">
                                <div className="flex items-center mb-4 space-x-3">
                                    <div className="h-12 w-12 rounded-full overflow-hidden">
                                        <DefaultUserImage user={auth.user} />
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
                                    href={route("profile.index")}
                                    className="flex items-center text-gray-700 py-3 border-t border-gray-100"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2.5 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Profil Saya
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className="flex items-center text-gray-700 py-3 border-t border-gray-100"
                                    onClick={() => {
                                        toggleMenu();
                                        startLoading();
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2.5 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                        />
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("logout")}
                                    as="button"
                                    className="flex items-center w-full text-left text-red-600 py-3 border-t border-gray-100"
                                    onClick={() => toggleMenu()}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Keluar
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-3 mt-4">
                                <Link
                                    href={route("login")}
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
