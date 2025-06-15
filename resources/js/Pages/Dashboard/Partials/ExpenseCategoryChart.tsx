import { useState, useCallback } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Sector,
    Label,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ExpenseCategory {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

interface ExpenseCategoryDonutProps {
    data: ExpenseCategory[];
    total: number;
    height?: number;
    previousTotal?: number;
}

// Render active shape with highlight effect
const renderActiveShape = (props: any) => {
    const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
    } = props;

    return (
        <g>
            <text
                x={cx}
                y={cy}
                dy={-8}
                textAnchor="middle"
                fill="#111827"
                className="text-base font-medium"
            >
                {payload.name}
            </text>
            <text
                x={cx}
                y={cy}
                dy={14}
                textAnchor="middle"
                fill="#10b981"
                className="text-lg font-semibold"
            >
                {formatCurrency(payload.value)}
            </text>
            <text
                x={cx}
                y={cy}
                dy={36}
                textAnchor="middle"
                fill="#6b7280"
                className="text-sm"
            >
                {payload.percentage}%
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                cornerRadius={5}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
                cornerRadius={3}
            />
        </g>
    );
};

const ExpenseCategoryChart = ({
    data,
    total,
    height = 350,
}: ExpenseCategoryDonutProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return (
            <div
                className="bg-gray-50 rounded-lg flex flex-col items-center justify-center"
                style={{ height: `${height}px` }}
            >
                <svg
                    className="w-16 h-16 text-gray-300 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
                <p className="text-gray-500">
                    Belum ada data pengeluaran bulan ini
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Catat pengeluaran Anda untuk melihat grafik ini
                </p>
            </div>
        );
    }

    // Handle mouse events
    const onPieEnter = useCallback((_: any, index: number) => {
        setActiveIndex(index);
    }, []);

    const onPieLeave = useCallback(() => {
        setActiveIndex(null);
    }, []);

    // Custom legend with improved styling
    const renderLegend = () => {
        // Sort data by value for better visualization
        const sortedData = [...data].sort((a, b) => b.value - a.value);

        return (
            <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Rincian Kategori
                </h3>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {sortedData.map((entry, index) => (
                        <li
                            key={`legend-${index}`}
                            className={`flex items-center justify-between text-sm p-2 rounded-md transition-colors ${
                                activeIndex ===
                                data.findIndex((d) => d.name === entry.name)
                                    ? "bg-gray-50 border-l-4"
                                    : "border-l-4 border-transparent hover:bg-gray-50"
                            }`}
                            style={{
                                borderLeftColor:
                                    activeIndex ===
                                    data.findIndex((d) => d.name === entry.name)
                                        ? entry.color
                                        : "transparent",
                            }}
                            onMouseEnter={() =>
                                setActiveIndex(
                                    data.findIndex((d) => d.name === entry.name)
                                )
                            }
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className="flex items-center">
                                <span
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="font-medium text-gray-700">
                                    {entry.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 font-medium">
                                    {formatCurrency(entry.value)}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-medium">
                                    {entry.percentage}%
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Create a simple fixed tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
                    <p className="font-medium mb-1">{data.name}</p>
                    <p className="text-gray-600">
                        {formatCurrency(data.value)} ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            {/* Total */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">
                    Total Pengeluaran Bulan Ini
                </p>
                <p className="text-3xl font-bold text-gray-800 my-1">
                    {formatCurrency(total)}
                </p>
            </div>

            {/* Chart */}
            <div
                className="w-full relative bg-white rounded-lg"
                style={{ height: `${height - 80}px` }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            activeIndex={
                                activeIndex !== null ? activeIndex : undefined
                            }
                            activeShape={renderActiveShape}
                            innerRadius={80}
                            outerRadius={110}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                            {activeIndex === null && (
                                <Label
                                    position="center"
                                    content={({ viewBox }) => {
                                        const { cx, cy } = viewBox as {
                                            cx: number;
                                            cy: number;
                                        };
                                        return (
                                            <g>
                                                <text
                                                    x={cx}
                                                    y={cy - 5}
                                                    textAnchor="middle"
                                                    fill="#4B5563"
                                                    className="text-sm font-medium"
                                                >
                                                    {data.length} Kategori
                                                </text>
                                                <text
                                                    x={cx}
                                                    y={cy + 15}
                                                    textAnchor="middle"
                                                    fill="#9CA3AF"
                                                    className="text-xs"
                                                >
                                                    Pilih untuk detail
                                                </text>
                                            </g>
                                        );
                                    }}
                                />
                            )}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {renderLegend()}
        </div>
    );
};

export default ExpenseCategoryChart;
