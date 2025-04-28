"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    User,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    ChevronRight,
    Package,
    FolderClosed,
    Shield,
    Briefcase,
    Receipt,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import type { PageProps } from "@/types";

interface MobileSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

interface SubmenuState {
    [key: string]: boolean;
}

const MobileSidebar = ({ isOpen, setIsOpen }: MobileSidebarProps) => {
    const { auth } = usePage<PageProps>().props;
    const [submenus, setSubmenus] = useState<SubmenuState>({
        analytics: false,
        settings: false,
        users: false,
    });

    // Toggle submenu
    const toggleSubmenu = (key: string) => {
        setSubmenus((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Close sidebar when a link is clicked
    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Function to check if user has the required permission(s)
    const hasPermission = (permission: string | string[]) => {
        if (!auth?.user?.permissions) return false;

        if (Array.isArray(permission)) {
            return permission.some((perm) =>
                auth.user.permissions.includes(perm)
            );
        }

        return auth.user.permissions.includes(permission);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-30 lg:hidden overflow-y-auto mobile-sidebar"
                    aria-label="Mobile navigation"
                >
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md w-9 h-9 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    BIMO
                                </span>
                            </div>
                            <span className="ml-2 text-lg font-semibold">
                                BIMO CRM
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User profile section */}
                    <div className="px-4 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                                    <User size={20} />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {auth?.user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                    {auth?.user?.email || "user@example.com"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 px-3 space-y-1">
                        {/* Main navigation */}
                        <div className="px-3 mb-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Main
                            </h3>
                        </div>

                        {hasPermission("view-dashboard") && (
                            <Link
                                href={route("dashboard")}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    route().current("dashboard")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                                onClick={handleLinkClick}
                            >
                                <LayoutDashboard size={18} className="mr-3" />
                                <span>Dashboard</span>
                            </Link>
                        )}

                        {hasPermission("view-categories") && (
                            <Link
                                href={route("categories.index")}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    route().current("categories.index")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                                onClick={handleLinkClick}
                            >
                                <FolderClosed size={18} className="mr-3" />
                                <span>Categories</span>
                            </Link>
                        )}

                        {hasPermission("view-products") && (
                            <Link
                                href={route("products.index")}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    route().current("products.index")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                                onClick={handleLinkClick}
                            >
                                <Package size={18} className="mr-3" />
                                <span>Products</span>
                            </Link>
                        )}

                        {hasPermission("view-offers") && (
                            <Link
                                href={route("offers.index")}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    route().current("offers.index")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                                onClick={handleLinkClick}
                            >
                                <FileText size={18} className="mr-3" />
                                <span>Offers</span>
                            </Link>
                        )}

                        {hasPermission("view-subscriptions") && (
                            <Link
                                href={route("subscriptions.index")}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                    route().current("subscriptions.index")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                                onClick={handleLinkClick}
                            >
                                <Receipt size={18} className="mr-3" />
                                <span>Subscriptions</span>
                            </Link>
                        )}

                        {/* Users section */}
                        {hasPermission("view-users") && (
                            <>
                                <div className="mt-8 px-3 mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Users
                                    </h3>
                                </div>

                                {/* Users with submenu */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSubmenu("users")}
                                        className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            submenus.users
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                        aria-expanded={submenus.users}
                                    >
                                        <div className="flex items-center">
                                            <Users size={18} className="mr-3" />
                                            <span>Users</span>
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${
                                                submenus.users
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Submenu items */}
                                    <AnimatePresence>
                                        {submenus.users && (
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
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                className="ml-6 pl-3 border-l border-gray-200 space-y-1"
                                            >
                                                {hasPermission(
                                                    "view-sales"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "sales.index"
                                                        )}
                                                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                            route().current(
                                                                "sales.index"
                                                            )
                                                                ? "text-blue-700 bg-blue-50"
                                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        }`}
                                                        onClick={
                                                            handleLinkClick
                                                        }
                                                    >
                                                        <Briefcase
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                        <span>Sales</span>
                                                    </Link>
                                                )}

                                                {hasPermission(
                                                    "view-managers"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "managers.index"
                                                        )}
                                                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                            route().current(
                                                                "managers.index"
                                                            )
                                                                ? "text-blue-700 bg-blue-50"
                                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        }`}
                                                        onClick={
                                                            handleLinkClick
                                                        }
                                                    >
                                                        <Shield
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                        <span>Managers</span>
                                                    </Link>
                                                )}

                                                {hasPermission(
                                                    "view-leads"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "leads.index"
                                                        )}
                                                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                            route().current(
                                                                "leads.index"
                                                            )
                                                                ? "text-blue-700 bg-blue-50"
                                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        }`}
                                                        onClick={
                                                            handleLinkClick
                                                        }
                                                    >
                                                        <User
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                        <span>Leads</span>
                                                    </Link>
                                                )}

                                                {hasPermission(
                                                    "view-customers"
                                                ) && (
                                                    <Link
                                                        href={route(
                                                            "customers.index"
                                                        )}
                                                        className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                            route().current(
                                                                "customers.index"
                                                            )
                                                                ? "text-blue-700 bg-blue-50"
                                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        }`}
                                                        onClick={
                                                            handleLinkClick
                                                        }
                                                    >
                                                        <Users
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                        <span>Customers</span>
                                                    </Link>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}

                        {/* Reports section */}
                        {hasPermission([
                            "view_analytics",
                            "view_sales_reports",
                            "view_customer_activity",
                            "view_team_performance",
                        ]) && (
                            <>
                                <div className="mt-8 px-3 mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Reports
                                    </h3>
                                </div>

                                {/* Analytics with submenu */}
                                {hasPermission("view_analytics") && (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() =>
                                                toggleSubmenu("analytics")
                                            }
                                            className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                submenus.analytics
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                            aria-expanded={submenus.analytics}
                                        >
                                            <div className="flex items-center">
                                                <BarChart3
                                                    size={18}
                                                    className="mr-3"
                                                />
                                                <span>Analytics</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${
                                                    submenus.analytics
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Submenu items */}
                                        <AnimatePresence>
                                            {submenus.analytics && (
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
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="ml-6 pl-3 border-l border-gray-200 space-y-1"
                                                >
                                                    {hasPermission(
                                                        "view_sales_reports"
                                                    ) && (
                                                        <Link
                                                            href={route(
                                                                "analytics.sales"
                                                            )}
                                                            className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                                route().current(
                                                                    "analytics.sales"
                                                                )
                                                                    ? "text-blue-700 bg-blue-50"
                                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                            }`}
                                                            onClick={
                                                                handleLinkClick
                                                            }
                                                        >
                                                            <ChevronRight
                                                                size={14}
                                                                className="mr-2"
                                                            />
                                                            <span>
                                                                Sales Reports
                                                            </span>
                                                        </Link>
                                                    )}

                                                    {hasPermission(
                                                        "view_customer_activity"
                                                    ) && (
                                                        <Link
                                                            href={route(
                                                                "analytics.customers"
                                                            )}
                                                            className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                                route().current(
                                                                    "analytics.customers"
                                                                )
                                                                    ? "text-blue-700 bg-blue-50"
                                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                            }`}
                                                            onClick={
                                                                handleLinkClick
                                                            }
                                                        >
                                                            <ChevronRight
                                                                size={14}
                                                                className="mr-2"
                                                            />
                                                            <span>
                                                                Customer
                                                                Activity
                                                            </span>
                                                        </Link>
                                                    )}

                                                    {hasPermission(
                                                        "view_team_performance"
                                                    ) && (
                                                        <Link
                                                            href={route(
                                                                "analytics.team"
                                                            )}
                                                            className={`flex items-center px-3 py-2 text-sm rounded-md ${
                                                                route().current(
                                                                    "analytics.team"
                                                                )
                                                                    ? "text-blue-700 bg-blue-50"
                                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                            }`}
                                                            onClick={
                                                                handleLinkClick
                                                            }
                                                        >
                                                            <ChevronRight
                                                                size={14}
                                                                className="mr-2"
                                                            />
                                                            <span>
                                                                Team Performance
                                                            </span>
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Settings section */}
                        {hasPermission([
                            "view_profile",
                            "view_settings",
                            "view_permissions",
                            "view_support",
                        ]) && (
                            <>
                                <div className="mt-8 px-3 mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Settings
                                    </h3>
                                </div>

                                {hasPermission("view_profile") && (
                                    <Link
                                        href={route("profile.edit")}
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            route().current("profile.edit")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <User size={18} className="mr-3" />
                                        <span>Account</span>
                                    </Link>
                                )}

                                {hasPermission("view_settings") && (
                                    <Link
                                        href={route("settings")}
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            route().current("settings")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <Settings size={18} className="mr-3" />
                                        <span>System Settings</span>
                                    </Link>
                                )}

                                {hasPermission("view_permissions") && (
                                    <Link
                                        href={route("permissions")}
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            route().current("permissions")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <Shield size={18} className="mr-3" />
                                        <span>Permissions</span>
                                    </Link>
                                )}

                                {hasPermission("view_support") && (
                                    <Link
                                        href={route("support")}
                                        className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            route().current("support")
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                        onClick={handleLinkClick}
                                    >
                                        <HelpCircle
                                            size={18}
                                            className="mr-3"
                                        />
                                        <span>Help & Support</span>
                                    </Link>
                                )}
                            </>
                        )}

                        {/* Logout button */}
                        <div className="mt-8 border-t border-gray-200 pt-4">
                            <Link
                                as="button"
                                method="post"
                                href={route("logout")}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full"
                                onClick={handleLinkClick}
                            >
                                <LogOut
                                    size={18}
                                    className="mr-3 text-red-500"
                                />
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;
