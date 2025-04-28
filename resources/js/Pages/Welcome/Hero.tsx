import { CheckSquare, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative overflow-hidden pt-28 pb-36">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-indigo-800 opacity-95 z-0"></div>
            <div className="absolute inset-0 bg-grid-white/[0.07] bg-[length:24px_24px] z-0"></div>

            {/* floating elements with more dynamic animation */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Content Section */}
                    <div
                        className={`lg:w-1/2 text-white transition-all duration-1000 transform ${
                            isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                        }`}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 text-sm font-medium text-white border border-white/20 hover:bg-white/15 transition-all">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2">
                                <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            </span>
                            Smart CRM Solutions for Modern Business
                        </div>

                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6">
                            Kelola Hubungan Pelanggan dengan{" "}
                            <span className="text-blue-200 relative">
                                Lebih Efisien
                                <svg
                                    className="absolute bottom-0 left-0 w-full"
                                    height="6"
                                    viewBox="0 0 200 6"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 3 Q 40 6, 80 3 T 160 3 T 240 3"
                                        stroke="rgb(191, 219, 254)"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl text-blue-100 mb-8 max-w-xl">
                            Solusi CRM terpadu untuk PT. Smart yang membantu
                            divisi sales mengelola leads, customer, dan project
                            dengan lebih efektif dan mendorong pertumbuhan
                            bisnis.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <a
                                href="/login"
                                className="group bg-white hover:bg-blue-50 text-blue-700 px-8 py-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Mulai Sekarang
                                <ChevronRight
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                    size={20}
                                />
                            </a>
                            <a
                                href="#features"
                                className="group border border-white/30 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center transition-all duration-300"
                            >
                                Pelajari Fitur
                                <ChevronRight
                                    className="ml-2 group-hover:translate-x-1 transition-transform"
                                    size={20}
                                />
                            </a>
                        </div>

                        {/* Stats with hover effects */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 lg:mr-12">
                            <div className="text-center px-4 py-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all hover:shadow-lg group">
                                <div className="text-3xl font-bold group-hover:scale-110 transition-transform">
                                    98%
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Customer Satisfaction
                                </div>
                            </div>
                            <div className="text-center px-4 py-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all hover:shadow-lg group">
                                <div className="text-3xl font-bold group-hover:scale-110 transition-transform">
                                    15k+
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Active Users
                                </div>
                            </div>
                            <div className="text-center px-4 py-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all hover:shadow-lg group">
                                <div className="text-3xl font-bold group-hover:scale-110 transition-transform">
                                    24/7
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Support Service
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Section */}
                    <div
                        className={`lg:w-1/2 relative mt-12 lg:mt-0 transition-all duration-1000 delay-300 transform ${
                            isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                        }`}
                    >
                        {/* Main Image with visual effects */}
                        <div className="relative z-10 rounded-xl overflow-hidden border border-white/20 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-transparent z-10 rounded-xl pointer-events-none group-hover:opacity-50 transition-opacity"></div>
                            <img
                                src="/images"
                                alt="CRM Dashboard"
                                className="w-full h-auto rounded-xl transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* decorative elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-lg rotate-12 z-0 opacity-70 blur-sm"></div>
                        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300 rounded-lg rotate-45 z-0 opacity-60 blur-sm"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-400 rounded-lg -rotate-12 z-0 opacity-70 blur-sm"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
