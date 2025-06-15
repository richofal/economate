import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, Calendar, DollarSign, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BudgetPlan, PageProps } from "@/types";

interface EditBudgetPlanProps extends PageProps {
    budgetPlan: BudgetPlan;
}

const BudgetPlanEdit = () => {
    const { budgetPlan } = usePage<EditBudgetPlanProps>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: budgetPlan.name || "",
        description: budgetPlan.description || "",
        start_date: budgetPlan.start_date || "",
        end_date: budgetPlan.end_date || "",
        total_budget: budgetPlan.total_budget || "",
    });

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("budgetPlans.update", budgetPlan.id));
    };

    const getDuration = () => {
        if (!data.start_date || !data.end_date) return null;

        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    return (
        <AuthenticatedLayout title="Edit Budget Plan">
            <Head title={`Edit: ${budgetPlan.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb and title */}
                    <div className="mb-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Link
                                href={route("budgetPlans.index")}
                                className="flex items-center hover:text-blue-600"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Budget Plans
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Edit Budget Plan
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Update the details of your budget plan.
                        </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Plan Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    placeholder="Monthly Budget June 2025"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Monthly budget to track personal expenses"
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Date fields in a grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Start Date */}
                                <div>
                                    <label
                                        htmlFor="start_date"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Start Date
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="start_date"
                                            type="date"
                                            name="start_date"
                                            value={data.start_date}
                                            className="mt-1 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    {errors.start_date && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>
                                {/* End Date */}
                                <div>
                                    <label
                                        htmlFor="end_date"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        End Date
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="end_date"
                                            type="date"
                                            name="end_date"
                                            value={data.end_date}
                                            className="mt-1 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            min={data.start_date}
                                            required
                                        />
                                    </div>
                                    {errors.end_date && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Total Budget */}
                            <div>
                                <label
                                    htmlFor="total_budget"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Total Budget
                                </label>
                                <div className="relative mt-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="total_budget"
                                        type="number"
                                        name="total_budget"
                                        value={data.total_budget}
                                        className="mt-1 block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        onChange={(e) =>
                                            setData(
                                                "total_budget",
                                                e.target.value
                                            )
                                        }
                                        min="0"
                                        step="0.01"
                                        required
                                        placeholder="5000000"
                                    />
                                </div>
                                {errors.total_budget && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.total_budget}
                                    </p>
                                )}
                            </div>

                            {/* Budget Information */}
                            {getDuration() && (
                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Info className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="ml-3 text-sm text-blue-700">
                                            <p>
                                                This budget plan will cover a
                                                period of{" "}
                                                <span className="font-medium">
                                                    {getDuration()} days
                                                </span>
                                                .
                                            </p>
                                            {data.total_budget && (
                                                <p className="mt-1">
                                                    Your average daily budget
                                                    will be{" "}
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            parseFloat(
                                                                data.total_budget
                                                            ) / getDuration()!
                                                        )}
                                                    </span>
                                                    .
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Warning about existing budget items if applicable */}
                            {budgetPlan.budget_items &&
                                budgetPlan.budget_items.length > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <Info className="h-5 w-5 text-amber-400" />
                                            </div>
                                            <div className="ml-3 text-sm text-amber-700">
                                                <p>
                                                    This budget plan has{" "}
                                                    {
                                                        budgetPlan.budget_items
                                                            .length
                                                    }{" "}
                                                    budget items associated with
                                                    it. Changes to the total
                                                    budget may affect your
                                                    budget planning.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route(
                                        "budgetPlans.show",
                                        budgetPlan.id
                                    )}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-gray-900 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BudgetPlanEdit;
