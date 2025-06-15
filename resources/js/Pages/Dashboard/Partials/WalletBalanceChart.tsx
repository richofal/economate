import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface WalletBalance {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

interface WalletBalanceChartProps {
    data: WalletBalance[];
    total: number;
    height?: number;
}

const WalletBalanceChart = ({
    data,
    total,
    height = 350,
}: WalletBalanceChartProps) => {
    // If no data, show a placeholder
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
                <p className="text-gray-500">Belum ada dompet yang terdaftar</p>
                <p className="text-gray-400 text-sm mt-1">
                    Tambahkan dompet untuk melihat komposisi saldo
                </p>
            </div>
        );
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                            {formatCurrency(item.value)}
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            {item.percentage}%
                        </span>
                    </div>
                    {item.type && (
                        <div className="text-xs text-gray-500 mt-1">
                            Tipe: {item.type}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = (props: any) => {
        const { x, y, width, height, value, index } = props;
        const item = data[index];

        return (
            <g>
                <text
                    x={x + width + 5}
                    y={y + height / 2}
                    fill="#374151"
                    textAnchor="start"
                    dominantBaseline="central"
                    className="text-xs font-medium"
                >
                    {formatCurrency(value)}
                </text>
                <text
                    x={x + width - 5}
                    y={y + height / 2}
                    fill="#fff"
                    textAnchor="end"
                    dominantBaseline="central"
                    className="text-xs font-medium"
                >
                    {item.percentage}%
                </text>
            </g>
        );
    };

    // Calculate chart dimensions
    const chartHeight = Math.max(height - 80, data.length * 50);
    const chartMargin = { top: 10, right: 120, bottom: 10, left: 10 };

    return (
        <div className="space-y-4">
            {/* Header with total */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                    Komposisi Saldo Dompet
                </h3>
                <div className="text-base font-semibold">
                    Total: {formatCurrency(total)}
                </div>
            </div>

            {/* Chart */}
            <div
                className="w-full overflow-y-visible"
                style={{ height: `${chartHeight}px` }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={chartMargin}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                            opacity={0.5}
                        />
                        <XAxis
                            type="number"
                            tickFormatter={(value) => formatCurrency(value)}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#6B7280" }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 12,
                                fill: "#374151",
                                fontWeight: 500,
                                width: 90,
                                overflow: "hidden",
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    cursor="pointer"
                                />
                            ))}
                            <LabelList
                                dataKey="value"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend/Info */}
            <div className="flex flex-wrap gap-2 text-xs">
                {data.map((wallet, index) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center px-2 py-1 bg-gray-50 rounded-md"
                    >
                        <span
                            className="w-2 h-2 rounded-full mr-1.5"
                            style={{ backgroundColor: wallet.color }}
                        />
                        <span className="font-medium">{wallet.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletBalanceChart;
