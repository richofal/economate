import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, Calendar, DollarSign, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const BudgetPlanCreate = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        total_budget: "",
    });

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("budgetPlans.store"), {
            onSuccess: () => {
                reset();
            },
        });
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
        <AuthenticatedLayout title="Create Budget Plan">
            <Head title="Create Budget Plan" />

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
                            Create New Budget Plan
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Set up a new budget plan to track your expenses over
                            a specific period.
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
                                            min={today}
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
                                            min={data.start_date || today}
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

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <Link
                                    href={route("budgetPlans.index")}
                                    className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-gray-900 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Creating..."
                                        : "Create Budget Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BudgetPlanCreate;
