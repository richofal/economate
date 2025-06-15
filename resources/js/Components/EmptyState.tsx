import React, { ReactNode } from "react";

interface EmptyStateProps {
    /**
     * Title displayed in the empty state
     */
    title: string;

    /**
     * Description text explaining the empty state
     */
    description?: string;

    /**
     * Icon to display in the empty state
     */
    icon?: ReactNode;

    /**
     * Action element (typically a button) to help users move forward
     */
    action?: ReactNode;

    /**
     * Optional additional CSS classes
     */
    className?: string;
}

/**
 * EmptyState component for displaying when no content is available
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    action,
    className = "",
}) => {
    return (
        <div className={`py-12 ${className}`}>
            <div className="text-center">
                {icon && (
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        {icon}
                    </div>
                )}
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {title}
                </h3>
                {description && (
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                        {description}
                    </p>
                )}
                {action && <div className="mt-6">{action}</div>}
            </div>
        </div>
    );
};

export default EmptyState;
