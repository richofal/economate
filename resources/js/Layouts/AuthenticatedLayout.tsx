import { useState, useEffect, PropsWithChildren, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import MobileSidebar from "@/Components/MobileSidebar";

export default function AuthenticatedLayout({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Track desktop sidebar expanded state separately
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    // Track device viewport
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    // Handle responsive behavior and close mobile sidebar when clicking outside
    useEffect(() => {
        const handleResize = () => {
            // Update mobile state
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);

            // Close sidebar on desktop
            if (!mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        // Run on mount to set initial state
        handleResize();

        // Close sidebar when pressing escape key
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        };

        // Close sidebar when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                sidebarOpen &&
                !target.closest(".mobile-sidebar") &&
                !target.closest(".sidebar-toggle")
            ) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarOpen]);

    // Load sidebar state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem("sidebarExpanded");
        if (savedState !== null) {
            setSidebarExpanded(savedState === "true");
        }
    }, []);

    // Save sidebar state to localStorage when changed
    useEffect(() => {
        localStorage.setItem("sidebarExpanded", sidebarExpanded.toString());
    }, [sidebarExpanded]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-30">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    sidebarExpanded={sidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />
            </div>

            <div className="flex pt-16 flex-1">
                {/* Fixed Desktop Sidebar */}
                <div className="hidden lg:block fixed left-0 top-16 bottom-0 z-20 overflow-y-auto">
                    <Sidebar
                        expanded={sidebarExpanded}
                        toggleSidebar={toggleSidebar}
                    />
                </div>

                {/* Mobile Sidebar Backdrop - Overlay when mobile sidebar is open */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                            aria-hidden="true"
                        ></motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Sidebar */}
                <MobileSidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                {/* Scrollable Content Area - Dynamically adjusted margin */}
                <motion.main
                    animate={{
                        marginLeft: isMobile
                            ? "0"
                            : sidebarExpanded
                            ? "280px"
                            : "80px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-1 w-full relative overflow-y-auto"
                >
                    {/* Page content */}
                    <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
                </motion.main>
            </div>

            {/* Scroll fix styles */}
            <style>{`
                html,
                body {
                    height: 100%;
                    overflow-y: auto;
                }

                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .container {
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                    }

                    table {
                        display: block;
                        overflow-x: auto;
                        white-space: nowrap;
                    }
                }

                /* Scrollbar styles for mobile sidebar */
                .mobile-sidebar {
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .mobile-sidebar::-webkit-scrollbar {
                    width: 4px;
                }

                .mobile-sidebar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .mobile-sidebar::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 4px;
                }

                /* Firefox scrollbar */
                .mobile-sidebar {
                    scrollbar-width: thin;
                    scrollbar-color: #ddd #f1f1f1;
                }

                /* Prevent content being hidden under header */
                html {
                    scroll-padding-top: 5rem;
                }
            `}</style>
        </div>
    );
}
