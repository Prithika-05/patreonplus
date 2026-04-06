const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tiers</h3>
          <p className="text-2xl font-bold">Manage in Tiers tab</p>
        </div>
      </div>
    </div>
  );
};
export default DashboardHome;