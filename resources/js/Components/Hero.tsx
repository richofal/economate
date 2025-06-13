import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const Hero: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2500);
    };

    return (
        <>
            <div className="w-full text-black">
                <div className="w-full bg-gradient-to-br from-[#F2F9FF] to-[#E6F4FF] flex justify-center items-center min-h-[85vh] md:min-h-[80vh]">
                    <div className="w-[90%] md:w-[85%] max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-10 md:py-16">
                        {/* Left Section - Content */}
                        <section className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left lg:pr-8">
                            <h1 className="text-[#333] text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Teman Setia Pengelola{" "}
                                <span className="text-[#089BFF]">Keuangan</span>{" "}
                                Anda
                            </h1>

                            <p className="text-[#555] text-lg sm:text-xl md:text-2xl font-normal mt-4 md:mt-6 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0">
                                Website yang siap jadi teman dalam mengelola
                                keuangan pribadi dengan mudah dan efisien
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-2">
                                <Link
                                    href="/register"
                                    onClick={startLoading}
                                    className="bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white text-lg md:text-xl font-medium py-3 px-8 rounded-full hover:shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Mulai Sekarang
                                </Link>

                                <Link
                                    href="/features"
                                    onClick={startLoading}
                                    className="bg-white text-[#089BFF] border-2 border-[#089BFF] text-lg md:text-xl font-medium py-3 px-8 rounded-full hover:bg-blue-50 transform hover:scale-105 transition duration-300"
                                >
                                    Lihat Fitur
                                </Link>
                            </div>
                        </section>

                        {/* Right Section - Image */}
                        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center">
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-blue-100 rounded-full blur-xl opacity-70"></div>
                                <img
                                    src="/images/hero.png"
                                    alt="Financial Management Dashboard"
                                    className="relative z-10 w-full max-w-lg"
                                />

                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-blue-500 rounded-full w-20 h-20 opacity-20"></div>
                                <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4 bg-green-500 rounded-full w-16 h-16 opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="w-full overflow-hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 100"
                        className="w-full h-auto fill-[#E6F4FF]"
                    >
                        <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
                    </svg>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#089BFF] to-[#0081d6] bg-opacity-95 z-50">
                    <div className="flex flex-col items-center space-y-6">
                        <img
                            alt="Logo EconoMate"
                            src="/logo.png"
                            className="w-[200px] h-auto animate-pulse"
                        />
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-white animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-white animate-ping opacity-30"></div>
                        </div>
                        <p className="text-white text-xl font-medium">
                            Loading...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Hero;
