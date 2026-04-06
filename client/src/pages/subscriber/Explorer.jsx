import { useState } from 'react';
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
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['search-users', query],
    queryFn: () => userService.searchUsers(query),
    enabled: query.length > 2, 
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Explore Creators</h2>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Search by username..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="max-w-sm"
        />
        <Button variant="outline"><Search className="h-4 w-4" /></Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p>Searching...</p>}
        {users?.length === 0 && query.length > 2 && <p>No users found.</p>}
        {users?.map((user) => (
          <Card key={user.id} className="cursor-pointer hover:bg-muted/50 transition" onClick={() => navigate(`/subscriber/profile/${user.username}`)}>
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
              <p className="text-sm text-muted-foreground line-clamp-2">{user.bio || "No bio available."}</p>
              <Button variant="link" className="px-0 mt-2">View Profile →</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explorer;