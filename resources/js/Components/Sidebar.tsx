"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    FileText,
    User,
    LogOut,
    ChevronRight,
    ChevronDown,
    Briefcase,
    Shield,
    Package,
    FolderClosed,
    Receipt,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarItem from "./SidebarItem";
import { PageProps } from "@/types";

interface SidebarProps {
    expanded: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ expanded, toggleSidebar }) => {
    const { auth } = usePage<PageProps>().props;
    const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({});

    // Toggle submenu
    const toggleSubmenu = (key: string) => {
        setSubmenuOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Function to check if user has the required permission(s)
    const hasPermission = (permission: string | string[]) => {
        if (!auth?.user.permissions) return false;

        if (Array.isArray(permission)) {
            return permission.some((perm) =>
                auth.user.permissions.includes(perm)
            );
        }

        return auth.user.permissions.includes(permission);
    };

    const hasRole = (roles: string[]) => {
        if (!auth?.user.roles) return false;

        // Check if roles is an array in the user object
        if (Array.isArray(auth.user.roles)) {
            // If roles is an array, check if any of the required roles are included
            return roles.some((role) => auth.user.roles.includes(role));
        }
        // If roles is a string (single role), check if it's in the required roles
        else if (typeof auth.user.roles === "string") {
            return roles.includes(auth.user.roles);
        }

        // If roles has an unexpected format, return false
        return false;
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: expanded ? "280px" : "80px",
                transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="hidden lg:flex flex-col h-full bg-white border-r border-gray-100 shadow-sm overflow-y-auto overflow-x-hidden"
        >
            <div className="flex-1 py-6 px-4">
                {/* User profile section */}
                {auth?.user && (
                    <div className={`mb-8 ${expanded ? "" : "text-center"}`}>
                        <div
                            className={`flex ${
                                expanded
                                    ? "items-center justify-between"
                                    : "flex-col items-center"
                            } ${!expanded && "space-y-2"}`}
                        >
                            <div
                                className={`flex ${
                                    expanded
                                        ? "items-center"
                                        : "flex-col items-center"
                                } ${expanded ? "space-x-3" : "space-y-2"}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                        {auth.user.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {expanded && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{
                                                opacity: 1,
                                                width: "auto",
                                            }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="min-w-0 flex-1 overflow-hidden"
                                        >
                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                {auth.user.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {auth.user.email}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Toggle button - now using the passed toggleSidebar function */}
                            <button
                                onClick={toggleSidebar}
                                className={`h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${
                                    !expanded && "mt-3"
                                }`}
                                aria-label={
                                    expanded
                                        ? "Collapse sidebar"
                                        : "Expand sidebar"
                                }
                            >
                                <ChevronRight
                                    size={18}
                                    className={`transition-transform duration-300 ${
                                        expanded ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Navigation */}
                <div className={expanded ? "mb-4" : "flex justify-center mb-4"}>
                    <h3
                        className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                            expanded ? "" : "sr-only"
                        }`}
                    >
                        Main
                    </h3>
                </div>

                <div className="space-y-1">
                    {hasPermission("view-dashboard") && (
                        <SidebarItem
                            icon={<LayoutDashboard size={expanded ? 18 : 20} />}
                            title="Dashboard"
                            href={route("dashboard")}
                            isActive={route().current("dashboard")}
                            expanded={expanded}
                            permissions="view-dashboard"
                        />
                    )}
                    {hasPermission("view-categories") && (
                        <SidebarItem
                            icon={<FolderClosed size={expanded ? 18 : 20} />}
                            title="Categories"
                            href={route("categories.index")}
                            isActive={route().current("categories.index")}
                            expanded={expanded}
                            permissions="categories-index"
                        />
                    )}

                    {hasPermission("view-products") && (
                        <SidebarItem
                            icon={<Package size={expanded ? 18 : 20} />}
                            title="Products"
                            href={route("products.index")}
                            isActive={route().current("products.index")}
                            expanded={expanded}
                            permissions="view-products"
                        />
                    )}

                    {hasPermission("view-offers") && (
                        <SidebarItem
                            icon={<FileText size={expanded ? 18 : 20} />}
                            title="Offers"
                            href={route("offers.index")}
                            isActive={route().current("offers.index")}
                            expanded={expanded}
                            permissions="view-offers"
                        />
                    )}

                    {hasPermission("view-subscriptions") && (
                        <SidebarItem
                            icon={<Receipt size={expanded ? 18 : 20} />}
                            title="Subscriptions"
                            href={route("subscriptions.index")}
                            isActive={route().current("subscriptions.index")}
                            expanded={expanded}
                            permissions="view-subscriptions"
                        />
                    )}
                </div>

                {/* Reports Section */}
                {hasRole(["admin", "manager", "sales"]) && (
                    <>
                        <div
                            className={`mt-8 ${
                                expanded ? "mb-4" : "flex justify-center mb-4"
                            }`}
                        >
                            <h3
                                className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                                    expanded ? "" : "sr-only"
                                }`}
                            >
                                Users
                            </h3>
                        </div>

                        <div className="space-y-1">
                            {expanded ? (
                                <div>
                                    {hasPermission("view-users") && (
                                        <button
                                            onClick={() =>
                                                toggleSubmenu("users")
                                            }
                                            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                                submenuOpen.users
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <Users
                                                    size={18}
                                                    className="mr-3"
                                                />
                                                <span>Users</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${
                                                    submenuOpen.users
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                    )}

                                    <AnimatePresence initial={false}>
                                        {submenuOpen.users && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: "auto",
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="ml-6 pl-3 border-l border-gray-200 space-y-1 mt-1"
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
                                                    >
                                                        <Briefcase
                                                            size={16}
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
                                                    >
                                                        <Shield
                                                            size={16}
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
                                                    >
                                                        <User
                                                            size={16}
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
                                                    >
                                                        <Users
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        <span>Customers</span>
                                                    </Link>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                hasPermission("view-users") && (
                                    <SidebarItem
                                        icon={<Users size={20} />}
                                        title="Users"
                                        href={route("sales.index")}
                                        isActive={
                                            route().current("sales.index") ||
                                            route().current("sales.index") ||
                                            route().current("managers.index") ||
                                            route().current("leads.index") ||
                                            route().current("customers.index")
                                        }
                                        expanded={expanded}
                                        permissions="view-users"
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Logout section - always visible */}
            <div className="mt-auto border-t border-gray-100 py-4 px-4">
                <Link
                    as="button"
                    method="post"
                    href={route("logout")}
                    className={`flex items-center ${
                        expanded
                            ? "px-3 py-2.5 rounded-lg w-full justify-start"
                            : "mx-auto rounded-full p-2.5 justify-center"
                    } text-red-600 hover:bg-red-50 transition-colors duration-200`}
                >
                    <LogOut
                        size={expanded ? 18 : 20}
                        className={expanded ? "mr-3 text-red-500" : ""}
                    />
                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
