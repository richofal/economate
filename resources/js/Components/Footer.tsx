import React from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-blue-800 to-blue-900 text-white">
            {/* Footer Wave Divider */}
            <div className="relative overflow-hidden">
                <svg
                    className="absolute bottom-0 w-full -mb-1 text-blue-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="white"
                        fillOpacity="1"
                        d="M0,128L60,149.3C120,171,240,213,360,218.7C480,224,600,192,720,165.3C840,139,960,117,1080,122.7C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
                    ></path>
                </svg>
            </div>

            {/* Newsletter Section */}
            <div className="container mx-auto px-6 pt-16 pb-6">
                <div className="bg-blue-700/50 backdrop-blur-md rounded-xl p-8 mb-12 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0 md:pr-8">
                            <h3 className="text-2xl font-bold mb-2">
                                Dapatkan update terbaru dari kami
                            </h3>
                            <p className="text-blue-100">
                                Berlangganan newsletter kami untuk mendapatkan
                                informasi terbaru tentang layanan dan promo
                                spesial.
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <form className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Email Anda"
                                    className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-blue-300/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300"
                                >
                                    Berlangganan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="rounded-full p-2 bg-white/20 backdrop-blur-sm">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">
                                PT. Smart{" "}
                                <span className="text-blue-300">CRM</span>
                            </h2>
                        </div>
                        <p className="text-blue-100 mb-6">
                            Solusi customer relationship management terpadu
                            untuk meningkatkan efisiensi dan pertumbuhan bisnis
                            Anda.
                        </p>
                        <div className="flex space-x-4">
                            {/* Social Media Icons */}
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-blue-600/50 hover:bg-blue-500 flex items-center justify-center transition duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-blue-600/50 hover:bg-blue-500 flex items-center justify-center transition duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-blue-600/50 hover:bg-blue-500 flex items-center justify-center transition duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-blue-600/50 hover:bg-blue-500 flex items-center justify-center transition duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-700">
                            Navigasi
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Beranda
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Layanan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Kontak
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-700">
                            Layanan Kami
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Internet Bisnis
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Internet Rumah
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Hosting & Domain
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Solusi Cloud
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-blue-100 hover:text-white transition duration-300 flex items-center"
                                >
                                    <span className="h-1 w-1 bg-blue-400 rounded-full mr-2"></span>
                                    Customer Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-700">
                            Hubungi Kami
                        </h3>
                        <div className="space-y-4">
                            <p className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-300" />
                                <span className="text-blue-100">
                                    Jl. Gatot Subroto No.123
                                    <br />
                                    Jakarta Selatan, 12930
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Phone className="h-5 w-5 mr-3 text-blue-300" />
                                <a
                                    href="tel:+622112345678"
                                    className="text-blue-100 hover:text-white transition duration-300"
                                >
                                    +62 21 1234 5678
                                </a>
                            </p>
                            <p className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-blue-300" />
                                <a
                                    href="mailto:info@smartcrm.com"
                                    className="text-blue-100 hover:text-white transition duration-300"
                                >
                                    info@smartcrm.com
                                </a>
                            </p>

                            {/* Support Hours */}
                            <div className="mt-6">
                                <h4 className="text-sm font-semibold mb-2 text-blue-200">
                                    Jam Operasional:
                                </h4>
                                <p className="text-blue-100 text-sm">
                                    Senin - Jumat: 08:00 - 17:00
                                    <br />
                                    Sabtu: 09:00 - 14:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-blue-700/50 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-blue-200 text-sm">
                            © {currentYear} PT. Smart CRM. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0">
                            <ul className="flex flex-wrap gap-6 text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="text-blue-200 hover:text-white transition duration-300"
                                    >
                                        Kebijakan Privasi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-blue-200 hover:text-white transition duration-300"
                                    >
                                        Syarat & Ketentuan
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-blue-200 hover:text-white transition duration-300"
                                    >
                                        Kebijakan Cookie
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-blue-200 hover:text-white transition duration-300"
                                    >
                                        Peta Situs
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
