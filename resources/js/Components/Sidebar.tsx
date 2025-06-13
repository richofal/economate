import React, { useState, useEffect, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

// Interface definitions
interface MenuItem {
    name: string;
    icon: string; // FontAwesome icon class
    route?: string;
    active?: boolean;
    permission?: string;
    section?: string;
    children?: MenuItem[];
}

const Sidebar = () => {
    const { url, props } = usePage();
    const { auth } = props;
    const [showLogout, setShowLogout] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Menu item definitions
    const menuItems: MenuItem[] = useMemo(
        () => [
            {
                section: "Dashboard",
                name: "Dompet",
                icon: "fas fa-wallet",
                route: route("dashboard"),
                active: url === route("dashboard"),
                permission: "view-dashboard",
            },
        ],
        [url]
    );

    // Function to check if a menu item should be visible
    const canViewMenuItem = (permission?: string) => {
        if (!permission) return true;
        return true; // For now, allow all - implement actual permission check later
    };

    // Toggle submenu function
    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    // Group menu items by section
    const groupedMenuItems = useMemo(() => {
        const groups: Record<string, MenuItem[]> = {};

        menuItems.forEach((item) => {
            const section = item.section || "";
            if (!groups[section]) {
                groups[section] = [];
            }
            groups[section].push(item);
        });

        return groups;
    }, [menuItems]);

    return (
        <div className="w-64 bg-gradient-to-b from-[#089BFF] to-[#0470b8] p-4 h-full flex flex-col shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <Link href={route("dashboard")}>
                    <img
                        alt="EconoMate Logo"
                        className="cursor-pointer w-[180px] h-auto"
                        src="/images/logo.png"
                    />
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow overflow-y-auto">
                {Object.entries(groupedMenuItems).map(([section, items]) => (
                    <div key={section || "default"} className="mb-6">
                        {section && (
                            <h2 className="flex items-center text-xl font-semibold text-white mb-4">
                                {section}
                            </h2>
                        )}
                        <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {items
                                .filter((item) =>
                                    canViewMenuItem(item.permission)
                                )
                                .map((item, index) => (
                                    <motion.li
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="mb-4"
                                    >
                                        <Link
                                            href={item.route || "#"}
                                            className={`flex items-center py-2 px-3 rounded-md transition-all duration-200 ${
                                                item.active
                                                    ? "bg-white/10 text-yellow-300 font-medium"
                                                    : "text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <i
                                                className={`${item.icon} mr-3`}
                                            ></i>
                                            <span>{item.name}</span>
                                        </Link>

                                        {item.children && (
                                            <AnimatePresence>
                                                {openSubmenu === item.name && (
                                                    <motion.ul
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: "auto",
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        className="ml-8 mt-1 overflow-hidden"
                                                    >
                                                        {item.children.map(
                                                            (child) => (
                                                                <li
                                                                    key={
                                                                        child.name
                                                                    }
                                                                    className="my-1"
                                                                >
                                                                    <Link
                                                                        href={
                                                                            child.route ||
                                                                            "#"
                                                                        }
                                                                        className={`flex items-center py-1.5 text-sm ${
                                                                            child.active
                                                                                ? "text-yellow-300 font-medium"
                                                                                : "text-white/80 hover:text-white"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            child.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </motion.li>
                                ))}
                        </motion.ul>
                    </div>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="mt-auto pt-4 border-t border-white/20">
                <div
                    className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setShowLogout(!showLogout)}
                >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                        {auth?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="ml-3 flex-grow">
                        <p className="text-white font-medium">
                            {auth?.user?.name || "User"}
                        </p>
                        <p className="text-white/70 text-xs">
                            {auth?.user?.email || "user@example.com"}
                        </p>
                    </div>
                    <i
                        className={`fas ${
                            showLogout ? "fa-chevron-up" : "fa-chevron-down"
                        } text-white/70`}
                    ></i>
                </div>

                {/* Logout dropdown */}
                <AnimatePresence>
                    {showLogout && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <Link
                                href=""
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <i className="fas fa-user mr-2"></i>
                                Profil
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors border-t border-gray-100"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                Keluar
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Sidebar;
