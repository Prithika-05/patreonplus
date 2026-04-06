import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CreatorProfile = () => {
  const [tierId, setTierId] = useState('');
  const navigate = useNavigate();

  const subscribeMutation = useMutation({
    mutationFn: subscriptionService.subscribe,
    onSuccess: () => {
      toast.success('Successfully subscribed!');
      navigate('/subscriber/subscriptions');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to subscribe'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tierId) {
      toast.error('Please enter a Tier ID');
      return;
    }
    subscribeMutation.mutate(tierId);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Subscribe to Creator</h2>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Enter Tier Details</CardTitle>
          <CardDescription>
            Since public tier listing is restricted in this backend version, 
            enter a known Tier ID to subscribe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tierId">Tier ID (UUID)</Label>
              <Input 
                id="tierId" 
                value={tierId} 
                onChange={(e) => setTierId(e.target.value)} 
                placeholder="e.g., f8c0c4f6-9078-4585-b0ee-bfb9ca9a52f0"
              />
            </div>
            <Button type="submit" className="w-full" disabled={subscribeMutation.isPending}>
              {subscribeMutation.isPending ? 'Subscribing...' : 'Confirm Subscription'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProfile;