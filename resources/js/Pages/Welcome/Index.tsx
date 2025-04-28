// HomePage.tsx
import React from "react";
import {
    ChevronRight,
    Users,
    Package,
    ClipboardList,
    CheckSquare,
    Globe,
} from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";
import Hero from "./Hero";
import Features from "./Feature";

const WelcomePage: React.FC = () => {
    return (
        <GuestLayout>
            <Hero />
            <Features />

            {/* How It Works Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Cara Kerja
                    </h2>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-center">
                                Alur 1: Customer Memilih Produk
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                            1
                                        </div>
                                        <h4 className="text-lg font-medium">
                                            Customer Memilih Produk
                                        </h4>
                                    </div>
                                    <p className="text-gray-600 ml-11">
                                        Customer memilih produk/layanan internet
                                        yang diinginkan
                                    </p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ChevronRight
                                        className="text-gray-400 transform rotate-90 md:rotate-0"
                                        size={24}
                                    />
                                </div>
                                <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                            2
                                        </div>
                                        <h4 className="text-lg font-medium">
                                            Approval Manager
                                        </h4>
                                    </div>
                                    <p className="text-gray-600 ml-11">
                                        Manager melakukan review dan approval
                                        terhadap permintaan
                                    </p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ChevronRight
                                        className="text-gray-400 transform rotate-90 md:rotate-0"
                                        size={24}
                                    />
                                </div>
                                <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                            3
                                        </div>
                                        <h4 className="text-lg font-medium">
                                            Layanan Aktif
                                        </h4>
                                    </div>
                                    <p className="text-gray-600 ml-11">
                                        Layanan diaktifkan dan customer dapat
                                        menggunakannya
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold mb-6 text-center">
                                Alur 2: Sales Menawarkan Produk
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                        1
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium">
                                            Sales Menawarkan Produk
                                        </h4>
                                        <p className="text-gray-600">
                                            Sales mencatat dan menawarkan
                                            produk/layanan internet kepada
                                            customer
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <ChevronRight
                                        className="text-gray-400 transform rotate-90"
                                        size={24}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                        2
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium">
                                            Customer Approve/Reject
                                        </h4>
                                        <p className="text-gray-600">
                                            Customer meninjau penawaran dan
                                            memberikan approval atau rejection
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <ChevronRight
                                        className="text-gray-400 transform rotate-90"
                                        size={24}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                        3
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium">
                                            Manager Approve/Reject
                                        </h4>
                                        <p className="text-gray-600">
                                            Manager melakukan verifikasi dan
                                            approval terhadap permintaan yang
                                            disetujui customer
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <ChevronRight
                                        className="text-gray-400 transform rotate-90"
                                        size={24}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                        4
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-lg font-medium">
                                            Layanan Aktif
                                        </h4>
                                        <p className="text-gray-600">
                                            Layanan diaktifkan dan customer
                                            dapat menggunakannya
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Siap Tingkatkan Efisiensi Bisnis Anda?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Jadikan proses pengelolaan customer dan layanan internet
                        lebih efisien dengan CRM PT. Smart.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a
                            href="/login"
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100"
                        >
                            Login Sekarang
                        </a>
                        <a
                            href="/register"
                            className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Buat Akun
                        </a>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default WelcomePage;
