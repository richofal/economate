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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <Head title={title} />
            <div className="flex h-screen bg-gray-50">
                <Sidebar isSidebarOpen={isSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white shadow-sm z-10">
                        <div className="h-16 px-4 flex items-center justify-between">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-500 focus:outline-none focus:text-gray-700"
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">
                                {title}
                            </h1>
                            <div className="w-8" />
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
