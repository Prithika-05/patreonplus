import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { subscriptionService } from '@/services/subscription.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Star, Crown, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
      toast.success('Successfully subscribed! Redirecting...');
      navigate('/subscriber/subscriptions');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to subscribe'),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-32 bg-muted rounded" />
        <div className="h-64 w-full bg-muted rounded-xl" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <ArrowLeft className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Creator Not Found</h2>
        <p className="text-muted-foreground">The creator you are looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/subscriber/explore')}>Back to Explore</Button>
      </div>
    );
  }

  const { user, tiers } = profile;

  const sortedTiers = [...tiers].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-4 z-50 flex justify-start"
      >
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="gap-2 shadow-lg backdrop-blur-md bg-background/80 border-border/50 hover:bg-background"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
  
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <Avatar className="relative h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-background" title="Active Creator" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{user.name}</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
                  <Crown className="h-3 w-3 mr-1" /> Verified Creator
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground font-medium mt-1">@{user.username}</p>
            </div>
            
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              {user.bio || "No bio available yet."}
            </p>

            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold text-foreground">4.9</span> Rating
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>1.2k</span> Subscribers
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            Choose a Membership Tier
          </h2>
          <p className="text-muted-foreground mt-1">Unlock exclusive content by subscribing to one of the plans below.</p>
        </motion.div>

        {sortedTiers.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">This creator hasn't set up any membership tiers yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedTiers.map((tier, index) => {
              const isPopular = sortedTiers.length > 1 && index === 1; // Mark middle tier as popular
              
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 3) }}
                  whileHover={{ y: -8 }}
                  className={`relative flex flex-col rounded-2xl border bg-card shadow-sm transition-all duration-300 ${
                    isPopular 
                      ? 'border-primary/50 shadow-xl shadow-primary/10 scale-105 z-10' 
                      : 'border-border/60 hover:border-primary/30 hover:shadow-lg'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-violet-600 text-white border-0 shadow-md px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {tier.name}
                      {tier.level >= 3 && <Crown className="h-5 w-5 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                        <span className="text-sm text-muted-foreground">/ {tier.unlockDuration} days</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Access for {tier.unlockDuration} days
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Exclusive Content Access</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Direct Message Support</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Community Badge</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button 
                      className={`w-full ${isPopular ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25' : ''}`}
                      onClick={() => subscribeMutation.mutate(tier.id)}
                      disabled={subscribeMutation.isPending}
                      size="lg"
                    >
                      {subscribeMutation.isPending ? 'Processing...' : `Subscribe to ${tier.name}`}
                    </Button>
                  </CardFooter>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;