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
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />
        </AuthenticatedLayout>
    );
}
