import { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { BudgetPlan, PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Calendar,
    DollarSign,
    PlusCircle,
    Search,
    Clock,
    Filter,
    Eye,
    EditIcon,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import EmptyState from "@/Components/EmptyState";

interface BudgetPlansIndexProps extends PageProps {
    budgetPlans: BudgetPlan[];
    isAdmin: boolean;
}

export default function BudgetPlansIndex() {
    const { budgetPlans, isAdmin, auth } =
        usePage<BudgetPlansIndexProps>().props;
    const [searchTerm, setSearchTerm] = useState("");

    // Filter budget plans based on search term and status
    const filteredBudgetPlans = budgetPlans.filter((plan) => {
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const now = new Date();
        const endDate = new Date(plan.end_date);

        return matchesSearch;
    });

    // Calculate total budget across all plans
    const totalBudget = filteredBudgetPlans.reduce(
        (sum, plan) => sum + parseFloat(plan.total_budget),
        0
    );

    // Calculate days remaining
    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Determine if a plan is active
    const isPlanActive = (endDate: string) => {
        return getDaysRemaining(endDate) >= 0;
    };

    return (
        <AuthenticatedLayout title="Budget Plans">
            <Head title="Budget Plans" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header with stats */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Budget Plans
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {isAdmin
                                ? "Manage and track all users' budget plans"
                                : "Manage and track your budget plans"}
                        </p>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Total Budget
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(totalBudget)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-green-50">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Active Plans
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {
                                            filteredBudgetPlans.filter((plan) =>
                                                isPlanActive(plan.end_date)
                                            ).length
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-purple-50">
                                    <Clock className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Expired Plans
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {
                                            filteredBudgetPlans.filter(
                                                (plan) =>
                                                    !isPlanActive(plan.end_date)
                                            ).length
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-grow max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search budget plans..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("budgetPlans.create")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create Plan
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Budget Plans Table */}
                    <div className="bg-white shadow-sm overflow-hidden rounded-xl border border-gray-200">
                        {filteredBudgetPlans.length === 0 ? (
                            <EmptyState
                                title="No budget plans found"
                                description={
                                    searchTerm
                                        ? "Try adjusting your search or filters"
                                        : "Get started by creating your first budget plan"
                                }
                                icon={
                                    <Calendar className="h-12 w-12 text-gray-400" />
                                }
                                action={
                                    !searchTerm ? (
                                        <Link
                                            href={route("budgetPlans.create")}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Create Budget Plan
                                        </Link>
                                    ) : null
                                }
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Period
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Total Budget
                                            </th>
                                            {isAdmin && (
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Created By
                                                </th>
                                            )}
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBudgetPlans.map((plan) => {
                                            const daysRemaining =
                                                getDaysRemaining(plan.end_date);
                                            const isActive = isPlanActive(
                                                plan.end_date
                                            );

                                            return (
                                                <tr
                                                    key={plan.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {plan.name}
                                                            </div>
                                                        </div>
                                                        {plan.description && (
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {
                                                                    plan.description
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {formatDate(
                                                                    plan.start_date
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    plan.end_date
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            <Clock className="inline-block mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {daysRemaining >
                                                                0
                                                                    ? `${daysRemaining} days remaining`
                                                                    : `Expired ${Math.abs(
                                                                          daysRemaining
                                                                      )} days ago`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>
                                                                {formatCurrency(
                                                                    parseFloat(
                                                                        plan.total_budget
                                                                    )
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {plan.user?.name ||
                                                                "—"}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-center space-x-2">
                                                            <Link
                                                                href={route(
                                                                    "budgetPlans.show",
                                                                    plan.id
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "budgetPlans.edit",
                                                                    plan.id
                                                                )}
                                                                className="text-amber-600 hover:text-amber-900 p-1 rounded-md hover:bg-amber-50"
                                                                title="Edit"
                                                            >
                                                                <EditIcon className="h-5 w-5" />
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "budgetPlans.destroy",
                                                                    plan.id
                                                                )}
                                                                method="delete"
                                                                as="button"
                                                                type="button"
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                                title="Delete"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    if (
                                                                        confirm(
                                                                            "Are you sure you want to delete this budget plan?"
                                                                        )
                                                                    ) {
                                                                        // Use Inertia to delete
                                                                        window.location.href =
                                                                            route(
                                                                                "budgetPlans.destroy",
                                                                                plan.id
                                                                            );
                                                                    }
                                                                }}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    <line
                                                                        x1="10"
                                                                        y1="11"
                                                                        x2="10"
                                                                        y2="17"
                                                                    ></line>
                                                                    <line
                                                                        x1="14"
                                                                        y1="11"
                                                                        x2="14"
                                                                        y2="17"
                                                                    ></line>
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
