import React, { PropsWithChildren, useEffect, useState } from "react";
import Footer from "@/Components/Footer";
import { ArrowUp } from "lucide-react";
import Navbar from "@/Components/Navbar";

interface GuestLayoutProps {
    showNavbar?: boolean;
    showFooter?: boolean;
    pageTitle?: string;
    withScrollIndicator?: boolean;
}

export default function GuestLayout({
    children,
    showNavbar = true,
    showFooter = true,
    pageTitle,
    withScrollIndicator = true,
}: PropsWithChildren<GuestLayoutProps>) {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Update document title if provided
    useEffect(() => {
        if (pageTitle) {
            document.title = `${pageTitle} | PT. EconoMate CRM`;
        }
    }, [pageTitle]);

    // Handle scroll events for scroll-to-top button and progress indicator
    useEffect(() => {
        const handleScroll = () => {
            // Show scroll-to-top button after scrolling down 300px
            setShowScrollTop(window.scrollY > 300);

            // Calculate scroll progress percentage
            const totalHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Scroll Progress Indicator - Positioned above all content */}
            {withScrollIndicator && (
                <div className="fixed top-0 left-0 w-full h-1 z-[100]">
                    <div
                        className="h-full bg-[#089BFF] transition-all duration-150 ease-out"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
            )}

            {/* Navbar */}
            {showNavbar && <Navbar />}

            {/* Page Content - No extra padding/margin at top */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            {showFooter && <Footer />}

            {/* Scroll to top button - improved design */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 z-40 animate-fadeIn"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} className="animate-bounce" />
                </button>
            )}
        </div>
    );
}
