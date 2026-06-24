import React from "react";

const TopContentWidget = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-xs animate-pulse h-64 flex items-center justify-center">
        <p className="text-xs text-gray-400 font-medium">Loading your top performing content...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-xs h-64 flex items-center justify-center">
        <p className="text-sm text-gray-400 font-medium">No published content view data available yet.</p>
      </div>
    );
  }

  // Determine the highest view count to calculate relative widths for visual progress bars
  const maxViews = data.length > 0 ? data[0].views : 1;

  return (
    <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-xs">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900">Top Content</h3>
        <p className="text-xs text-gray-500 mt-0.5">Your publications sorted by historical popularity</p>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const relativePercentage = Math.min(100, Math.max(5, (item.views / maxViews) * 100));
          
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800 truncate max-w-[75%]">
                  {item.title}
                </span>
                <span className="font-semibold text-gray-900">
                  {item.views.toLocaleString()} views
                </span>
              </div>
              
              {/* Visual Performance Bar indicator */}
              <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${relativePercentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopContentWidget;
