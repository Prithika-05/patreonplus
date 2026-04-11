import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Users, Layers, FileText, TrendingUp } from 'lucide-react';

const DashboardHome = () => {
  const {  overview, isLoading } = useQuery({
    queryKey: ['creator-analytics'],
    queryFn: analyticsService.getCreatorOverview,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${overview?.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Active Subscribers",
      value: overview?.activeSubscribers || 0,
      icon: Users,
      description: "Currently active",
    },
    {
      title: "Total Tiers",
      value: overview?.totalTiers || 0,
      icon: Layers,
      description: "Membership levels",
    },
    {
      title: "Total Content",
      value: overview?.totalContent || 0,
      icon: FileText,
      description: "Posts & videos",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overview?.recentActivity?.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell className="text-right">
                      {new Date(activity.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium">Create New Tier</h4>
              <p className="text-xs text-muted-foreground mb-2">Add a new membership level for your fans.</p>
              <a href="/creator/tiers" className="text-xs text-primary hover:underline">Go to Tiers →</a>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium">Post Content</h4>
              <p className="text-xs text-muted-foreground mb-2">Share exclusive content with your subscribers.</p>
              <a href="/creator/contents" className="text-xs text-primary hover:underline">Go to Content →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;