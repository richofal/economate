import React, { useState, useEffect, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Wallet,
    Users,
    ChevronDown,
    ChevronUp,
    LogOut,
    User,
    Menu,
    X,
} from "lucide-react";
import DefaultUserImage from "@/Components/DefaultUserImage";
interface MenuItem {
    name: string;
    icon: React.ReactNode;
    route?: string;
    permission?: string;
    section?: string;
    children?: MenuItem[];
    badgeCount?: number;
}

const Sidebar = () => {
    const { url, props } = usePage();
    const { auth } = props;
    const [showLogout, setShowLogout] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        if (!path) return false;
        if (route("dashboard") === path) {
            return url === path;
        }
        return url.startsWith(path.split("?")[0]);
    };

    // Menu item definitions with Lucide icons
    const menuItems: MenuItem[] = useMemo(
        () => [
            {
                section: "Dashboard",
                name: "Dashboard",
                icon: <Home size={18} />,
                route: route("dashboard"),
                permission: "view-dashboard",
                
            },
            {
                section: "Manajemen",
                name: "Pengguna",
                icon: <Users size={18} />,
                permission: "view-any-users",
                children: [
                    {
                        name: "Daftar Pengguna",
                        icon: <Users size={16} />,
                        route: route("users.index"),
                        permission: "view-any-users",
                    },
                ],
            },
            {
                section: "Keuangan",
                name: "Dompet",
                icon: <Wallet size={18} />,
                children: [
                    {
                        name: "Dompet Sistem",
                        icon: <Wallet size={16} />,
                        route: route("wallets.index"),
                        permission: "view-any-wallets",
                    },
                    {
                        name: "Dompet Saya",
                        icon: <Wallet size={16} />,
                        route: route("userWallets.index"),
                        permission: "view-any-user-wallets",
                    },
                ],
            },
        ],
        [url]
    );
    useEffect(() => {
        const activeParent = menuItems.find((item) =>
            item.children?.some((child) => child.route && isActive(child.route))
        );
        if (activeParent) {
            setOpenSubmenu(activeParent.name);
        }
    }, [url, menuItems]);
    const canViewMenuItem = (permission?: string) => {
        if (!permission) return true;
        return auth?.user?.permissions?.includes(permission) || false;
    };
    const toggleSubmenu = (name: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when toggling submenu
        setOpenSubmenu(openSubmenu === name ? null : name);
    };
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Group menu items by section
    const groupedMenuItems = useMemo(() => {
        const groups: Record<string, MenuItem[]> = {};

        menuItems.forEach((item) => {
            const section = item.section || "";
            if (!groups[section]) {
                groups[section] = [];
            }
            if (canViewMenuItem(item.permission)) {
                groups[section].push(item);
            }
        });

        // Filter out empty sections
        return Object.fromEntries(
            Object.entries(groups).filter(([_, items]) => items.length > 0)
        );
    }, [menuItems, auth?.user?.permissions]);

    // Menu item component
    const MenuItem = ({ item }: { item: MenuItem }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isSubmenuOpen = openSubmenu === item.name;
        const isItemActive = item.route
            ? isActive(item.route)
            : item.children?.some(
                  (child) => child.route && isActive(child.route)
              ) || false;

        // Filter out children based on permissions
        const visibleChildren = item.children?.filter((child) =>
            canViewMenuItem(child.permission)
        );

        // Don't render if no visible children
        if (hasChildren && (!visibleChildren || visibleChildren.length === 0)) {
            return null;
        }

        return (
            <li className="mb-1">
                {hasChildren ? (
                    <div className="mb-1">
                        {/* Use div instead of button to prevent form submission */}
                        <div
                            onClick={(e) => toggleSubmenu(item.name, e)}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200 cursor-pointer ${
                                isItemActive
                                    ? "bg-white/15 text-yellow-200 font-medium"
                                    : "text-white hover:bg-white/10"
                            }`}
                        >
                            <div className="flex items-center">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </div>
                            <span className="flex-shrink-0">
                                {isSubmenuOpen ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </span>
                        </div>

                        <AnimatePresence>
                            {isSubmenuOpen &&
                                visibleChildren &&
                                visibleChildren.length > 0 && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-4 mt-1 overflow-hidden border-l border-white/20"
                                    >
                                        {visibleChildren.map((child) => (
                                            <li
                                                key={child.name}
                                                className="my-1 pl-2"
                                            >
                                                <Link
                                                    href={child.route || "#"}
                                                    className={`flex items-center py-2 px-3 rounded-md transition-all text-sm ${
                                                        child.route &&
                                                        isActive(child.route)
                                                            ? "bg-white/10 text-yellow-200 font-medium"
                                                            : "text-white/90 hover:bg-white/5 hover:text-white"
                                                    }`}
                                                    preserveScroll
                                                >
                                                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center mr-2">
                                                        {child.icon}
                                                    </span>
                                                    <span>{child.name}</span>
                                                    {child.badgeCount && (
                                                        <span className="ml-auto bg-yellow-500 text-xs font-medium text-white px-1.5 py-0.5 rounded-full">
                                                            {child.badgeCount}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Link
                        href={item.route || "#"}
                        className={`flex items-center py-2 px-3 rounded-md transition-all duration-200 ${
                            item.route && isActive(item.route)
                                ? "bg-white/15 text-yellow-200 font-medium"
                                : "text-white hover:bg-white/10"
                        }`}
                        preserveScroll
                    >
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
                            {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {item.badgeCount && (
                            <span className="ml-auto bg-yellow-500 text-xs font-medium text-white px-1.5 py-0.5 rounded-full">
                                {item.badgeCount}
                            </span>
                        )}
                    </Link>
                )}
            </li>
        );
    };

    // Mobile menu toggle
    const MobileMenuToggle = () => (
        <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
            aria-label="Toggle menu"
        >
            {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );

    // Main sidebar component
    return (
        <>
            <MobileMenuToggle />

            <aside
                className={`fixed inset-y-0 left-0 z-40 transform lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative
                    ${
                        isMobileSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                    lg:block w-64 bg-gradient-to-b from-[#089BFF] to-[#0470b8] h-screen flex flex-col shadow-lg`}
            >
                {/* Logo */}
                <div className="flex justify-center p-4 mb-2 flex-shrink-0">
                    <Link href={route("dashboard")} preserveScroll>
                        <img
                            alt="EconoMate Logo"
                            className="cursor-pointer w-[160px] h-auto transition-transform hover:scale-105"
                            src="/images/logo.png"
                        />
                    </Link>
                </div>

                {/* Navigation Menu - Now a fixed height with scroll */}
                <nav className="flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar">
                    {Object.entries(groupedMenuItems).map(
                        ([section, items]) => (
                            <div key={section || "default"} className="mb-6">
                                {section && (
                                    <h2 className="flex items-center text-sm uppercase tracking-wider font-bold text-white/70 px-3 mb-2">
                                        {section}
                                    </h2>
                                )}
                                <ul className="space-y-1">
                                    {items.map((item) => (
                                        <MenuItem key={item.name} item={item} />
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </nav>

                <div className="px-4 pb-4 pt-2 border-t border-white/20 flex-shrink-0">
                    <div
                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setShowLogout(!showLogout)}
                    >
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                            {auth?.user?.image ? (
                                <img
                                    src={auth.user.image}
                                    alt={auth.user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <DefaultUserImage
                                    name={auth?.user?.name || "User"}
                                />
                            )}
                        </div>
                        <div className="ml-3 flex-grow overflow-hidden">
                            <p className="text-white font-medium text-sm truncate">
                                {auth?.user?.name || "User"}
                            </p>
                            <p className="text-white/70 text-xs truncate">
                                {auth?.user?.email || "user@example.com"}
                            </p>
                        </div>
                        {showLogout ? (
                            <ChevronUp className="h-4 w-4 text-white/70" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-white/70" />
                        )}
                    </div>

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
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                    preserveScroll
                                >
                                    <User size={16} className="mr-2" />
                                    <span>Profil</span>
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors border-t border-gray-100"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    <span>Keluar</span>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </aside>

            {/* Backdrop overlay for mobile */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
