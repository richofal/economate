"use client";

import { useState } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Linkedin,
    Github,
    Twitter,
    Instagram,
    ExternalLink,
    ChevronRight,
    MapPin,
    Calendar,
    Users,
    Building,
    CheckCircle,
    ArrowRight,
    Phone,
    Star,
    Quote,
} from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";

const AboutPage = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Testimonials data
    const testimonials = [
        {
            quote: "PT SMART CRM has transformed how we manage our customer relationships. The platform is intuitive and has significantly improved our sales process.",
            author: "Jessica Williams",
            position: "Sales Director",
            company: "TechGrowth Inc.",
            avatar: "https://randomuser.me/api/portraits/women/45.jpg",
            rating: 5,
        },
        {
            quote: "We've tried several CRM solutions, but none have been as user-friendly and powerful as PT SMART CRM. It's become an essential part of our business operations.",
            author: "Robert Chen",
            position: "CEO",
            company: "Innovate Solutions",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            rating: 5,
        },
        {
            quote: "The analytics and reporting features have given us insights we never had before. Our customer retention has improved by 35% since implementing PT SMART CRM.",
            author: "Sophia Martinez",
            position: "Customer Success Manager",
            company: "Global Retail Group",
            avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            rating: 4,
        },
    ];

    // Company milestones
    const milestones = [
        {
            year: "2023",
            title: "Company Founded",
            description:
                "PT SMART CRM was established with a vision to revolutionize customer relationship management.",
            icon: Building,
        },
        {
            year: "2023",
            title: "First Product Launch",
            description:
                "Released our core CRM platform with essential features for small and medium businesses.",
            icon: Star,
        },
        {
            year: "2024",
            title: "Expanded Team",
            description:
                "Grew to 25+ team members across development, design, and customer success.",
            icon: Users,
        },
        {
            year: "2024",
            title: "500+ Customers",
            description:
                "Reached a significant milestone of serving over 500 businesses across Indonesia.",
            icon: Building,
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

    return (
        <GuestLayout>
            <Head title="About Us | PT SMART CRM" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center">
                            {/* Company logo */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mx-auto"
                            >
                                <span className="text-white text-3xl font-bold">
                                    CRM
                                </span>
                            </motion.div>

                            {/* Company name */}
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
                            >
                                About{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative inline-block">
                                    PT SMART CRM
                                    <motion.span
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.5,
                                        }}
                                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                    ></motion.span>
                                </span>
                            </motion.h1>

                            {/* Tagline */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            >
                                Building innovative customer relationship
                                management solutions for modern businesses
                            </motion.p>

                            {/* Decorative dots */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="mt-8 flex justify-center space-x-2"
                            >
                                <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                <span className="inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Company Overview Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            {/* Company Stats Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-6 sm:px-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                                    <div className="text-center">
                                        <div className="flex justify-center mb-2">
                                            <Calendar className="h-8 w-8 opacity-80" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            2023
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Founded
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex justify-center mb-2">
                                            <MapPin className="h-8 w-8 opacity-80" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            Jakarta
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Headquarters
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex justify-center mb-2">
                                            <Users className="h-8 w-8 opacity-80" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            25+
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Team Members
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex justify-center mb-2">
                                            <Building className="h-8 w-8 opacity-80" />
                                        </div>
                                        <div className="text-3xl font-bold mb-1">
                                            500+
                                        </div>
                                        <div className="text-blue-100 text-sm">
                                            Customers
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-6 sm:p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10">
                                    {/* Left Content - Story and Values */}
                                    <div className="lg:col-span-2">
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                        >
                                            <motion.h2
                                                variants={itemVariants}
                                                className="text-3xl font-bold text-gray-900 mb-6"
                                            >
                                                Our Story
                                            </motion.h2>

                                            <div className="prose prose-lg max-w-none">
                                                <motion.p
                                                    variants={itemVariants}
                                                >
                                                    PT SMART CRM was founded in
                                                    2023 with a mission to
                                                    empower businesses with
                                                    intuitive customer
                                                    relationship management
                                                    tools. We believe that
                                                    maintaining strong customer
                                                    relationships should be
                                                    accessible to businesses of
                                                    all sizes.
                                                </motion.p>

                                                <motion.p
                                                    variants={itemVariants}
                                                >
                                                    Our team of experienced
                                                    developers and designers
                                                    work tirelessly to create a
                                                    platform that's both
                                                    powerful and user-friendly.
                                                    By focusing on intuitive
                                                    design and essential
                                                    features, we've built a CRM
                                                    that helps businesses grow
                                                    without the complexity.
                                                </motion.p>

                                                <motion.div
                                                    variants={itemVariants}
                                                >
                                                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                                                        <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            <span className="text-blue-600 font-bold">
                                                                1
                                                            </span>
                                                        </span>
                                                        Our Mission
                                                    </h3>
                                                    <div className="pl-14">
                                                        <p className="text-gray-700">
                                                            To provide
                                                            businesses with a
                                                            simple yet powerful
                                                            platform that
                                                            elevates customer
                                                            relationships,
                                                            streamlines
                                                            workflows, and
                                                            drives growth
                                                            through data-driven
                                                            insights.
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    variants={itemVariants}
                                                >
                                                    <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4 flex items-center">
                                                        <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            <span className="text-blue-600 font-bold">
                                                                2
                                                            </span>
                                                        </span>
                                                        Our Vision
                                                    </h3>
                                                    <div className="pl-14">
                                                        <p className="text-gray-700">
                                                            To become the go-to
                                                            CRM solution for
                                                            modern businesses by
                                                            continually
                                                            innovating and
                                                            adapting to the
                                                            evolving needs of
                                                            our customers.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Core Values */}
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="mt-12"
                                        >
                                            <motion.h3
                                                variants={itemVariants}
                                                className="text-2xl font-bold text-gray-900 mb-6"
                                            >
                                                Core Values
                                            </motion.h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[
                                                    {
                                                        label: "Simplicity",
                                                        desc: "We believe in making complex tasks simple.",
                                                        icon: (
                                                            <CheckCircle className="h-5 w-5 text-blue-600" />
                                                        ),
                                                    },
                                                    {
                                                        label: "Innovation",
                                                        desc: "We continuously improve our platform with cutting-edge technology.",
                                                        icon: (
                                                            <CheckCircle className="h-5 w-5 text-indigo-600" />
                                                        ),
                                                    },
                                                    {
                                                        label: "Customer-Centric",
                                                        desc: "Our customers' success is our success.",
                                                        icon: (
                                                            <CheckCircle className="h-5 w-5 text-purple-600" />
                                                        ),
                                                    },
                                                    {
                                                        label: "Transparency",
                                                        desc: "We maintain open and honest communication.",
                                                        icon: (
                                                            <CheckCircle className="h-5 w-5 text-blue-600" />
                                                        ),
                                                    },
                                                    {
                                                        label: "Security",
                                                        desc: "We prioritize the protection of our customers' data.",
                                                        icon: (
                                                            <CheckCircle className="h-5 w-5 text-indigo-600" />
                                                        ),
                                                    },
                                                ].map((value, index) => (
                                                    <motion.div
                                                        key={index}
                                                        variants={itemVariants}
                                                        className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-start">
                                                            <div className="mr-3 mt-0.5">
                                                                {value.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-1">
                                                                    {
                                                                        value.label
                                                                    }
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {value.desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right Content - Contact Info */}
                                    <div className="lg:col-span-1">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5 }}
                                            viewport={{ once: true }}
                                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-md mb-6"
                                        >
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                <Mail
                                                    size={18}
                                                    className="mr-2 text-blue-600"
                                                />
                                                Get In Touch
                                            </h3>

                                            <div className="space-y-4">
                                                <a
                                                    href="mailto:info@bimocrm.com"
                                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    <Mail
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    <span>
                                                        info@bimocrm.com
                                                    </span>
                                                </a>
                                                <a
                                                    href="tel:+6281234567890"
                                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    <Phone
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    <span>
                                                        +62 812-3456-7890
                                                    </span>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors group"
                                                >
                                                    <span className="flex items-center">
                                                        <ExternalLink
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                        <span>
                                                            Visit Our Website
                                                        </span>
                                                    </span>
                                                    <ChevronRight
                                                        size={16}
                                                        className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                                    />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors group"
                                                >
                                                    <span className="flex items-center">
                                                        <MapPin
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                        <span>
                                                            Jakarta, Indonesia
                                                        </span>
                                                    </span>
                                                    <ChevronRight
                                                        size={16}
                                                        className="text-gray-400 group-hover:translate-x-1 transition-transform"
                                                    />
                                                </a>
                                            </div>

                                            <div className="mt-6">
                                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
                                                    Schedule a Demo
                                                </button>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.1,
                                            }}
                                            viewport={{ once: true }}
                                            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-md"
                                        >
                                            <h4 className="text-lg font-bold text-gray-900 mb-4">
                                                Connect With Us
                                            </h4>
                                            <div className="flex space-x-3">
                                                <a
                                                    href="#"
                                                    className="bg-white p-3 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all hover:scale-110"
                                                >
                                                    <Twitter size={20} />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="bg-white p-3 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all hover:scale-110"
                                                >
                                                    <Linkedin size={20} />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="bg-white p-3 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all hover:scale-110"
                                                >
                                                    <Github size={20} />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="bg-white p-3 rounded-full shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all hover:scale-110"
                                                >
                                                    <Instagram size={20} />
                                                </a>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-blue-100">
                                                <h4 className="text-lg font-bold text-gray-900 mb-4">
                                                    Office Hours
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Monday - Friday
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            9:00 - 17:00
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Saturday
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            9:00 - 14:00
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">
                                                            Sunday
                                                        </span>
                                                        <span className="font-medium text-gray-900">
                                                            Closed
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Company Timeline Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Our Journey
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                From our founding to today, we've been on a
                                mission to transform how businesses manage
                                customer relationships.
                            </p>
                        </motion.div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-indigo-300 rounded-full"></div>

                            {/* Timeline items */}
                            <div className="relative z-10">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className={`flex items-center mb-16 last:mb-0 ${
                                            index % 2 === 0
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                        }`}
                                    >
                                        <div
                                            className={`w-1/2 ${
                                                index % 2 === 0
                                                    ? "pr-12 text-right"
                                                    : "pl-12"
                                            }`}
                                        >
                                            <div
                                                className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-2 ${
                                                    index % 2 === 0
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {milestone.year}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {milestone.description}
                                            </p>
                                        </div>

                                        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    index % 2 === 0
                                                        ? "bg-indigo-500 text-white"
                                                        : "bg-blue-500 text-white"
                                                }`}
                                            >
                                                <milestone.icon size={20} />
                                            </div>
                                        </div>

                                        <div className="w-1/2"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Key Features
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Our platform is designed to help you manage
                                customer relationships with ease and efficiency.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Contact Management",
                                    description:
                                        "Easily organize and manage your customer contacts in one place",
                                    icon: "👥",
                                    color: "from-blue-500 to-blue-600",
                                },
                                {
                                    title: "Task Automation",
                                    description:
                                        "Automate repetitive tasks to save time and increase productivity",
                                    icon: "⚙️",
                                    color: "from-indigo-500 to-indigo-600",
                                },
                                {
                                    title: "Reporting & Analytics",
                                    description:
                                        "Gain valuable insights with comprehensive reporting tools",
                                    icon: "📊",
                                    color: "from-purple-500 to-purple-600",
                                },
                                {
                                    title: "Email Integration",
                                    description:
                                        "Seamlessly integrate with your email workflow",
                                    icon: "📧",
                                    color: "from-blue-500 to-indigo-600",
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 group"
                                >
                                    <div
                                        className={`h-2 bg-gradient-to-r ${feature.color}`}
                                    ></div>
                                    <div className="p-6">
                                        <div className="text-4xl mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                What Our Customers Say
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Don't just take our word for it. Here's what
                                businesses using our CRM have to say.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <div className="overflow-hidden">
                                <div className="relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTestimonial}
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.5 }}
                                            className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <div className="mb-6 md:mb-0 md:mr-10 flex-shrink-0">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                        <img
                                                            src={
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].avatar ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].author
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex mb-4">
                                                        {[
                                                            ...Array(
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].rating
                                                            ),
                                                        ].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={20}
                                                                className="text-yellow-400 fill-yellow-400"
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="relative">
                                                        <Quote
                                                            size={40}
                                                            className="absolute -top-2 -left-2 text-blue-100"
                                                        />
                                                        <p className="text-lg text-gray-700 italic mb-6 relative z-10">
                                                            "
                                                            {
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].quote
                                                            }
                                                            "
                                                        </p>
                                                        <Quote
                                                            size={40}
                                                            className="absolute -bottom-6 right-0 text-blue-100 transform rotate-180"
                                                        />
                                                    </div>

                                                    <div className="mt-8">
                                                        <h4 className="text-xl font-bold text-gray-900">
                                                            {
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].author
                                                            }
                                                        </h4>
                                                        <p className="text-blue-600">
                                                            {
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].position
                                                            }
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            {
                                                                testimonials[
                                                                    activeTestimonial
                                                                ].company
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Testimonial navigation */}
                            <div className="flex justify-center mt-8 space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveTestimonial(index)
                                        }
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            activeTestimonial === index
                                                ? "bg-blue-600 w-8"
                                                : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        aria-label={`View testimonial ${
                                            index + 1
                                        }`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Our Leadership Team
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Meet the talented individuals who are driving
                                our vision forward.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Bima Sakti",
                                    position: "Founder & CEO",
                                    bio: "Experienced entrepreneur with a passion for creating tools that help businesses succeed.",
                                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                                    social: {
                                        linkedin: "#",
                                        twitter: "#",
                                    },
                                },
                                {
                                    name: "Sarah Johnson",
                                    position: "CTO",
                                    bio: "Tech innovator with over 10 years of experience building scalable software solutions.",
                                    image: "https://randomuser.me/api/portraits/women/44.jpg",
                                    social: {
                                        linkedin: "#",
                                        twitter: "#",
                                        github: "#",
                                    },
                                },
                                {
                                    name: "Michael Wong",
                                    position: "Head of Design",
                                    bio: "UI/UX specialist focused on creating intuitive and delightful user experiences.",
                                    image: "https://randomuser.me/api/portraits/men/67.jpg",
                                    social: {
                                        linkedin: "#",
                                        twitter: "#",
                                        instagram: "#",
                                    },
                                },
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden group"
                                >
                                    <div className="relative overflow-hidden">
                                        <div className="aspect-w-1 aspect-h-1">
                                            <img
                                                src={
                                                    member.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                            <div className="p-6 w-full">
                                                <div className="flex justify-center space-x-3">
                                                    {member.social.linkedin && (
                                                        <a
                                                            href={
                                                                member.social
                                                                    .linkedin
                                                            }
                                                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors"
                                                        >
                                                            <Linkedin
                                                                size={18}
                                                            />
                                                        </a>
                                                    )}
                                                    {member.social.twitter && (
                                                        <a
                                                            href={
                                                                member.social
                                                                    .twitter
                                                            }
                                                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white hover:text-blue-400 transition-colors"
                                                        >
                                                            <Twitter
                                                                size={18}
                                                            />
                                                        </a>
                                                    )}
                                                    {member.social.github && (
                                                        <a
                                                            href={
                                                                member.social
                                                                    .github
                                                            }
                                                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white hover:text-gray-800 transition-colors"
                                                        >
                                                            <Github size={18} />
                                                        </a>
                                                    )}
                                                    {member.social
                                                        .instagram && (
                                                        <a
                                                            href={
                                                                member.social
                                                                    .instagram
                                                            }
                                                            className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white hover:text-pink-600 transition-colors"
                                                        >
                                                            <Instagram
                                                                size={18}
                                                            />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-600 text-sm font-medium mb-3">
                                            {member.position}
                                        </p>
                                        <p className="text-gray-600">
                                            {member.bio}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden relative"
                        >
                            {/* Background decoration */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                                <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                            </div>

                            <div className="relative z-10 px-6 py-12 sm:p-16 text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-3xl sm:text-4xl font-bold text-white mb-4"
                                >
                                    Ready to transform your customer
                                    relationships?
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg"
                                >
                                    Start your 14-day free trial today and
                                    discover how PT SMART CRM can help your
                                    business grow.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                                >
                                    <a
                                        href={route("register")}
                                        className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Get Started Free
                                        <ArrowRight
                                            size={18}
                                            className="ml-2"
                                        />
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex justify-center items-center px-8 py-4 border border-white border-opacity-30 text-base font-medium rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                                    >
                                        Contact Sales
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </GuestLayout>
    );
};

export default AboutPage;
