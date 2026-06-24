import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TierPerformanceChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center border border-gray-100 rounded-xl bg-white shadow-xs">
        <p className="text-sm font-medium text-gray-400 animate-pulse">Loading tier breakdown...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center border border-gray-100 rounded-xl bg-white shadow-xs">
        <p className="text-sm font-medium text-gray-400">No tier data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 border border-gray-100 rounded-xl bg-white shadow-xs">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">Tier Performance</h3>
        <p className="text-xs text-gray-500 mt-1">Comparing user volume against earnings across active tiers</p>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="tierName" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #f3f4f6", borderRadius: "8px" }}
              labelStyle={{ fontWeight: 600, color: "#111827" }}
            />
            <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
            <Bar dataKey="subscribers" name="Subscribers" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Revenue ($)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TierPerformanceChart;
