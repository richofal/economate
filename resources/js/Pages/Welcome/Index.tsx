// HomePage.tsx
import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import Hero from "@/Components/Hero";
import FinancialServices from "../../Components/FinancialServices";
import TryItNow from "@/Components/TryItNow";

const WelcomePage: React.FC = () => {
    return (
        <GuestLayout>
            <Hero />
            <FinancialServices />
            <TryItNow />
        </GuestLayout>
    );
};

export default WelcomePage;
