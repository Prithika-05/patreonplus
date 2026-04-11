import { useQuery } from '@tanstack/react-query';
import { contentService } from '../../services/content.service';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, FileText, ExternalLink, Heart, MessageCircle, Share2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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

const Feed = () => {
  const { data: contents, isLoading } = useQuery({
    queryKey: ['subscriber-feed'],
    queryFn: contentService.getSubscriberFeed,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-6 shadow-sm animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
            <div className="h-48 w-full rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getFileType = (url) => {
    if (!url) return 'document';
    if (/\.(mp4|mov|avi|mkv)$/i.test(url)) return 'video';
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'image';
    return 'document';
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Your Feed</h2>
          <p className="text-muted-foreground mt-1">Latest exclusive content from creators you support.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
           Live Updates
        </div>
      </motion.div>
      
      {contents?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Your feed is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            You haven't subscribed to any creators yet. Explore amazing creators and unlock exclusive content today!
          </p>
          <Button className="mt-6 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/subscriber/explore'}>
            Explore Creators
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {contents?.map((content) => {
            const fileType = getFileType(content.fileUrl);
            const creatorInitial = content.creator?.name?.[0] || 'C';
            
            return (
              <motion.div key={content.id} variants={itemVariants} layout>
                <Card className="overflow-hidden border-border/60 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-card/50 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={content.creator?.avatarUrl} alt={content.creator?.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-sm font-bold">
                            {creatorInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" title="Online"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <CardTitle className="text-base font-bold leading-none text-foreground hover:underline cursor-pointer">
                             {content.creator?.name}
                           </CardTitle>
                           <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-primary/10 text-primary border-primary/20">
                             {content.tier?.name}
                           </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(content.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                       <Share2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="relative w-full h-60 bg-muted/30 aspect-video flex items-center justify-center group-hover:bg-muted/40 transition-colors overflow-hidden">
                       {fileType === 'video' && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                               <Play className="h-6 w-6 fill-white text-white ml-1" />
                            </div>
                         </div>
                       )}
                       
                       <div className="text-muted-foreground/40 transform group-hover:scale-105 transition-transform duration-700">
                          {fileType === 'video' ? <Play className="h-20 w-20" /> : 
                           fileType === 'image' ? <div className="h-20 w-20 bg-muted-foreground/10 rounded-lg" /> : 
                           <FileText className="h-20 w-20" />}
                       </div>

                       {/* Locked Overlay (Optional visual cue if needed, though they have access) */}
                       <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-border/50 text-xs">
                             <Lock className="h-3 w-3 mr-1" /> Exclusive
                          </Badge>
                       </div>
                    </div>


                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{content.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {content.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4">
                           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-2">
                              <Heart className="h-4 w-4" /> <span className="text-xs font-medium">Like</span>
                           </Button>
                           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2">
                              <MessageCircle className="h-4 w-4" /> <span className="text-xs font-medium">Comment</span>
                           </Button>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                          asChild
                        >
                          <a href={content.fileUrl} target="_blank" rel="noreferrer">
                            View Full {fileType === 'video' ? 'Video' : 'Content'} 
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default Feed;