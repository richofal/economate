import { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Users,
    Calendar,
    BarChart2,
    Mail,
    Clock,
    Bell,
    PlusCircle,
    Phone,
    Search,
    FileText,
    CreditCard,
    Settings,
    ArrowUpRight,
    ChevronRight,
    UserPlus,
    DollarSign,
    Wallet,
    TrendingUp,
    Activity,
    Layers,
    AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
    const { auth } = usePage().props;
    const [greeting, setGreeting] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    // Set greeting based on time of day
    useEffect(() => {
        const getGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) return "Selamat pagi";
            if (hour >= 12 && hour < 15) return "Selamat siang";
            if (hour >= 15 && hour < 19) return "Selamat sore";
            return "Selamat malam";
        };

        setGreeting(getGreeting());

        // Set current time and date
        const updateTimeAndDate = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

            setCurrentDate(
                now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
            );
        };

        updateTimeAndDate();
        const interval = setInterval(updateTimeAndDate, 60000);

        return () => clearInterval(interval);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    // Sample data for widgets
    const dummyData = {
        balance: {
            total: "Rp 2.450.000",
            change: "+12%",
            isPositive: true,
        },
        expensesByCategory: [
            {
                name: "Makanan",
                amount: 850000,
                percentage: 35,
                color: "bg-blue-500",
            },
            {
                name: "Transportasi",
                amount: 450000,
                percentage: 18,
                color: "bg-green-500",
            },
            {
                name: "Belanja",
                amount: 650000,
                percentage: 26,
                color: "bg-purple-500",
            },
            {
                name: "Hiburan",
                amount: 325000,
                percentage: 13,
                color: "bg-yellow-500",
            },
            {
                name: "Lainnya",
                amount: 175000,
                percentage: 8,
                color: "bg-gray-500",
            },
        ],
        recentTransactions: [
            {
                id: 1,
                name: "Belanja Bulanan",
                amount: -350000,
                category: "Belanja",
                date: "12 Jun",
                icon: <CreditCard size={16} className="text-purple-500" />,
            },
            {
                id: 2,
                name: "Gaji Bulanan",
                amount: 2500000,
                category: "Pendapatan",
                date: "10 Jun",
                icon: <DollarSign size={16} className="text-green-500" />,
            },
            {
                id: 3,
                name: "Pembayaran Internet",
                amount: -250000,
                category: "Tagihan",
                date: "8 Jun",
                icon: <Layers size={16} className="text-blue-500" />,
            },
            {
                id: 4,
                name: "Makan Siang",
                amount: -85000,
                category: "Makanan",
                date: "8 Jun",
                icon: <CreditCard size={16} className="text-yellow-500" />,
            },
            {
                id: 5,
                name: "Bonus Proyek",
                amount: 750000,
                category: "Pendapatan",
                date: "5 Jun",
                icon: <DollarSign size={16} className="text-green-500" />,
            },
        ],
        upcomingPayments: [
            {
                id: 1,
                name: "Pembayaran Netflix",
                amount: 159000,
                date: "18 Jun",
                priority: "medium",
            },
            {
                id: 2,
                name: "Cicilan KPR",
                amount: 1200000,
                date: "20 Jun",
                priority: "high",
            },
            {
                id: 3,
                name: "Listrik",
                amount: 450000,
                date: "24 Jun",
                priority: "high",
            },
        ],
    };

    // Priority badge colors
    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700",
    };

    // Format number to IDR currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Welcome Section */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="px-6 py-8 md:px-10 md:py-12 relative overflow-hidden">
                        {/* Background patterns */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 left-20 w-32 h-32 bg-white opacity-5 rounded-full -translate-x-10 translate-y-10"></div>

                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-white text-2xl md:text-3xl font-bold mb-1">
                                    {greeting}, {auth.user?.name.split(" ")[0]}!
                                </h2>
                                <p className="text-blue-100 text-sm md:text-base flex items-center">
                                    <Calendar className="w-4 h-4 mr-1.5" />{" "}
                                    {currentDate} •{" "}
                                    <Clock className="w-4 h-4 mx-1.5" />{" "}
                                    {currentTime}
                                </p>
                            </div>

                            <div className="flex gap-2 md:gap-3">
                                <Link
                                    href=""
                                    className="flex items-center bg-white/15 hover:bg-white/20 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <PlusCircle className="w-4 h-4 mr-1.5" />
                                    <span className="text-sm">
                                        Tambah Pemasukan
                                    </span>
                                </Link>
                                <Link
                                    href=""
                                    className="flex items-center bg-white/10 hover:bg-white/15 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    <CreditCard className="w-4 h-4 mr-1.5" />
                                    <span className="text-sm">
                                        Catat Pengeluaran
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick links/stats */}
                    <div className="bg-white/10 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-white/10 mr-3">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-100">
                                    Total Saldo
                                </p>
                                <p className="text-lg font-semibold">
                                    {dummyData.balance.total}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-white/10 mr-3">
                                <BarChart2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-100">
                                    Tren Bulan Ini
                                </p>
                                <p className="text-lg font-semibold flex items-center">
                                    {dummyData.balance.change}
                                    {dummyData.balance.isPositive ? (
                                        <ArrowUpRight className="w-4 h-4 ml-1 text-green-300" />
                                    ) : (
                                        <ArrowUpRight className="w-4 h-4 ml-1 text-red-300 transform rotate-90" />
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-white/10 mr-3">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-100">
                                    Kategori Aktif
                                </p>
                                <p className="text-lg font-semibold">12</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-white/10 mr-3">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-100">
                                    Pembayaran Akan Datang
                                </p>
                                <p className="text-lg font-semibold">
                                    {dummyData.upcomingPayments.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Dashboard Content */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Column */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Transaksi Terbaru
                            </h2>
                            <Link
                                href=""
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                Lihat Semua <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {dummyData.recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-lg bg-gray-100 mr-3">
                                            {transaction.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {transaction.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {transaction.category} •{" "}
                                                {transaction.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`text-sm font-medium ${
                                            transaction.amount > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.amount > 0 ? "+" : ""}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expense by Category */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Pengeluaran Berdasarkan Kategori
                            </h2>
                            <Link
                                href=""
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                Analisis Detail{" "}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {dummyData.expensesByCategory.map(
                                (category, index) => (
                                    <div key={index} className="flex flex-col">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                                {category.name}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(
                                                    category.amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${category.color}`}
                                                style={{
                                                    width: `${category.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div variants={itemVariants}>
                    {/* Upcoming Payments */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Pembayaran Mendatang
                            </h2>
                            <Link
                                href=""
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                                Lihat Kalender{" "}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {dummyData.upcomingPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="bg-gray-50 rounded-lg p-4 mb-3 last:mb-0"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {payment.name}
                                    </h3>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            priorityColors[
                                                payment.priority as keyof typeof priorityColors
                                            ]
                                        }`}
                                    >
                                        {payment.priority === "high"
                                            ? "Penting"
                                            : payment.priority === "medium"
                                            ? "Sedang"
                                            : "Rendah"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1" />{" "}
                                        {payment.date}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-lg mt-3 transition-colors text-sm">
                            + Tambah Pengingat Pembayaran
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Akses Cepat
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-blue-100 mb-2">
                                    <Wallet
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Dompet
                                </span>
                            </Link>

                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-green-100 mb-2">
                                    <BarChart2
                                        size={20}
                                        className="text-green-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Budget
                                </span>
                            </Link>

                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-purple-100 mb-2">
                                    <Users
                                        size={20}
                                        className="text-purple-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Split Bill
                                </span>
                            </Link>

                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-yellow-100 mb-2">
                                    <FileText
                                        size={20}
                                        className="text-yellow-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Laporan
                                </span>
                            </Link>

                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-indigo-100 mb-2">
                                    <TrendingUp
                                        size={20}
                                        className="text-indigo-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Target
                                </span>
                            </Link>

                            <Link
                                href=""
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-gray-100 mb-2">
                                    <Settings
                                        size={20}
                                        className="text-gray-600"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                    Pengaturan
                                </span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
