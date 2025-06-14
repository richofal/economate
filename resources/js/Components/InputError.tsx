import React from "react";

interface InputErrorProps {
    message?: string;
    className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, className = "" }) => {
    if (!message) {
        return null;
    }

    return <div className={`text-sm text-red-600 ${className}`}>{message}</div>;
};

export default InputError;
