import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
        return "";
    }
    try {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "";
        }
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};

export const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(amount));
};

export const parseCurrency = (currencyString: string): string => {
    return currencyString.replace(/[^\d]/g, "");
};


