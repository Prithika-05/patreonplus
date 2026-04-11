import { useQuery } from '@tanstack/react-query';
import { contentService } from '../../services/content.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Play, FileText, ExternalLink } from 'lucide-react';

const Feed = () => {
  const {data: contents, isLoading } = useQuery({
    queryKey: ['subscriber-feed'],
    queryFn: contentService.getSubscriberFeed,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Your Feed</h2>
      
      {contents?.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
          <h3 className="text-lg font-medium">No Content Yet</h3>
          <p className="text-muted-foreground">
            Subscribe to creators to see their content here.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/subscriber/explore'}>
            Explore Creators
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {contents?.map((content) => (
            <Card key={content.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{content.creator?.name?.[0] || 'C'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{content.creator?.name}</span>
                      <span>•</span>
                      <Badge variant="secondary">{content.tier?.name}</Badge>
                      <span>•</span>
                      <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">{content.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {content.fileUrl.match(/\.(mp4|mov|avi)$/i) ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span>
                      {content.fileUrl.match(/\.(mp4|mov|avi)$/i) ? 'Video Content' : 'Document'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={content.fileUrl} target="_blank" rel="noreferrer">
                      View Content <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;