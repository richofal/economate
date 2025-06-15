import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, SplitBill } from "@/types";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    ArrowLeftCircle,
    Receipt,
    Pizza,
    Users,
    DollarSign,
    User as UserIcon,
    Calendar,
    Divide,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ShowSplitBillPageProps extends PageProps {
    splitBill: SplitBill;
}

const SplitBillShow: React.FC = () => {
    const { splitBill, auth } = usePage<ShowSplitBillPageProps>().props;

    const totalAmount = parseFloat(splitBill.total_amount);
    const totalOwed =
        splitBill.participants?.reduce(
            (sum, p) => sum + parseFloat(p.amount_owed || "0"),
            0
        ) || 0;

    const splitPerPerson = splitBill.participants?.length
        ? totalAmount / splitBill.participants.length
        : 0;

    const isCreator = auth.user.id === splitBill.user.id;

    return (
        <AuthenticatedLayout title={`Split Bill: ${splitBill.title}`}>
            <Head title={`Split Bill: ${splitBill.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route("splitBills.index")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                    >
                        <ArrowLeftCircle className="w-4 h-4" />
                        Kembali ke Daftar Split Bill
                    </Link>

                    <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8 border border-gray-100">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-600 rounded-lg mr-4">
                                        <Receipt className="h-6 w-6 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {splitBill.title}
                                    </h1>
                                </div>
                                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {formatDate(splitBill.created_at || "")}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        {splitBill.user.name}{" "}
                                        {isCreator && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2">
                                                Anda
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-600">
                                        Total Tagihan
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(totalAmount)}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Divide className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-600">
                                        Per Orang
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(splitPerPerson)}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-600">
                                        Peserta
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {splitBill.participants?.length || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                                <div className="px-6 py-5 border-b border-gray-200 flex items-center bg-gradient-to-r from-emerald-50 to-emerald-100">
                                    <div className="p-2 bg-emerald-600 rounded-lg mr-3">
                                        <Pizza className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Daftar Item
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Item
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Harga
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Jumlah
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {splitBill.items?.map((item) => {
                                                const price = parseFloat(
                                                    item.price
                                                );
                                                const quantity =
                                                    item.quantity || 1;
                                                const subtotal =
                                                    price * quantity;

                                                return (
                                                    <tr
                                                        key={item.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="text-sm text-gray-900">
                                                                {formatCurrency(
                                                                    price
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="text-sm text-gray-500">
                                                                {quantity}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    subtotal
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-50">
                                                <th
                                                    scope="row"
                                                    colSpan={3}
                                                    className="px-6 py-3 text-right text-sm font-bold text-gray-700"
                                                >
                                                    Total
                                                </th>
                                                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                                                    {formatCurrency(
                                                        totalAmount
                                                    )}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                                <div className="px-6 py-5 border-b border-gray-200 flex items-center bg-gradient-to-r from-violet-50 to-violet-100">
                                    <div className="p-2 bg-violet-600 rounded-lg mr-3">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Peserta
                                    </h2>
                                </div>

                                <div>
                                    <ul className="divide-y divide-gray-200">
                                        {splitBill.participants?.map(
                                            (participant) => {
                                                const amountOwed = parseFloat(
                                                    participant.amount_owed ||
                                                        "0"
                                                );

                                                return (
                                                    <li
                                                        key={participant.id}
                                                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold">
                                                                    {participant.name?.[0]?.toUpperCase() ||
                                                                        "?"}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            participant.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500">
                                                                    Tagihan
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {formatCurrency(
                                                                        amountOwed
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>

                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-600 font-medium">
                                                Total Peserta
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {splitBill.participants
                                                    ?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-medium">
                                                Total Tagihan
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(totalOwed)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SplitBillShow;
