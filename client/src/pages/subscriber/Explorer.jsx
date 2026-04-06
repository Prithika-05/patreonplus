import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

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
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {debouncedQuery ? 'Search Results' : 'Latest Creators'}
        </h2>
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Search creators by username..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="max-w-sm"
        />
        <Button variant="outline"><Search className="h-4 w-4" /></Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Loading creators...</p>}
        
        {!isLoading && users?.length === 0 && (
          <p className="text-muted-foreground">
            {debouncedQuery ? 'No creators found.' : 'No creators available yet.'}
          </p>
        )}

        {users?.map((user) => (
          <Card 
            key={user.id} 
            className="cursor-pointer hover:bg-muted/50 transition" 
            onClick={() => navigate(`/subscriber/profile/${user.username}`)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio || "No bio available."}
              </p>
              <Button variant="link" className="px-0 mt-2">View Profile →</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explorer;