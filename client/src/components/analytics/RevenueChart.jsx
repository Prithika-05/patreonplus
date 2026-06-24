import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

const RevenueChart = ({
  data = [],
  isLoading = false,
}) => {
  const analytics = useMemo(() => {
    if (!data.length) {
      return {
        currentRevenue: 0,
        previousRevenue: 0,
        growthRate: 0,
      };
    }

    const currentRevenue =
      Number(
        data[data.length - 1]?.revenue || 0
      );

    const previousRevenue =
      Number(
        data[data.length - 2]?.revenue || 0
      );

    let growthRate = 0;

    if (previousRevenue > 0) {
      growthRate =
        (
          ((currentRevenue -
            previousRevenue) /
            previousRevenue) *
          100
        ).toFixed(2);
    }

    return {
      currentRevenue,
      previousRevenue,
      growthRate,
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
            Loading revenue analytics...
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
            No revenue data available
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Revenue analytics will appear once
            subscribers begin purchasing tiers.
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
            Revenue History
          </h3>

          <p className="text-sm text-muted-foreground">
            Monthly subscription revenue
            performance
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="text-2xl font-bold">
            {formatCurrency(
              analytics.currentRevenue
            )}
          </span>

          <span
            className={`text-sm font-medium ${
              Number(
                analytics.growthRate
              ) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {Number(
              analytics.growthRate
            ) >= 0
              ? "+"
              : ""}
            {analytics.growthRate}%
            vs previous month
          </span>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="currentColor"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="currentColor"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                `$${value}`
              }
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) =>
                formatCurrency(value)
              }
              labelStyle={{
                fontWeight: 600,
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="currentColor"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="currentColor"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Current Month
          </p>

          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(
              analytics.currentRevenue
            )}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Previous Month
          </p>

          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(
              analytics.previousRevenue
            )}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Growth
          </p>

          <p
            className={`mt-1 text-lg font-semibold ${
              Number(
                analytics.growthRate
              ) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {analytics.growthRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;