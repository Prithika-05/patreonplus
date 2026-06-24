import React from "react";

const ChurnCard = ({ data = {}, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-xs animate-pulse h-40 flex items-center justify-center">
        <p className="text-xs text-gray-400 font-medium">Loading churn analysis...</p>
      </div>
    );
  }

  const { activeSubscribers = 0, cancelledSubscribers = 0, churnRate = 0 } = data;

  // Visual logic adjustments depending on how severe audience drop off gets
  const getBadgeColor = (rate) => {
    if (rate >= 15) return "bg-red-50 text-red-700 border-red-100";
    if (rate >= 7) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  return (
    <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Audience Churn</h3>
          <p className="text-xs text-gray-500 mt-0.5">Ratio of lost subscribers relative to your base</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(churnRate)}`}>
          {churnRate}% Rate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Baseline</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{activeSubscribers}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cancelled</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{cancelledSubscribers}</p>
        </div>
      </div>
    </div>
  );
};

export default ChurnCard;
