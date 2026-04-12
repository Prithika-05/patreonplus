import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';
import { tierService } from '@/services/tier.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, ExternalLink, FileText, Image as ImageIcon, Video, Lock, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contents = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '', tierId: '' });

  const { data: contents, isLoading } = useQuery({
    queryKey: ['contents'],
    queryFn: contentService.getAllContents,
  });

  const { data: tiers } = useQuery({
    queryKey: ['tiers'],
    queryFn: tierService.getAllTiers,
  });

  const createMutation = useMutation({
    mutationFn: contentService.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries(['contents']);
      toast.success('Content published successfully!');
      setOpen(false);
      setFormData({ title: '', description: '', fileUrl: '', tierId: '' });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create content'),
  });

  const deleteMutation = useMutation({
    mutationFn: contentService.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries(['contents']);
      toast.success('Content deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete content'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getFileIcon = (url) => {
    if (!url) return <FileText className="h-6 w-6" />;
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return <ImageIcon className="h-6 w-6" />;
    if (/\.(mp4|mov|avi|mkv)$/i.test(url)) return <Video className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Content Library</h2>
          <p className="text-muted-foreground mt-1">Manage your exclusive posts, videos, and files.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 group">
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
              Add New Content
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-border/50">
            <div className="bg-gradient-to-r from-primary to-violet-600 p-6 text-primary-foreground">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Publish New Content
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Share exclusive media with your subscribers.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Content Title</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="title"
                      placeholder="e.g., Behind the Scenes Vlog"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="description"
                      placeholder="Briefly describe this content..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fileUrl" className="text-sm font-semibold">Media URL</Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fileUrl"
                      placeholder="https://cdn.example.com/video.mp4"
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      required
                      className="pl-9 font-mono text-xs"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Direct link to image, video, or document.</p>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="tier" className="text-sm font-semibold">Access Level</Label>
                  <Select value={formData.tierId} onValueChange={(val) => setFormData({ ...formData, tierId: val })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who can view this" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers?.map((tier) => (
                        <SelectItem key={tier.id} value={tier.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tier.name}</span>
                            <span className="text-xs text-muted-foreground">(${tier.price})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Publishing...' : 'Publish Content'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contents && contents.length > 0 ? (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {contents.map((content) => {
              const tier = tiers?.find(t => t.id === content.tierId);
              return (
                <motion.div
                  key={content.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/30"
                >
                  <div className="relative aspect-video w-full bg-muted/50 flex items-center justify-center overflow-hidden">
                     <div className="text-muted-foreground/40 transform group-hover:scale-110 transition-transform duration-500">
                        {getFileIcon(content.fileUrl)}
                     </div>
                     
                     <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white border border-white/10">
                          <Lock className="h-3 w-3" />
                          {tier?.name || 'Restricted'}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 p-5">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground leading-tight line-clamp-2">{content.title}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {content.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                      <a 
                        href={content.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        View File <ExternalLink className="h-3 w-3" />
                      </a>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMutation.mutate(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Content Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Your library is empty. Start creating exclusive content for your subscribers today.
          </p>
          <Button className="mt-6" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default Contents;