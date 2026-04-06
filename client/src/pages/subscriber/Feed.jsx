const Feed = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Your Feed</h2>
      <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
        <h3 className="text-lg font-medium">Content Feed</h3>
        <p className="text-muted-foreground">
          Content from your active subscriptions will appear here.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          (Note: Backend docs restrict content fetching to creators. This UI is ready for integration.)
        </p>
      </div>
    </div>
  );
};
export default Feed;