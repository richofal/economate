import React from "react";
import {
    Users,
    Package,
    ClipboardList,
    CheckSquare,
    BarChart,
    Bell,
    ArrowRight,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

const Features: React.FC = () => {
    const features = [
        {
            icon: <Users size={28} />,
            title: "Pengelolaan Lead",
            description:
                "Kelola dan pantau semua calon pelanggan potensial dengan mudah dan terorganisir. Konversi lebih banyak lead menjadi pelanggan tetap.",
            accentColor: "bg-blue-600",
            lightColor: "bg-blue-50",
        },
        {
            icon: <Package size={28} />,
            title: "Manajemen Produk",
            description:
                "Kelola katalog layanan internet dengan informasi harga dan fitur secara lengkap. Tampilkan produk yang relevan untuk setiap pelanggan.",
            accentColor: "bg-indigo-600",
            lightColor: "bg-indigo-50",
        },
        {
            icon: <ClipboardList size={28} />,
            title: "Manajemen Project",
            description:
                "Proses lead menjadi customer dengan alur approval yang terstruktur dan transparan. Lacak status setiap project dengan mudah.",
            accentColor: "bg-purple-600",
            lightColor: "bg-purple-50",
        },
        {
            icon: <CheckSquare size={28} />,
            title: "Approval System",
            description:
                "Sistem approval multi-level untuk sales dan manager dengan notifikasi real-time. Percepat proses persetujuan tanpa mengorbankan kontrol.",
            accentColor: "bg-teal-600",
            lightColor: "bg-teal-50",
        },
        {
            icon: <BarChart size={28} />,
            title: "Analytics & Reports",
            description:
                "Dashboard analitik yang memberikan insight tentang performa sales dan konversi lead. Buat keputusan berbasis data secara cepat.",
            accentColor: "bg-amber-600",
            lightColor: "bg-amber-50",
        },
        {
            icon: <Bell size={28} />,
            title: "Notifikasi Real-time",
            description:
                "Dapatkan update instan untuk setiap perubahan status project, approval, dan aktivitas penting lainnya di dalam sistem.",
            accentColor: "bg-rose-600",
            lightColor: "bg-rose-50",
        },
    ];

    // Framer Motion variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section
            id="features"
            className="py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
        >
            {/* Enhanced background elements */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    className="max-w-3xl mx-auto text-center mb-20"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-sm">
                        Fitur Unggulan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                        Solusi Lengkap untuk{" "}
                        <span className="text-blue-600">Manajemen CRM</span>{" "}
                        Anda
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Platform yang dirancang khusus untuk membantu divisi
                        sales PT. Smart mengelola customer dan layanan internet
                        dengan lebih efisien dan terukur.
                    </p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <FeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                accentColor={feature.accentColor}
                                lightColor={feature.lightColor}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                >
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg group"
                    >
                        Mulai sekarang
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
