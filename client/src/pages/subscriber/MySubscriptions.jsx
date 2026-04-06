import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Calendar, CreditCard } from 'lucide-react';

const MySubscriptions = () => {
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: subscriptionService.getMySubscriptions,
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscriptions']);
      toast.success('Subscription cancelled successfully');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to cancel subscription'),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      case 'expired': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-blue-500';
    }
  };

  if (isLoading) return <div>Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Subscriptions</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions?.length === 0 ? (
          <p className="text-muted-foreground">You haven't subscribed to any creators yet.</p>
        ) : (
          subscriptions?.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{sub.creator?.name?.[0] || 'C'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{sub.tier?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{sub.creator?.name}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>${sub.tier?.price} / {sub.tier?.unlockDuration} days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ends: {new Date(sub.endDate).toLocaleDateString()}</span>
                </div>
                <div className="pt-2">
                  <Badge className={getStatusColor(sub.status)}>{sub.status.toUpperCase()}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                {sub.status === 'active' && (
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={() => cancelMutation.mutate(sub.id)}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                )}
                {sub.status !== 'active' && (
                  <Button variant="outline" className="w-full" disabled>
                    Subscription Inactive
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;