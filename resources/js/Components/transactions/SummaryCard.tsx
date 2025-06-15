import { formatCurrency } from "@/lib/utils";
import React from "react";

interface SummaryCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    colorClass: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    colorClass,
}) => {
    return (
        <div
            className={`bg-white shadow rounded-lg p-4 border-l-4 ${colorClass}`}
        >
            <div className="flex items-center">
                <div
                    className={`flex-shrink-0 rounded-md p-2 bg-opacity-20 ${colorClass.replace(
                        "border-",
                        "bg-"
                    )}`}
                >
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">
                        {title}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                        {formatCurrency(value)}
                    </p>
                </div>
            </div>
        </div>
    );
};
