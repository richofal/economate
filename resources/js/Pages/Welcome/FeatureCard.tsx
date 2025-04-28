import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    accentColor: string;
    lightColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    accentColor,
    lightColor,
}) => {
    return (
        <motion.div
            className="group relative h-full bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {/* Dynamic background effect */}
            <div
                className={`absolute inset-0 ${accentColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            ></div>

            {/* Decorative elements */}
            <div
                className={`absolute top-0 right-0 w-20 h-20 ${accentColor} opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full`}
            ></div>
            <div
                className={`absolute -bottom-12 -left-12 w-32 h-32 ${lightColor} opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-full`}
            ></div>

            {/* Card content */}
            <div className="relative z-10">
                {/* Icon with enhanced animation */}
                <div
                    className={`flex items-center justify-center h-16 w-16 ${accentColor} rounded-xl mb-7 text-white shadow-md transform origin-center group-hover:scale-110 transition-all duration-300 ease-out`}
                >
                    <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {icon}
                    </motion.div>
                </div>

                {/* Text content with dynamic hover state */}
                <h3
                    className={`text-xl font-bold mb-4 group-hover:text-${accentColor
                        .replace("bg-", "")
                        .replace(
                            "-600",
                            "-700"
                        )} transition-colors duration-300`}
                >
                    {title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6">
                    {description}
                </p>
            </div>

            {/* Bottom accent line with animation */}
            <div
                className={`absolute bottom-0 left-0 h-1 w-0 ${accentColor} group-hover:w-full transition-all duration-500 ease-out`}
            ></div>
        </motion.div>
    );
};

export default FeatureCard;
