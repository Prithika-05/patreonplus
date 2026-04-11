import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Calendar, CreditCard, CheckCircle2, XCircle, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const MySubscriptions = () => {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: subscriptionService.getMySubscriptions,
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscriptions']);
      toast.success('Subscription cancelled successfully');
      setCancellingId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
      setCancellingId(null);
    },
  });

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this subscription? You will lose access to exclusive content immediately.")) {
      setCancellingId(id);
      cancelMutation.mutate(id);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          icon: CheckCircle2,
          colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          badgeText: 'text-emerald-600',
          description: 'Access granted'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          colorClass: 'bg-red-500/10 text-red-600 border-red-500/20',
          badgeText: 'text-red-600',
          description: 'Access revoked'
        };
      case 'expired':
        return {
          label: 'Expired',
          icon: Clock,
          colorClass: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          badgeText: 'text-gray-600',
          description: 'Renewal required'
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          colorClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          badgeText: 'text-blue-600',
          description: 'Unknown status'
        };
    }
  };

  const getProgress = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const total = end.getTime() - now.getTime();
    if (total <= 0) return 0;
    const daysLeft = total / (1000 * 60 * 60 * 24);
    const percentage = Math.min(100, Math.max(0, (daysLeft / 30) * 100));
    return percentage;
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">My Subscriptions</h2>
          <p className="text-muted-foreground mt-1">Manage your access to exclusive creator content.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/subscriber/explore'} className="gap-2">
          <Sparkles className="h-4 w-4" /> Discover More
        </Button>
      </motion.div>
      
      {subscriptions?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Active Subscriptions</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            You haven't subscribed to any creators yet. Support your favorite creators and unlock exclusive content!
          </p>
          <Button className="mt-6 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/subscriber/explore'}>
            Explore Creators <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {subscriptions?.map((sub) => {
              const statusConfig = getStatusConfig(sub.status);
              const StatusIcon = statusConfig.icon;
              const progress = sub.status === 'active' ? getProgress(sub.endDate) : 0;

              return (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/30"
                >

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 mt-2 border-2 border-background shadow-sm">
                          <AvatarImage src={sub.creator?.avatarUrl} alt={sub.creator?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-bold">
                            {sub.creator?.name?.[0] || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-bold mt-2 leading-tight">{sub.creator?.name}</CardTitle>
                          <CardDescription className="text-xs font-medium text-primary mt-0.5">
                            {sub.tier?.name} Tier
                          </CardDescription>
                        </div>
                      </div>
                      <div className={`flex items-center mt-3 gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${statusConfig.colorClass}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1">
                    <div className="rounded-lg bg-muted/30 p-3 border border-border/40">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4" /> Price
                        </span>
                        <span className="font-bold text-foreground">${sub.tier?.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Duration
                        </span>
                        <span className="font-medium text-foreground">{sub.tier?.unlockDuration} Days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ends on</span>
                        <span className="font-medium text-foreground">
                          {new Date(sub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      {sub.status === 'active' && (
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    {sub.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => handleCancel(sub.id)}
                        disabled={cancelMutation.isPending && cancellingId === sub.id}
                      >
                        {cancelMutation.isPending && cancellingId === sub.id ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            Cancelling...
                          </>
                        ) : (
                          <>Cancel Subscription</>
                        )}
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full" disabled>
                        {sub.status === 'expired' ? 'Renew to Access' : 'Inactive'}
                      </Button>
                    )}
                  </CardFooter>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MySubscriptions;