import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BudgetItem, BudgetPlan, PageProps } from "@/types";
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    PieChart,
    Plus,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreateBudgetItemModal } from "./Partials/CreateBudgetItemModal";
import { Button } from "@/Components/ui/button";
import { EditBudgetItemModal } from "./Partials/EditBudgetItemModal";
import { DeleteBudgetItemModal } from "./Partials/DeleteBudgetItemModal";

interface ShowBudgetPlanPageProps extends PageProps {
    budgetPlan: BudgetPlan;
}

const BudgetPlansShow = () => {
    const { budgetPlan } = usePage<ShowBudgetPlanPageProps>().props;
    const [modalState, setModalState] = useState<{
        mode: "create" | "edit" | "delete" | "none";
        item: BudgetItem | null;
    }>({
        mode: "none",
        item: null,
    });

    const getDaysRemaining = () => {
        const endDate = new Date(budgetPlan.end_date);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Calculate days elapsed
    const getDaysElapsed = () => {
        const startDate = new Date(budgetPlan.start_date);
        const now = new Date();
        const diffTime = now.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    // Calculate total duration
    const getTotalDuration = () => {
        const startDate = new Date(budgetPlan.start_date);
        const endDate = new Date(budgetPlan.end_date);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Calculate budget progress
    const getBudgetProgress = () => {
        if (!budgetPlan.budget_items || budgetPlan.budget_items.length === 0) {
            return 0;
        }

        const totalSpent = budgetPlan.budget_items.reduce((sum, item) => {
            if (item.status === "completed" || item.status === "in_progress") {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);

        const totalBudget = parseFloat(budgetPlan.total_budget);
        return Math.min(100, (totalSpent / totalBudget) * 100);
    };

    // Calculate remaining budget
    const getRemainingBudget = () => {
        if (!budgetPlan.budget_items) {
            return parseFloat(budgetPlan.total_budget);
        }

        const totalSpent = budgetPlan.budget_items.reduce((sum, item) => {
            if (item.status === "completed") {
                return sum + parseFloat(item.amount);
            }
            return sum;
        }, 0);

        return parseFloat(budgetPlan.total_budget) - totalSpent;
    };

    // Calculate status of budget plan
    const getBudgetStatus = () => {
        const daysRemaining = getDaysRemaining();
        const remainingBudget = getRemainingBudget();

        if (daysRemaining < 0) {
            return "expired";
        }

        if (remainingBudget <= 0) {
            return "depleted";
        }

        return "active";
    };

    // Group budget items by status
    const groupedBudgetItems = React.useMemo(() => {
        const groups: Record<string, BudgetItem[]> = {
            completed: [],
            in_progress: [],
            planned: [],
        };

        if (budgetPlan.budget_items) {
            budgetPlan.budget_items.forEach((item) => {
                if (groups[item.status]) {
                    groups[item.status].push(item);
                } else {
                    console.warn(
                        `Unexpected budget item status: ${item.status}`
                    );
                    groups.planned.push(item);
                }
            });
        }

        return groups;
    }, [budgetPlan.budget_items]);

    const openModal = (
        mode: "create" | "edit" | "delete",
        item: BudgetItem | null = null
    ) => {
        setModalState({ mode, item });
    };

    const closeModal = () => {
        setModalState({ mode: "none", item: null });
    };

    // Render status badge
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                    </span>
                );
            case "expired":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Expired
                    </span>
                );
            case "depleted":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Depleted
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout title="Budget Plan Details">
            <Head title={`Budget Plan: ${budgetPlan.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb and actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <Link
                                    href={route("budgetPlans.index")}
                                    className="flex items-center hover:text-blue-600"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Budget Plans
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <h1 className="text-2xl font-semibold text-gray-900 mr-3">
                                    {budgetPlan.name}
                                </h1>
                                {renderStatusBadge(getBudgetStatus())}
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => openModal("create")}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Item Anggaran
                            </Button>
                        </div>
                    </div>

                    {/* Description */}
                    {budgetPlan.description && (
                        <div className="bg-white shadow-sm rounded-lg mb-6 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">
                                Description
                            </h2>
                            <p className="text-gray-600">
                                {budgetPlan.description}
                            </p>
                        </div>
                    )}

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Total Budget */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-blue-100">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Total Budget
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(
                                            budgetPlan.total_budget
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Remaining Budget */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-green-100">
                                    <PieChart className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Remaining
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(getRemainingBudget())}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-purple-100">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Duration
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {getTotalDuration()} days
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Days Remaining */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 rounded-md bg-amber-100">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        {getDaysRemaining() >= 0
                                            ? "Days Remaining"
                                            : "Expired"}
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {getDaysRemaining() >= 0
                                            ? `${getDaysRemaining()} days`
                                            : `${Math.abs(
                                                  getDaysRemaining()
                                              )} days ago`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress and timeline */}
                    <div className="bg-white shadow-sm rounded-lg mb-6 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Budget Progress
                        </h2>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-medium text-gray-700">
                                    {formatCurrency(getRemainingBudget())}{" "}
                                    remaining
                                </div>
                                <div className="text-sm font-medium text-gray-700">
                                    {getBudgetProgress().toFixed(1)}%
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${
                                        getBudgetProgress() > 90
                                            ? "bg-red-600"
                                            : getBudgetProgress() > 70
                                            ? "bg-yellow-600"
                                            : "bg-green-600"
                                    }`}
                                    style={{ width: `${getBudgetProgress()}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Timeline
                            </h3>
                            <div className="flex items-center">
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(budgetPlan.start_date)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(budgetPlan.end_date)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                                        <div
                                            className="absolute h-4 w-4 bg-blue-600 rounded-full top-1/2 transform -translate-y-1/2"
                                            style={{
                                                left: `${Math.min(
                                                    100,
                                                    (getDaysElapsed() /
                                                        getTotalDuration()) *
                                                        100
                                                )}%`,
                                            }}
                                        ></div>
                                        <div
                                            className="h-2.5 rounded-l-full bg-blue-600"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    (getDaysElapsed() /
                                                        getTotalDuration()) *
                                                        100
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-center mt-1 text-gray-500">
                                        Today • Day {getDaysElapsed()} of{" "}
                                        {getTotalDuration()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {budgetPlan.user && (
                            <div className="mt-6 flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                Created by {budgetPlan.user.name}
                            </div>
                        )}
                    </div>

                    {/* Budget Items */}
                    <div className="bg-white shadow-sm rounded-lg mb-6 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Budget Items
                            </h2>
                        </div>

                        {/* No budget items */}
                        {(!budgetPlan.budget_items ||
                            budgetPlan.budget_items.length === 0) && (
                            <div className="py-8 text-center">
                                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
                                    <DollarSign className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="mt-4 text-base font-medium text-gray-900">
                                    No budget items yet
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Start adding items to track your expenses
                                    against this budget.
                                </p>
                                <div className="mt-6">
                                    <Button
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() => openModal("create")}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Item Anggaran
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Budget items list */}
                        {budgetPlan.budget_items &&
                            budgetPlan.budget_items.length > 0 && (
                                <div>
                                    {/* Completed Items */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                                            Completed Items (
                                            {groupedBudgetItems.completed
                                                ?.length || 0}
                                            )
                                        </h3>
                                        {groupedBudgetItems.completed?.length >
                                        0 ? (
                                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-100">
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
                                                                Description
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th className="px-6 py-3 text-center">
                                                                Aksi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {groupedBudgetItems.completed.map(
                                                            (item) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {item.description ||
                                                                            "-"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                        {formatCurrency(
                                                                            item.amount
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "edit",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "delete",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-red-500"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                        <tr className="bg-gray-100">
                                                            <td
                                                                colSpan={2}
                                                                className="px-6 py-3 text-sm font-medium text-gray-900"
                                                            >
                                                                Total Completed
                                                            </td>
                                                            <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                                                                {formatCurrency(
                                                                    groupedBudgetItems.completed.reduce(
                                                                        (
                                                                            sum,
                                                                            item
                                                                        ) =>
                                                                            sum +
                                                                            parseFloat(
                                                                                item.amount
                                                                            ),
                                                                        0
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No completed items recorded yet.
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <Clock className="h-4 w-4 text-yellow-500 mr-1.5" />
                                            In Progress Items (
                                            {groupedBudgetItems.in_progress
                                                ?.length || 0}
                                            )
                                        </h3>
                                        {groupedBudgetItems.in_progress
                                            ?.length > 0 ? (
                                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                                {/* Same table structure as completed items */}
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    {/* Table headers similar to above */}
                                                    <thead className="bg-gray-100">
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
                                                                Description
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th className="px-6 py-3 text-center">
                                                                Aksi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {/* Table rows similar to above */}
                                                        {groupedBudgetItems.in_progress.map(
                                                            (item) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {item.description ||
                                                                            "-"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                        {formatCurrency(
                                                                            item.amount
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "edit",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "delete",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-red-500"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                        <tr className="bg-gray-100">
                                                            <td
                                                                colSpan={2}
                                                                className="px-6 py-3 text-sm font-medium text-gray-900"
                                                            >
                                                                Total In
                                                                Progress
                                                            </td>
                                                            <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                                                                {formatCurrency(
                                                                    groupedBudgetItems.in_progress.reduce(
                                                                        (
                                                                            sum,
                                                                            item
                                                                        ) =>
                                                                            sum +
                                                                            parseFloat(
                                                                                item.amount
                                                                            ),
                                                                        0
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No in-progress items recorded.
                                            </p>
                                        )}
                                    </div>
                                    {/* Planned Items */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                                            Planned Items (
                                            {groupedBudgetItems.planned.length})
                                        </h3>
                                        {groupedBudgetItems.planned.length >
                                        0 ? (
                                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-100">
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
                                                                Description
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th className="px-6 py-3 text-center">
                                                                Aksi
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {groupedBudgetItems.planned.map(
                                                            (item) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {item.description ||
                                                                            "-"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                        {formatCurrency(
                                                                            item.amount
                                                                        )}
                                                                    </td>

                                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "edit",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                openModal(
                                                                                    "delete",
                                                                                    item
                                                                                )
                                                                            }
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 text-red-500"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                        <tr className="bg-gray-100">
                                                            <td
                                                                colSpan={2}
                                                                className="px-6 py-3 text-sm font-medium text-gray-900"
                                                            >
                                                                Total Planned
                                                            </td>
                                                            <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">
                                                                {formatCurrency(
                                                                    groupedBudgetItems.planned.reduce(
                                                                        (
                                                                            sum,
                                                                            item
                                                                        ) =>
                                                                            sum +
                                                                            parseFloat(
                                                                                item.amount
                                                                            ),
                                                                        0
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No planned items recorded.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            <CreateBudgetItemModal
                isOpen={modalState.mode === "create"}
                onClose={closeModal}
                budgetPlanId={budgetPlan.id}
            />
            <EditBudgetItemModal
                isOpen={modalState.mode === "edit"}
                onClose={closeModal}
                budgetItem={modalState.item}
            />
            <DeleteBudgetItemModal
                isOpen={modalState.mode === "delete"}
                onClose={closeModal}
                budgetItem={modalState.item}
            />
        </AuthenticatedLayout>
    );
};

export default BudgetPlansShow;
