import React, { useMemo } from "react";
import {
  Eye,
  Trophy,
  FileText,
  Calendar,
} from "lucide-react";

const TopContentWidget = ({
  data = [],
  isLoading = false,
}) => {
  const analytics = useMemo(() => {
    if (!data.length) {
      return {
        totalViews: 0,
        topContent: null,
      };
    }

    const totalViews = data.reduce(
      (sum, item) =>
        sum + Number(item.views || 0),
      0
    );

    return {
      totalViews,
      topContent: data[0],
    };
  }, [data]);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(
      Number(value || 0)
    );

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-3 w-56 rounded bg-muted" />

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="space-y-2"
            >
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-muted-foreground opacity-40" />

          <h3 className="mt-4 font-medium">
            No content analytics yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Publish content and start receiving
            views to see performance metrics.
          </p>
        </div>
      </div>
    );
  }

  const maxViews =
    Number(data[0]?.views || 1);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Content
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Best-performing content by views
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Views
          </p>

          <p className="text-xl font-bold">
            {formatNumber(
              analytics.totalViews
            )}
          </p>
        </div>
      </div>

      {analytics.topContent && (
        <div className="mb-5 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Top Performer
          </div>

          <h4 className="mt-2 font-semibold">
            {analytics.topContent.title}
          </h4>

          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(
                analytics.topContent.views
              )}{" "}
              views
            </span>

            {analytics.topContent.tierName && (
              <span>
                Tier:{" "}
                {
                  analytics.topContent
                    .tierName
                }
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.map((item, index) => {
          const relativePercentage =
            Math.min(
              100,
              Math.max(
                5,
                (Number(item.views || 0) /
                  maxViews) *
                  100
              )
            );

          return (
            <div
              key={item.id || index}
              className="group rounded-lg border p-3 transition-all hover:bg-muted/20"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    #{index + 1}
                  </div>

                  <div>
                    <h4 className="font-medium leading-tight">
                      {item.title}
                    </h4>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {item.tierName && (
                        <span>
                          Tier:{" "}
                          {item.tierName}
                        </span>
                      )}

                      {item.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {formatNumber(
                      item.views
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    views
                  </div>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${relativePercentage}%`,
                  }}
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