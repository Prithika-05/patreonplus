import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../../services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Layers,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  const {
    data: overview,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-analytics"],
    queryFn: analyticsService.getCreatorOverview,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your studio...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center text-destructive">
        Failed to load analytics. Please try again later.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${overview?.totalRevenue.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      description: "+12.5% from last month",
      trend: "up",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Subscribers",
      value: overview?.activeSubscribers || 0,
      icon: Users,
      description: "+5 new this week",
      trend: "up",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Tiers",
      value: overview?.totalTiers || 0,
      icon: Layers,
      description: "Membership levels",
      trend: "neutral",
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Total Content",
      value: overview?.totalContent || 0,
      icon: FileText,
      description: "Posts & videos published",
      trend: "up",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Data
          </div>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Updated just now
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="overflow-hidden border-border/60 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`rounded-full p-2 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {stat.trend === "up" && (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    )}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-8"
        >
          <Card className="border-border/60 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-semibold">
                        Subscriber
                      </TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                      <TableHead className="text-right font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overview?.recentActivity?.length > 0 ? (
                      overview.recentActivity.map((activity) => (
                        <TableRow
                          key={activity.id}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="font-medium text-foreground">
                            {activity.user}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                activity.action.includes("Subscribed")
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-blue-500/10 text-blue-600"
                              }`}
                            >
                              {activity.action}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" },
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No recent activity found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-12 lg:col-span-4 space-y-6"
        >
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-background shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <p className="text-xs text-muted-foreground">
                Boost your creator journey
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40">
                <div className="absolute right-0 top-0 h-20 w-20 -translate-y-4 translate-x-4 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20" />

                <div className="relative z-10 flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Create New Tier
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add a new membership level to unlock exclusive revenue
                    streams.
                  </p>

                  <Button
                    asChild
                    size="sm"
                    className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <a href="/creator/tiers">Create Tier</a>
                  </Button>
                </div>
              </div>

              <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/40">
                <div className="absolute right-0 top-0 h-20 w-20 -translate-y-4 translate-x-4 rounded-full bg-purple-500/10 blur-xl transition-all group-hover:bg-purple-500/20" />

                <div className="relative z-10 flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Post New Content
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Engage your fans with fresh exclusive posts or videos.
                  </p>

                  <Button
                    asChild
                    size="sm"
                    className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    <a href="/creator/contents">Upload Content</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-yellow-500/20 p-1">
                <TrendingUp className="h-3 w-3 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Pro Tip</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Creators who post 3x a week see 40% more retention. Keep it
                  consistent!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
