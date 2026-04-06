import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { subscriptionService } from '@/services/subscription.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['public-profile', username],
    queryFn: () => userService.getPublicProfile(username),
  });

  const subscribeMutation = useMutation({
    mutationFn: subscriptionService.subscribe,
    onSuccess: () => {
      toast.success('Successfully subscribed!');
      navigate('/subscriber/subscriptions');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to subscribe'),
  });

  if (isLoading) return <div>Loading profile...</div>;
  if (!profile || !profile.user) return <div>User not found</div>;

  const { user, tiers } = profile;

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex items-center gap-6 border-b pb-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <p className="mt-2 max-w-2xl">{user.bio || "No bio available."}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Membership Tiers</h2>
        {tiers.length === 0 ? (
          <p className="text-muted-foreground">No tiers available yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-2xl font-bold">${tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.unlockDuration} days access</p>
                  <p className="text-sm text-muted-foreground">Level {tier.level}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => subscribeMutation.mutate(tier.id)}
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;