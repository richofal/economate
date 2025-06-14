import React from "react";

interface DefaultUserImageProps {
    name: string;
    className?: string;
}

const DefaultUserImage = ({ name, className = "" }: DefaultUserImageProps) => {
    // Get initials from name
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    // Generate a consistent color based on the name
    const generateColor = (name: string) => {
        const colors = [
            "bg-blue-100 text-blue-800",
            "bg-green-100 text-green-800",
            "bg-yellow-100 text-yellow-800",
            "bg-purple-100 text-purple-800",
            "bg-pink-100 text-pink-800",
            "bg-indigo-100 text-indigo-800",
            "bg-red-100 text-red-800",
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    const colorClass = generateColor(name);

    return (
        <div
            className={`flex items-center justify-center w-full h-full ${colorClass} ${className}`}
        >
            <span className="text-sm font-medium">{initials}</span>
        </div>
    );
};

export default DefaultUserImage;
