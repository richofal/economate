import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const TryItNow: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2500);
    };

    return (
        <>
            <div className="bg-gradient-to-br from-[#F2F9FF] to-[#E6F4FF] w-full py-16 md:py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white rounded-2xl p-8 md:p-12 lg:p-16 shadow-lg transform transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="w-full md:w-3/4 mb-8 md:mb-0">
                                <div className="text-sm sm:text-base md:text-lg font-medium opacity-90 mb-2">
                                    Try it now!
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                                    Siap tingkatkan manajemen keuanganmu?
                                </h2>
                                <p className="text-base sm:text-lg opacity-90 mb-6 md:mb-0 max-w-xl">
                                    EconoMate siap membantu untuk mencatat dan
                                    memantau kondisi keuangan pribadi dengan
                                    mudah dan efisien.
                                </p>
                            </div>

                            <div className="w-full md:w-1/4 flex justify-center md:justify-end">
                                <Link
                                    href="/register"
                                    onClick={startLoading}
                                    className="bg-white text-[#089BFF] text-base sm:text-lg font-bold py-3 px-8 rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-md"
                                >
                                    Daftar Sekarang
                                </Link>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="relative">
                            <div className="absolute top-0 right-0 transform -translate-y-32 translate-x-8 bg-white rounded-full w-16 h-16 opacity-10"></div>
                            <div className="absolute bottom-0 left-0 transform translate-y-16 -translate-x-8 bg-white rounded-full w-24 h-24 opacity-10"></div>
                        </div>
                    </div>
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

export default TryItNow;
