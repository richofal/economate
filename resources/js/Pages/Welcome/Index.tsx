// HomePage.tsx
import React, { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import Hero from "@/Components/Hero";
import FinancialServices from "../../Components/FinancialServices";
import TryItNow from "@/Components/TryItNow";
import { usePage } from "@inertiajs/react";

const WelcomePage: React.FC = () => {
    const { url } = usePage();

    useEffect(() => {
        // Check if URL has hash
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [url]);
    return (
        <GuestLayout pageTitle="Welcome">
            <Hero />
            <FinancialServices />
            <TryItNow />
        </GuestLayout>
    );
};

export default WelcomePage;
