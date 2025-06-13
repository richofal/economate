import React from "react";
import { Link } from "@inertiajs/react";

const FinancialServices = () => {
    return (
        <div className="bg-gradient-to-br from-[#F2F9FF] to-[#E6F4FF] py-16 md:py-24">
            <div className="w-[90%] md:w-[85%] max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        Cari <span className="text-[#089BFF]">Layanan</span>{" "}
                        Yang Kamu Inginkan
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Kelola keuangan Anda dengan berbagai fitur yang
                        dirancang untuk memudahkan hidup sehari-hari
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all">
                                <img
                                    src="/total.png"
                                    alt="Icon of total wealth"
                                    className="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Total Kekayaan
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Lihat total kekayaan dari berbagai akun dengan mudah
                            dan update secara real-time
                        </p>
                        <div className="mt-auto pt-2">
                            <Link
                                href="/features#wealth"
                                className="text-[#089BFF] font-medium flex items-center hover:underline"
                            >
                                Pelajari lebih lanjut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all">
                                <img
                                    src="/pencatatan.png"
                                    alt="Icon of financial recording"
                                    className="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Pencatatan Keuangan
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Kelola pemasukan dan pengeluaran dengan praktis
                            menggunakan kategori otomatis
                        </p>
                        <div className="mt-auto pt-2">
                            <Link
                                href="/features#recording"
                                className="text-[#089BFF] font-medium flex items-center hover:underline"
                            >
                                Pelajari lebih lanjut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all">
                                <img
                                    src="/analisis.png"
                                    alt="Icon of financial analysis"
                                    className="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Analisis Keuangan
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Visualisasikan pengeluaran dan pemasukan bulanan
                            dengan grafik yang informatif
                        </p>
                        <div className="mt-auto pt-2">
                            <Link
                                href="/features#analysis"
                                className="text-[#089BFF] font-medium flex items-center hover:underline"
                            >
                                Pelajari lebih lanjut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Card 4 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all">
                                <img
                                    src="/split.png"
                                    alt="Icon of bill splitting"
                                    className="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Split Bill & Hutang
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Bagi tagihan dengan teman tanpa ribet. Catat dan
                            pantau hutang dengan notifikasi jatuh tempo
                        </p>
                        <div className="mt-auto pt-2">
                            <Link
                                href="/features#bills"
                                className="text-[#089BFF] font-medium flex items-center hover:underline"
                            >
                                Pelajari lebih lanjut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all">
                                <img
                                    src="/modal.png"
                                    alt="Icon of investment"
                                    className="w-8 h-8"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Manajemen Modal
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Pantau performa investasi dan alokasi aset untuk
                            pertumbuhan keuangan yang lebih baik
                        </p>
                        <div className="mt-auto pt-2">
                            <Link
                                href="/features#capital"
                                className="text-[#089BFF] font-medium flex items-center hover:underline"
                            >
                                Pelajari lebih lanjut
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/register"
                        className="bg-gradient-to-r from-[#089BFF] to-[#0081d6] text-white text-lg font-medium py-3 px-10 rounded-full hover:shadow-lg transform hover:scale-105 transition duration-300"
                    >
                        Coba Semua Fitur Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FinancialServices;
