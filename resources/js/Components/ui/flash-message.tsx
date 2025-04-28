import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const flashMessageVariants = cva(
    "fixed top-4 right-4 z-50 p-4 rounded-md shadow-md flex items-center gap-3 max-w-md transition-all duration-300 ease-in-out",
    {
        variants: {
            variant: {
                success: "bg-green-50 text-green-800 border border-green-200",
                error: "bg-red-50 text-red-800 border border-red-200",
                warning: "bg-amber-50 text-amber-800 border border-amber-200",
                info: "bg-blue-50 text-blue-800 border border-blue-200",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

export interface FlashMessageProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof flashMessageVariants> {
    message: string;
    duration?: number;
    onClose?: () => void;
}

export function FlashMessage({
    className,
    variant,
    message,
    duration = 5000,
    onClose,
    ...props
}: FlashMessageProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    // Select the appropriate icon based on the variant
    const Icon =
        variant === "success"
            ? CheckCircle
            : variant === "error"
            ? AlertCircle
            : variant === "warning"
            ? AlertTriangle
            : Info;

    return (
        <div
            className={cn(
                flashMessageVariants({ variant }),
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0",
                className
            )}
            {...props}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">{message}</div>
            <button
                onClick={handleClose}
                className="ml-auto flex-shrink-0 rounded-full p-1 hover:bg-white/20"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </button>
        </div>
    );
}
