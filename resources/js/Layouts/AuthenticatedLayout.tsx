import React, { PropsWithChildren, useState } from "react";
import Sidebar from "@/Components/Sidebar";
import { Head } from "@inertiajs/react";
import { Menu } from "lucide-react";

interface AuthenticatedLayoutProps {
    title: string;
}

export default function AuthenticatedLayout({
    children,
    title,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title={title} />

            <div className="flex h-screen bg-gray-50">
                {/* Sidebar for larger screens */}
                <div
                    className={`hidden md:block ${
                        sidebarOpen ? "w-64" : "w-0"
                    } transition-all duration-300`}
                >
                    <Sidebar />
                </div>

                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile sidebar */}
                <div
                    className={`md:hidden fixed inset-y-0 left-0 transform ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out z-30`}
                >
                    <Sidebar />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top navbar */}
                    <header className="bg-white shadow-sm z-10">
                        <div className="h-16 px-4 flex items-center justify-between">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-500 focus:outline-none focus:text-gray-700"
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h1>
                            <div className="w-8"></div>{" "}
                            {/* Empty div for spacing */}
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
