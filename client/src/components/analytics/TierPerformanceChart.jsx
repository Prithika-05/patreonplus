import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const TierPerformanceChart = ({
  data = [],
  isLoading = false,
}) => {
  const analytics = useMemo(() => {
    if (!data.length) {
      return {
        totalRevenue: 0,
        totalSubscribers: 0,
        topTier: null,
      };
    }

    const totalRevenue = data.reduce(
      (sum, tier) => sum + Number(tier.revenue || 0),
      0
    );

    const totalSubscribers = data.reduce(
      (sum, tier) => sum + Number(tier.subscribers || 0),
      0
    );

    const topTier = [...data].sort(
      (a, b) => b.revenue - a.revenue
    )[0];

    return {
      totalRevenue,
      totalSubscribers,
      topTier,
    };
  }, [data]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (isLoading) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border bg-card">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading tier analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border bg-card">
        <div className="text-center">
          <h3 className="font-medium">
            No tier data available
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Create subscription tiers and gain
            subscribers to see performance data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Tier Performance
          </h3>

          <p className="text-sm text-muted-foreground">
            Compare subscriber volume and
            revenue across all tiers
          </p>
        </div>

        {analytics.topTier && (
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground">
              Best Performing Tier
            </p>

            <p className="font-semibold">
              {analytics.topTier.tierName}
            </p>

            <p className="text-sm text-green-600">
              {formatCurrency(
                analytics.topTier.revenue
              )}
            </p>
          </div>
        )}
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="tierName"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") {
                  return formatCurrency(value);
                }

                return value;
              }}
            />

            <Legend />

            <Bar
              dataKey="subscribers"
              name="Subscribers"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="revenue"
              name="Revenue"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Revenue
          </p>

          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(
              analytics.totalRevenue
            )}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Subscribers
          </p>

          <p className="mt-1 text-lg font-semibold">
            {analytics.totalSubscribers}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Top Tier
          </p>

          <p className="mt-1 text-lg font-semibold">
            {analytics.topTier?.tierName ||
              "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TierPerformanceChart;