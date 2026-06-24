import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service"; //  Correct


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  UserMinus,
} from "lucide-react";

import { motion } from "framer-motion";

import RevenueChart from "@/components/analytics/RevenueChart";
import TierPerformanceChart from "@/components/analytics/TierPerformanceChart";
import ChurnCard from "@/components/analytics/ChurnCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DashboardHome = () => {
  const overviewQuery = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: analyticsService.getOverview,
  });

  const recentSubscribersQuery = useQuery({
    queryKey: ["analytics-recent-subscribers"],
    queryFn: analyticsService.getRecentSubscribers,
  });

  const churnQuery = useQuery({
    queryKey: ["analytics-churn"],
    queryFn: analyticsService.getChurnRate,
  });

  const revenueHistoryQuery = useQuery({
    queryKey: ["analytics-revenue-history"],
    queryFn: analyticsService.getRevenueHistory,
  });

  const tierPerformanceQuery = useQuery({
    queryKey: ["analytics-tier-performance"],
    queryFn: analyticsService.getTierPerformance,
  });

  const isLoading =
    overviewQuery.isLoading ||
    recentSubscribersQuery.isLoading ||
    churnQuery.isLoading ||
    revenueHistoryQuery.isLoading ||
    tierPerformanceQuery.isLoading;

  const isError =
    overviewQuery.isError ||
    recentSubscribersQuery.isError ||
    churnQuery.isError ||
    revenueHistoryQuery.isError ||
    tierPerformanceQuery.isError;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-destructive">
        Failed to load analytics. Please try again later.
      </div>
    );
  }

  const overview = overviewQuery.data?.data || {};
  const recentSubscribers = recentSubscribersQuery.data?.data || [];
  const churnData = churnQuery.data?.data || {};
  const revenueHistory = revenueHistoryQuery.data?.data || [];
  const tierPerformance = tierPerformanceQuery.data?.data || [];

  const totalSubscribers = overview.totalSubscribers || 0;
  const totalContent = overview.totalContent || 0;
  const monthlyRevenue = overview.monthlyRevenue || 0;

  const arpu =
    totalSubscribers > 0
      ? monthlyRevenue / totalSubscribers
      : 0;

  const stats = [
    {
      title: "Monthly Revenue",
      value: `$${Number(monthlyRevenue).toFixed(2)}`,
      icon: DollarSign,
      description: "Current monthly recurring revenue",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Subscribers",
      value: totalSubscribers,
      icon: Users,
      description: "Active paying members",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Published Content",
      value: totalContent,
      icon: FileText,
      description: "Total creator posts",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "ARPU",
      value: `$${Number(arpu).toFixed(2)}`,
      icon: TrendingUp,
      description: "Average revenue per subscriber",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Churn Rate",
      value: `${Number(
        churnData.churnRate || 0
      ).toFixed(2)}%`,
      icon: UserMinus,
      description: "Subscriber loss rate",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>

          <p className="text-muted-foreground mt-1">
            Welcome back. Here's your creator business overview.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 border border-green-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live Analytics
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
            >
              <Card className="hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>

                  <div
                    className={`rounded-full p-2 ${stat.bg} ${stat.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          data={revenueHistory}
          isLoading={revenueHistoryQuery.isLoading}
        />

        <TierPerformanceChart
          data={tierPerformance}
          isLoading={tierPerformanceQuery.isLoading}
        />
      </div>

      <ChurnCard
        data={churnData}
        isLoading={churnQuery.isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Recent Subscribers
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentSubscribers.length > 0 ? (
                recentSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.name}
                    </TableCell>

                    <TableCell>
                      @{subscriber.username}
                    </TableCell>

                    <TableCell>
                      {subscriber.tier}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        subscriber.subscribedAt
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No subscribers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Quick Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-2">
          <Button asChild>
            <a href="/creator/tiers">
              Create Tier
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
          >
            <a href="/creator/contents">
              Upload Content
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;