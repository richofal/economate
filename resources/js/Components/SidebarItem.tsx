import React from "react";
import { Link } from "@inertiajs/react";

interface SidebarItemProps {
    icon: React.ReactNode;
    title: string;
    href: string;
    isActive: boolean;
    hasSubmenu?: boolean;
    expanded?: boolean;
    children?: React.ReactNode;
    permissions?: string | string[]; // New parameter for permissions
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    title,
    href,
    isActive,
    hasSubmenu = false,
    expanded = true,
    children,
    permissions,
}) => {
    return (
        <div className="relative">
            <Link
                href={href}
                className={`${
                    isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } flex items-center ${
                    expanded
                        ? "px-3 py-2 rounded-lg"
                        : "mx-auto p-2 rounded-full"
                } transition-colors duration-200`}
            >
                <span
                    className={`${
                        isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                >
                    {icon}
                </span>
                {expanded && <span className="ml-3">{title}</span>}

                {hasSubmenu && expanded && (
                    <svg
                        className="w-4 h-4 ml-auto text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                )}
            </Link>

            {hasSubmenu && expanded && children}

            {isActive && expanded && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
            )}

            {!expanded && (
                <span
                    className={`absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-gray-900 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200 pointer-events-none z-50`}
                >
                    {title}
                </span>
            )}
        </div>
    );
};

export default SidebarItem;
