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
    Menu,
    PiggyBank,
    Divide,
    Receipt,
} from "lucide-react";
import DefaultUserImage from "@/Components/DefaultUserImage";
import { PageProps } from "@/types";

interface MenuItem {
    name: string;
    icon: React.ReactNode;
    route?: string;
    permission?: string;
    section?: string;
    children?: MenuItem[];
    badgeCount?: number;
}

interface SidebarProps {
    isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
    const { url, props } = usePage();
    const { auth } = props;
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const isActive = (path: string) => {
        if (!path) return false;
        const currentPath = url.split("?")[0];
        const routePath = path.split("?")[0];
        if (route("dashboard") === routePath) return currentPath === routePath;
        return currentPath.startsWith(routePath);
    };

    const menuItems: MenuItem[] = useMemo(
        () => [
            {
                section: "Dashboard",
                name: "Dashboard",
                icon: <Home size={18} />,
                route: route("dashboard"),
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
                        permission: "view-any-wallets",
                        route: route("wallets.index"),
                    },
                    {
                        name: "Dompet Saya",
                        icon: <Wallet size={16} />,
                        route: route("userWallets.index"),
                    },
                ],
            },
            {
                section: "Transaksi",
                name: "Transaksi",
                icon: <Receipt size={18} />,
                route: route("transactions.index"),
            },
            {
                section: "Split Bill",
                name: "Split Bill",
                icon: <Divide size={18} />,
                route: route("splitBills.index"),
            },
            {
                section: "Budget Plan",
                name: "Budget Plan",
                icon: <PiggyBank size={18} />,
                route: route("budgetPlans.index"),
            },
        ],
        []
    );

    useEffect(() => {
        const activeParent = menuItems.find((item) =>
            item.children?.some((child) => child.route && isActive(child.route))
        );
        if (activeParent) {
            setOpenSubmenu(activeParent.name);
        }
    }, [url]);

    const canViewMenuItem = (permission?: string) => {
        if (!permission) return true;
        return auth?.user?.permissions?.includes(permission) || false;
    };

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu((prev) => (prev === name ? null : name));
    };

    const groupedMenuItems = useMemo(() => {
        const groups: Record<string, MenuItem[]> = {};
        menuItems.forEach((item) => {
            const section = item.section || "Default";
            if (canViewMenuItem(item.permission)) {
                if (!groups[section]) groups[section] = [];
                groups[section].push(item);
            }
        });
        return Object.entries(groups).filter(([, items]) => items.length > 0);
    }, [auth?.user?.permissions]);

    const MenuItemComponent = ({ item }: { item: MenuItem }) => {
        const visibleChildren = item.children?.filter((child) =>
            canViewMenuItem(child.permission)
        );
        const hasChildren = visibleChildren && visibleChildren.length > 0;
        const isSubmenuOpen = openSubmenu === item.name;
        const isItemActive = hasChildren
            ? visibleChildren.some(
                  (child) => child.route && isActive(child.route)
              )
            : item.route
            ? isActive(item.route)
            : false;

        if (hasChildren && !visibleChildren.length) return null;

        const itemTextClasses = `transition-opacity duration-200 whitespace-nowrap ${
            isSidebarOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute"
        }`;

        return (
            <li className="mb-1">
                {hasChildren ? (
                    <div>
                        <button
                            onClick={() => toggleSubmenu(item.name)}
                            type="button"
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                                isItemActive
                                    ? "bg-white/15 text-white font-medium"
                                    : "text-white/90 hover:bg-white/10"
                            }`}
                        >
                            <div className="flex items-center overflow-hidden">
                                <span className="w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                                    {item.icon}
                                </span>
                                <span className={itemTextClasses}>
                                    {item.name}
                                </span>
                            </div>
                            <span className={itemTextClasses}>
                                {isSubmenuOpen ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </span>
                        </button>
                        <AnimatePresence>
                            {isSubmenuOpen && isSidebarOpen && (
                                <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-5 mt-1 overflow-hidden border-l border-white/20"
                                >
                                    {visibleChildren.map((child) => (
                                        <li
                                            key={child.name}
                                            className="my-1 pl-2"
                                        >
                                            <Link
                                                href={child.route || "#"}
                                                className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${
                                                    child.route &&
                                                    isActive(child.route)
                                                        ? "bg-white/10 text-white font-medium"
                                                        : "text-white/80 hover:bg-white/5"
                                                }`}
                                            >
                                                <span className="w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
                                                    {child.icon}
                                                </span>
                                                <span className="flex-1">
                                                    {child.name}
                                                </span>
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
                        className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                            isItemActive
                                ? "bg-white/15 text-white font-medium"
                                : "text-white/90 hover:bg-white/10"
                        }`}
                    >
                        <span className="w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                            {item.icon}
                        </span>
                        <span className={itemTextClasses}>{item.name}</span>
                    </Link>
                )}
            </li>
        );
    };

    const SidebarContent = () => (
        <motion.div
            initial={false}
            animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen flex flex-col bg-gradient-to-b from-[#089BFF] to-[#0470b8] shadow-lg overflow-hidden"
        >
            <div className="flex-shrink-0">
                <div className="flex p-4 h-16 items-center justify-center">
                    <Link href={route("dashboard")}>
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={isSidebarOpen ? "logo" : "icon"}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                alt={
                                    isSidebarOpen
                                        ? "EconoMate Logo"
                                        : "EconoMate Icon"
                                }
                                className="cursor-pointer"
                                src={
                                    isSidebarOpen
                                        ? "/images/logo.png"
                                        : "/images/icon.png"
                                }
                                style={{
                                    height: isSidebarOpen ? "auto" : "2rem",
                                    width: isSidebarOpen ? "10rem" : "auto",
                                }}
                            />
                        </AnimatePresence>
                    </Link>
                </div>
                <div className="px-4 py-3 border-y border-white/20">
                    <div
                        className={`flex items-center ${
                            !isSidebarOpen && "justify-center"
                        }`}
                    >
                        <Link
                            href={route("profile.index")}
                            className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0"
                        >
                            <DefaultUserImage user={auth.user} />
                        </Link>
                        <div
                            className={`ml-3 flex-grow overflow-hidden transition-all duration-300 ${
                                isSidebarOpen
                                    ? "opacity-100 max-w-full"
                                    : "opacity-0 max-w-0"
                            }`}
                        >
                            <p className="text-white font-medium text-sm truncate">
                                {auth.user.name}
                            </p>
                            <p className="text-white/70 text-xs truncate">
                                {auth.user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
                {groupedMenuItems.map(([section, items]) => (
                    <div key={section} className="mb-2">
                        {isSidebarOpen && (
                            <h2 className="px-3 mb-2 mt-4 text-xs uppercase font-bold text-white/60 tracking-wider">
                                {section}
                            </h2>
                        )}
                        <ul className="space-y-1">
                            {items.map((item) => (
                                <MenuItemComponent
                                    key={item.name}
                                    item={item}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className={`p-4 border-t border-white/20 flex-shrink-0`}>
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className={`flex items-center justify-center w-full py-2 px-4 bg-red-600/90 hover:bg-red-700 text-white rounded-md transition-colors`}
                >
                    <LogOut
                        size={16}
                        className={isSidebarOpen ? "mr-2" : "mr-0"}
                    />
                    <span
                        className={`font-medium text-sm whitespace-nowrap ${
                            isSidebarOpen
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                        }`}
                    >
                        Keluar
                    </span>
                </Link>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
                >
                    <Menu size={24} />
                </button>
                <AnimatePresence>
                    {isMobileSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "tween", duration: 0.3 }}
                                className="fixed inset-y-0 left-0 z-40"
                            >
                                <SidebarContent />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-black/50 z-30"
                                onClick={() => setIsMobileSidebarOpen(false)}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
            <div className="hidden lg:block flex-shrink-0">
                <SidebarContent />
            </div>
        </>
    );
};

export default Sidebar;
