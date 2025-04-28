import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    User,
    Settings,
    LogOut,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageProps } from "@/types";

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    sidebarExpanded: boolean;
    toggleSidebar: () => void;
}

const Header = ({
    sidebarOpen,
    setSidebarOpen,
    sidebarExpanded,
    toggleSidebar,
}: HeaderProps) => {
    const { auth } = usePage<PageProps>().props;
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Close dropdowns when clicking outside using useEffect
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".profile-dropdown-container")) {
                setProfileDropdown(false);
            }
            if (!target.closest(".notifications-container")) {
                setNotificationsOpen(false);
            }
        };

        // Close dropdowns when pressing escape
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setProfileDropdown(false);
                setNotificationsOpen(false);
                setSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 h-16">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    {/* Mobile menu button */}
                    <button
                        className="sidebar-toggle lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Desktop sidebar toggle */}
                    <button
                        className="hidden lg:flex p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 items-center"
                        onClick={toggleSidebar}
                        aria-label={
                            sidebarExpanded
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }
                    >
                        {sidebarExpanded ? (
                            <ChevronLeft className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center ml-4">
                        <Link
                            href={route("dashboard")}
                            className="flex items-center group"
                        >
                            <div className="rounded-full p-1 bg-blue-600 text-white">
                                <Settings className="h-5 w-5" />
                            </div>
                            <span className="ml-2 text-lg font-semibold hidden sm:block group-hover:text-blue-600 transition-colors">
                                PT SMART CRM
                            </span>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="hidden md:ml-6 md:flex md:items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    {/* Mobile search button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="notifications-container relative">
                        <button
                            onClick={() =>
                                setNotificationsOpen(!notificationsOpen)
                            }
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>

                        {/* Notifications dropdown */}
                        <AnimatePresence>
                            {notificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                >
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                Notifications
                                            </h3>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {[1, 2, 3].map((item) => (
                                                <a
                                                    key={item}
                                                    href="#"
                                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <Bell
                                                                    size={14}
                                                                    className="text-blue-600"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                New message
                                                                received
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                John Doe sent
                                                                you a message
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                2 hours ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100 text-center">
                                            <a
                                                href="#"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                            >
                                                View all notifications
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile dropdown */}
                    <div className="profile-dropdown-container relative">
                        <button
                            onClick={() => setProfileDropdown(!profileDropdown)}
                            className="flex items-center space-x-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-expanded={profileDropdown}
                            aria-haspopup="true"
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                                    <User size={16} />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="hidden md:flex md:items-center">
                                <span className="text-sm font-medium text-gray-700 mr-1">
                                    {auth.user?.name || "User"}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${
                                        profileDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </div>
                        </button>

                        {/* Profile dropdown menu */}
                        <AnimatePresence>
                            {profileDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                >
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {auth.user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {auth.user?.email ||
                                                    "user@example.com"}
                                            </p>
                                        </div>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <User
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                <span>Your Profile</span>
                                            </div>
                                        </Link>
                                        {auth.user?.is_admin && (
                                            <Link
                                                href={route("settings")}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex items-center">
                                                    <Settings
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    <span>Settings</span>
                                                </div>
                                            </Link>
                                        )}
                                        <Link
                                            href={route("support")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <div className="flex items-center">
                                                <HelpCircle
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                <span>Help & Support</span>
                                            </div>
                                        </Link>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <Link
                                                as="button"
                                                method="post"
                                                href={route("logout")}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <div className="flex items-center">
                                                    <LogOut
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    <span>Logout</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Mobile search input (animated) */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 z-20 md:hidden"
                    >
                        <div className="p-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search
                                        size={16}
                                        className="text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
