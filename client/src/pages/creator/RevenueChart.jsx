import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Renders a line chart displaying historical revenue analytics
 * @param {Object} props
 * @param {Array} props.data - Array of items containing { month: string, revenue: number }
 * @param {boolean} props.isLoading - Loading state flag
 */
const RevenueChart = ({ data = [], isLoading = false }) => {
  // 1. Render simple loading placeholder
  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center border border-gray-100 rounded-xl bg-white shadow-xs">
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Loading revenue data...
        </p>
      </div>
    );
  }

  // 2. Render simple empty placeholder if backend returns no entries
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center border border-gray-100 rounded-xl bg-white shadow-xs">
        <p className="text-sm font-medium text-gray-400">
          No revenue data available for this period.
        </p>
      </div>
    );
  }

  // 3. Custom formatting function for the currency toolkit
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full p-6 border border-gray-100 rounded-xl bg-white shadow-xs">
      {/* Title Header Section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Revenue History
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Monthly subscription earnings performance
        </p>
      </div>

      {/* Recharts Container Wrapper */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: -10,
              bottom: 0,
            }}
          >
            {/* Visual Grid Backdrop */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            
            {/* Horizontal Axis Configuration */}
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            
            {/* Vertical Axis Configuration */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            
            {/* Dynamic Interactive Tooltip */}
            <Tooltip 
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #f3f4f6",
                borderRadius: "8px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
              labelStyle={{ fontWeight: 600, color: "#111827", marginBottom: "4px" }}
            />
            
            <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
            
            {/* Primary Smooth Data Trend Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue"
              stroke="#0ea5e9" // Light Blue / Sky Theme Accent Color
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0 }}
              dot={{ r: 4, strokeWidth: 2, fill: "#ffffff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
