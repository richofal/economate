import { useState, useEffect, useMemo } from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { BarChart4 } from "lucide-react";

interface ChartDataPoint {
    date: string;
    income: number;
    expense: number;
    rawDate?: string;
}

interface IncomeExpenseChartProps {
    data: ChartDataPoint[];
    maxValue?: number;
    height?: number;
    selectedRange?: string;
}

type DateRange = "7days" | "30days" | "90days" | "custom";

// --- DITAMBAHKAN: Komponen khusus untuk Empty State ---
const ChartEmptyState = ({ height }: { height: number }) => (
    <div
        className="bg-gray-50/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200"
        style={{ height: `${height}px` }}
    >
        <BarChart4 className="w-16 h-16 text-gray-300 mb-3" strokeWidth={1} />
        <h3 className="text-lg font-medium text-gray-600">
            Data Tidak Ditemukan
        </h3>
        <p className="text-gray-400 text-sm mt-1">
            Tidak ada data transaksi pada rentang tanggal yang dipilih.
        </p>
    </div>
);

const IncomeExpenseChart = ({
    data,
    maxValue,
    height = 350,
    selectedRange = "30days",
}: IncomeExpenseChartProps) => {
    // ... (Semua state Anda: range, isCustomOpen, customStartDate, dll. tetap di sini)
    const [range, setRange] = useState<DateRange>(selectedRange as DateRange);
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");
    const [loading, setLoading] = useState(true); // Mulai dengan true
    const [originalData, setOriginalData] = useState<ChartDataPoint[]>([]);

    // State untuk menampilkan statistik total atau saat hover
    const [displayStats, setDisplayStats] = useState({
        income: 0,
        expense: 0,
        net: 0,
    });

    // ... (Semua useEffect dan useMemo Anda tetap di sini)
    const parseDisplayDateToISO = (displayDate: string): string => {
        try {
            const [day, month] = displayDate.split(" ");
            const currentYear = new Date().getFullYear();
            const monthMap: { [key: string]: number } = {
                Jan: 0,
                Feb: 1,
                Mar: 2,
                Apr: 3,
                May: 4,
                Jun: 5,
                Jul: 6,
                Aug: 7,
                Sep: 8,
                Oct: 9,
                Nov: 10,
                Dec: 11,
            };
            const monthIndex =
                monthMap[month] !== undefined
                    ? monthMap[month]
                    : monthMap[month.substring(0, 3)] || 0;
            const date = new Date(currentYear, monthIndex, parseInt(day));
            return date.toISOString().split("T")[0];
        } catch (e) {
            return new Date().toISOString().split("T")[0];
        }
    };

    console.log("Data awal:", data);

    useEffect(() => {
        if (data) {
            setLoading(true);
            const preparedData = data.map((item) => {
                const rawDate =
                    item.rawDate || parseDisplayDateToISO(item.date);
                return { ...item, rawDate };
            });
            setOriginalData(preparedData);
            // Matikan loading setelah data awal diproses
            setTimeout(() => setLoading(false), 300);
        } else {
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setCustomEndDate(today);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setCustomStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    }, []);

    const filteredData = useMemo(() => {
        if (originalData.length === 0) return [];

        setLoading(true);
        // ... (Logika filtering Anda tetap sama)
        try {
            const today = new Date();
            let startDate = new Date();
            switch (range) {
                case "7days":
                    startDate.setDate(today.getDate() - 7);
                    break;
                case "30days":
                    startDate.setDate(today.getDate() - 30);
                    break;
                case "90days":
                    startDate.setDate(today.getDate() - 90);
                    break;
                case "custom":
                    if (customStartDate && customEndDate) {
                        startDate = new Date(customStartDate);
                        today.setTime(new Date(customEndDate).getTime());
                        today.setHours(23, 59, 59, 999);
                    }
                    break;
                default:
                    startDate.setDate(today.getDate() - 30);
            }
            startDate.setHours(0, 0, 0, 0);

            const filtered = originalData.filter((item) => {
                if (!item.rawDate) return false;
                const itemDate = new Date(item.rawDate);
                return itemDate >= startDate && itemDate <= today;
            });

            filtered.sort((a, b) => {
                if (!a.rawDate || !b.rawDate) return 0;
                return (
                    new Date(a.rawDate).getTime() -
                    new Date(b.rawDate).getTime()
                );
            });

            setTimeout(() => setLoading(false), 300);
            return filtered;
        } catch (error) {
            console.error("Error filtering data:", error);
            setLoading(false);
            return [];
        }
    }, [originalData, range, customStartDate, customEndDate]);

    // --- DIHAPUS: Blok 'if' yang menyebabkan duplikasi dan error ---
    // if (!filteredData || filteredData.length === 0) { ... }

    // --- Logika dan handler Anda sekarang aman di sini ---
    const handleRangeChange = (newRange: DateRange) => {
        if (newRange === range) return;
        if (newRange === "custom") {
            setIsCustomOpen(true);
            setRange("custom");
            return;
        }
        setIsCustomOpen(false); // Tutup custom range jika pilihan lain diklik
        setRange(newRange);
    };

    const applyCustomRange = () => {
        if (!customStartDate || !customEndDate) return;
        setIsCustomOpen(false);
    };

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, item) => {
                acc.income += item.income;
                acc.expense += item.expense;
                return acc;
            },
            { income: 0, expense: 0 }
        );
    }, [filteredData]);

    // Update displayStats saat data atau hover berubah
    useEffect(() => {
        setDisplayStats({
            income: totals.income,
            expense: totals.expense,
            net: totals.income - totals.expense,
        });
    }, [totals]);

    // ... (sisa kalkulasi seperti calculatedMaxValue & skipLabelInterval tetap sama)
    const calculatedMaxValue = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return maxValue || 1000;
        const maxIncome = Math.max(...filteredData.map((item) => item.income));
        const maxExpense = Math.max(
            ...filteredData.map((item) => item.expense)
        );
        return Math.max(maxIncome, maxExpense) * 1.1;
    }, [filteredData, maxValue]);

    const skipLabelInterval =
        filteredData.length > 15 ? Math.ceil(filteredData.length / 15) : 0;

    // --- STRUKTUR RENDER UTAMA ---
    return (
        <div className="space-y-4">
            {/* Filter UI (hanya ada satu sekarang) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* ... (semua tombol filter Anda tetap di sini) ... */}
                <div className="inline-flex items-center rounded-md bg-gray-50 p-1">
                    <button
                        onClick={() => handleRangeChange("7days")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            range === "7days"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={loading}
                    >
                        7 Hari
                    </button>
                    <button
                        onClick={() => handleRangeChange("30days")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            range === "30days"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={loading}
                    >
                        30 Hari
                    </button>
                    <button
                        onClick={() => handleRangeChange("90days")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            range === "90days"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={loading}
                    >
                        90 Hari
                    </button>
                    <button
                        onClick={() => handleRangeChange("custom")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            range === "custom"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                        disabled={loading}
                    >
                        Kustom
                    </button>
                </div>

                {/* Summary stats */}
                <div className="flex flex-wrap gap-3 text-sm">
                    {/* ... (summary stats Anda) ... */}
                </div>
            </div>

            {/* Custom date range modal */}
            {isCustomOpen && (
                // ... (JSX untuk modal kustom Anda)
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {/* inputs date */}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={applyCustomRange}>Terapkan</button>
                    </div>
                </div>
            )}

            {/* --- PERUBAHAN UTAMA DI SINI --- */}
            {/* Main chart atau Empty State */}
            <div className="w-full relative">
                {loading ? (
                    // 1. Tampilkan loading spinner
                    <div
                        className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg"
                        style={{ height: `${height}px` }}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">
                                Memuat data...
                            </span>
                        </div>
                    </div>
                ) : filteredData && filteredData.length > 0 ? (
                    // 2. Tampilkan chart jika ada data
                    <ResponsiveContainer width="100%" height={height}>
                        <ComposedChart
                            data={filteredData}
                            // ... (semua props chart Anda: margin, onMouseMove, dll)
                            onMouseMove={(e) => {
                                if (e.activePayload && e.activePayload.length) {
                                    const income = e.activePayload[1]
                                        .value as number;
                                    const expense = e.activePayload[0]
                                        .value as number;
                                    setDisplayStats({
                                        income,
                                        expense,
                                        net: income - expense,
                                    });
                                }
                            }}
                            onMouseLeave={() => {
                                // Saat mouse keluar, kembalikan ke total
                                setDisplayStats({
                                    income: totals.income,
                                    expense: totals.expense,
                                    net: totals.income - totals.expense,
                                });
                            }}
                        >
                            {/* ... (semua komponen chart: defs, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line) ... */}
                            <defs>
                                <linearGradient
                                    id="expenseFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#f87171"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#f87171"
                                        stopOpacity={0.2}
                                    />
                                </linearGradient>
                                <linearGradient
                                    id="incomeFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#38bdf8"
                                        stopOpacity={0.2}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#38bdf8"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                opacity={0.4}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                                tick={{ fontSize: 11, fill: "#6B7280" }}
                                interval={skipLabelInterval}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    `${(value / 1000).toLocaleString()}K`
                                }
                                tickLine={false}
                                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                                tick={{ fontSize: 11, fill: "#6B7280" }}
                                domain={[0, calculatedMaxValue]}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    formatCurrency(value),
                                    name === "expense"
                                        ? "Pengeluaran"
                                        : "Pemasukan",
                                ]}
                                labelFormatter={(label) => `Tanggal: ${label}`}
                                contentStyle={{
                                    backgroundColor: "white",
                                    borderRadius: "0.375rem",
                                    boxShadow:
                                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                    border: "none",
                                    padding: "12px",
                                }}
                                itemStyle={{ fontSize: "13px" }}
                                labelStyle={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    marginBottom: "5px",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: 15 }}
                                payload={[
                                    {
                                        value: "Pengeluaran",
                                        type: "rect",
                                        color: "#ef4444",
                                    },
                                    {
                                        value: "Pemasukan",
                                        type: "line",
                                        color: "#0ea5e9",
                                    },
                                ]}
                            />
                            <Bar
                                name="expense"
                                dataKey="expense"
                                barSize={20}
                                fill="url(#expenseFill)"
                                stroke="#ef4444"
                                strokeWidth={1}
                                radius={[4, 4, 0, 0]}
                            />
                            <Line
                                name="income"
                                type="monotone"
                                dataKey="income"
                                stroke="#0ea5e9"
                                strokeWidth={2.5}
                                dot={{ fill: "#0ea5e9", r: 4, strokeWidth: 0 }}
                                activeDot={{
                                    r: 6,
                                    stroke: "#0c4a6e",
                                    strokeWidth: 1,
                                }}
                                fillOpacity={1}
                                fill="url(#incomeFill)"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    // 3. Tampilkan empty state jika tidak loading dan tidak ada data
                    <ChartEmptyState height={height} />
                )}
            </div>

            {/* Statistik di bawah chart, menggunakan state 'displayStats' */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-center">
                <div className="bg-green-50/70 border border-green-100 p-2 rounded-md">
                    <div className="text-xs text-green-600 mb-1">Pemasukan</div>
                    <div className="text-green-800 font-medium">
                        {formatCurrency(displayStats.income)}
                    </div>
                </div>
                <div className="bg-red-50/70 border border-red-100 p-2 rounded-md">
                    <div className="text-xs text-red-600 mb-1">Pengeluaran</div>
                    <div className="text-red-800 font-medium">
                        {formatCurrency(displayStats.expense)}
                    </div>
                </div>
                <div
                    className={`p-2 rounded-md ${
                        displayStats.net >= 0
                            ? "bg-blue-50/70 border-blue-100"
                            : "bg-orange-50/70 border-orange-100"
                    }`}
                >
                    <div
                        className={`text-xs mb-1 ${
                            displayStats.net >= 0
                                ? "text-blue-600"
                                : "text-orange-600"
                        }`}
                    >
                        Selisih
                    </div>
                    <div
                        className={`font-medium ${
                            displayStats.net >= 0
                                ? "text-blue-800"
                                : "text-orange-800"
                        }`}
                    >
                        {formatCurrency(displayStats.net)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeExpenseChart;
