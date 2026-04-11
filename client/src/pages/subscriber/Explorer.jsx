import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Sparkles, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Explorer = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: users, isLoading } = useQuery({
    queryKey: ['creators', debouncedQuery],
    queryFn: () => userService.searchUsers(debouncedQuery || null),
    keepPreviousData: true, 
  });

  const hasSearched = debouncedQuery.length > 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-6"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground">
          {hasSearched ? 'Search Results' : 'Discover Amazing Creators'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {hasSearched 
            ? `Found ${users?.length || 0} creators matching "${debouncedQuery}"` 
            : "Explore talented creators, subscribe to their tiers, and unlock exclusive content."}
        </p>

        <div className="relative max-w-xl mx-auto mt-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, username, or niche..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              className="pl-12 h-12 rounded-full text-base shadow-sm border-border/60 focus-visible:ring-primary/50 bg-background/95 backdrop-blur"
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 h-8 w-8 rounded-full"
                onClick={() => setQuery('')}
              >
                <span className="sr-only">Clear</span>
                <span className="text-muted-foreground hover:text-foreground text-lg">×</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-64 animate-pulse border-border/60">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-3 w-full bg-muted rounded" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!users || users.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                {hasSearched ? <Search className="h-10 w-10" /> : <Users className="h-10 w-10" />}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {hasSearched ? 'No creators found' : 'No creators available yet'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {hasSearched 
                  ? `Try adjusting your search terms or browse without filters.` 
                  : `Check back later as more creators join the platform!`}
              </p>
              {hasSearched && (
                <Button variant="outline" className="mt-6" onClick={() => setQuery('')}>
                  Clear Search
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {users.map((user) => (
                <motion.div key={user.id} variants={itemVariants} layout>
                  <Card 
                    className="group h-full flex flex-col cursor-pointer overflow-hidden border-border/60 bg-card hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                    onClick={() => navigate(`/subscriber/profile/${user.username}`)}
                  >
                    <CardHeader className="pb-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-md group-hover:scale-105 transition-transform duration-300">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hidden sm:flex">
                          Creator
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {user.bio || "No bio available. Click to view their profile and exclusive content!"}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0 border-t border-border/40 bg-muted/20 p-4">
                      <Button 
                        variant="ghost" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/subscriber/profile/${user.username}`);
                        }}
                      >
                        View Profile <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Explorer;