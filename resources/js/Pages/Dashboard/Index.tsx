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
    Settings,
    ArrowUpRight,
    ChevronRight,
    UserPlus,
    DollarSign,
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
            if (hour >= 5 && hour < 12) return "Good morning";
            if (hour >= 12 && hour < 18) return "Good afternoon";
            return "Good evening";
        };

        setGreeting(getGreeting());

        // Set current time and date
        const updateTimeAndDate = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
            );

            setCurrentDate(
                now.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            );
        };

        updateTimeAndDate();
        const interval = setInterval(updateTimeAndDate, 60000);

        return () => clearInterval(interval);
    }, []);

    // Sample data for recent activity
    const recentActivities = [
        {
            type: "New Lead",
            name: "Sarah Johnson",
            time: "10 min ago",
            company: "Acme Tech",
        },
        {
            type: "Meeting Scheduled",
            name: "Michael Chen",
            time: "2 hours ago",
            company: "Global Solutions",
        },
        {
            type: "Email Sent",
            name: "Lisa Rodriguez",
            time: "Yesterday",
            company: "Bright Marketing",
        },
        {
            type: "Deal Closed",
            name: "James Wilson",
            time: "2 days ago",
            company: "Horizon Group",
            value: "$45,000",
        },
    ];

    // Sample data for upcoming tasks
    const upcomingTasks = [
        {
            title: "Client presentation",
            time: "Today, 2:00 PM",
            priority: "high",
        },
        {
            title: "Follow up with leads",
            time: "Today, 4:30 PM",
            priority: "medium",
        },
        {
            title: "Prepare proposal",
            time: "Tomorrow, 10:00 AM",
            priority: "high",
        },
    ];

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

    // Priority badge colors
    const priorityColors = {
        high: "bg-red-100 text-red-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-green-100 text-green-700",
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-6 px-4 py-6 max-w-7xl mx-auto"
            >
                {/* Top bar with search and notifications */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6"
                >
                    <div className="relative w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search customers, meetings, or deals..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-0 right-0"></span>
                        </button>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500">
                                Today's Date
                            </span>
                            <div className="font-medium text-gray-700">
                                {currentDate}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Welcome message */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white overflow-hidden shadow-sm rounded-xl"
                >
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
                                    {greeting}, {auth.user.name}!
                                    <span className="text-base font-normal text-blue-600 border border-blue-200 rounded-full px-3 py-0.5 bg-blue-50">
                                        <Clock
                                            size={14}
                                            className="inline mr-1"
                                        />
                                        {currentTime}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Welcome to your BIMO CRM dashboard. Here's
                                    an overview of your recent activity and
                                    upcoming tasks.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    <PlusCircle size={16} />
                                    <span>Add Customer</span>
                                </button>
                                <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                                    <Calendar size={16} />
                                    <span>Schedule</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        {
                            title: "Total Customers",
                            value: "245",
                            change: "+12% from last month",
                            trend: "up",
                            icon: <Users size={20} />,
                            color: "blue",
                        },
                        {
                            title: "Meetings This Week",
                            value: "12",
                            change: "+3 from last week",
                            trend: "up",
                            icon: <Calendar size={20} />,
                            color: "indigo",
                        },
                        {
                            title: "Open Inquiries",
                            value: "38",
                            change: "-5 from yesterday",
                            trend: "down",
                            icon: <Mail size={20} />,
                            color: "purple",
                        },
                        {
                            title: "Monthly Revenue",
                            value: "$24,500",
                            change: "+18% from last month",
                            trend: "up",
                            icon: <DollarSign size={20} />,
                            color: "green",
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            whileHover={{
                                y: -5,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div
                                        className={`inline-flex items-center justify-center p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}
                                    >
                                        {stat.icon}
                                    </div>
                                    <span
                                        className={`text-xs font-medium flex items-center ${
                                            stat.trend === "up"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight size={14} />
                                        ) : (
                                            <ArrowUpRight
                                                size={14}
                                                className="rotate-180"
                                            />
                                        )}
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-sm font-medium text-gray-500 mt-3">
                                    {stat.title}
                                </h3>
                                <div className="text-3xl font-bold text-gray-800 mt-1">
                                    {stat.value}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-medium text-gray-800 text-lg">
                                Recent Activity
                            </h3>
                            <Link
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                            >
                                View all <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full bg-${
                                            activity.type === "New Lead"
                                                ? "blue"
                                                : activity.type ===
                                                  "Meeting Scheduled"
                                                ? "indigo"
                                                : activity.type === "Email Sent"
                                                ? "purple"
                                                : "green"
                                        }-100 flex items-center justify-center mr-4 flex-shrink-0`}
                                    >
                                        {activity.type === "New Lead" && (
                                            <UserPlus
                                                size={18}
                                                className="text-blue-600"
                                            />
                                        )}
                                        {activity.type ===
                                            "Meeting Scheduled" && (
                                            <Calendar
                                                size={18}
                                                className="text-indigo-600"
                                            />
                                        )}
                                        {activity.type === "Email Sent" && (
                                            <Mail
                                                size={18}
                                                className="text-purple-600"
                                            />
                                        )}
                                        {activity.type === "Deal Closed" && (
                                            <DollarSign
                                                size={18}
                                                className="text-green-600"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-medium text-gray-800">
                                                {activity.name}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {activity.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {activity.company}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                {activity.type}
                                            </span>
                                            {activity.value && (
                                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded ml-2">
                                                    {activity.value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tasks & Upcoming */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-medium text-gray-800 text-lg">
                                Upcoming Tasks
                            </h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                                <PlusCircle size={16} className="mr-1" /> Add
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="font-medium text-gray-700 mb-3">
                                Quick Actions
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    {
                                        label: "New Call",
                                        icon: <Phone size={16} />,
                                        color: "blue",
                                    },
                                    {
                                        label: "Create Task",
                                        icon: <FileText size={16} />,
                                        color: "indigo",
                                    },
                                    {
                                        label: "Send Email",
                                        icon: <Mail size={16} />,
                                        color: "purple",
                                    },
                                    {
                                        label: "Settings",
                                        icon: <Settings size={16} />,
                                        color: "gray",
                                    },
                                ].map((action, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        <span
                                            className={`text-${action.color}-600`}
                                        >
                                            {action.icon}
                                        </span>
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 className="font-medium text-gray-800 text-lg mb-4">
                        Common Actions
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                            {
                                label: "New Customer",
                                icon: <UserPlus size={20} />,
                                color: "blue",
                            },
                            {
                                label: "Schedule Meeting",
                                icon: <Calendar size={20} />,
                                color: "indigo",
                            },
                            {
                                label: "Create Campaign",
                                icon: <Mail size={20} />,
                                color: "purple",
                            },
                            {
                                label: "View Reports",
                                icon: <BarChart2 size={20} />,
                                color: "green",
                            },
                            {
                                label: "Create Invoice",
                                icon: <FileText size={20} />,
                                color: "orange",
                            },
                            {
                                label: "Settings",
                                icon: <Settings size={20} />,
                                color: "gray",
                            },
                        ].map((action, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center justify-center p-5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div
                                    className={`p-3 rounded-full bg-${action.color}-50 text-${action.color}-600 mb-3`}
                                >
                                    {action.icon}
                                </div>
                                <span className="text-sm text-gray-700">
                                    {action.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
