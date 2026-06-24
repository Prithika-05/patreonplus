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
import { contentSchema } from "@/validations/content.schema";
import { uploadFile } from "@/services/upload.service";

const Contents = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileKey: '',
    tierId: '',
    previewUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const { data: contentsResponse, isLoading } = useQuery({
    queryKey: ['contents'],
    queryFn: contentService.getAllContents, // Or your custom API function string
  });

  const contents = Array.isArray(contentsResponse)
    ? contentsResponse
    : (contentsResponse?.data || contentsResponse?.data?.data || []);

  const { data: tiersResponse } = useQuery({
    queryKey: ['tiers'],
    queryFn: tierService.getAllTiers,
  });

  const tiers = Array.isArray(tiersResponse)
    ? tiersResponse
    : (tiersResponse?.data || tiersResponse?.data?.data || []);

  const selectedTier = tiers?.find(
    (tier) => tier.id === formData.tierId
  );

  const createMutation = useMutation({
    mutationFn: contentService.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      toast.success('Content published successfully!');
      setOpen(false);
      setFormData({ title: '', description: '', fileKey: '', tierId: '', previewUrl: '' });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create content'),
  });

  const deleteMutation = useMutation({
    mutationFn: contentService.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      toast.success('Content deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete content'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = contentSchema.safeParse({
      title: formData.title,
      description: formData.description,
      fileKey: formData.fileKey,
      previewUrl: formData.previewUrl,
      tierId: formData.tierId
    });

    if (!validation.success) {
      const fieldErrors = {};

      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      return;
    }

    setErrors({});

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      fileKey: formData.fileKey,
      previewUrl: formData.previewUrl,
      tierId: formData.tierId

    });
  };

  const getCleanPath = (url) => {
    if (!url) return '';
    return url.split('?')[0];
  };


  const getFileIcon = (url) => {
    if (!url) return <FileText className="h-6 w-6 text-muted-foreground" />;
    const cleanUrl = url.split('?')[0];
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(cleanUrl)) return <ImageIcon className="h-6 w-6 text-blue-500" />; if (/\.(mp4|mov|avi|mkv)$/i.test(cleanUrl)) return <Video className="h-6 w-6 text-red-500" />; return <FileText className="h-6 w-6 text-muted-foreground" />;
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
          <DialogTrigger aschild="true">
            <button className="inline-flex shrink-0 items-center justify-center rounded-md font-medium text-sm transition-colors bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 h-9 px-4 py-2 group">
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              Add New Content
            </button>
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
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title}
                    </p>
                  )}
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
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="file" className="text-sm font-semibold">Upload Content Media</Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      accept="image/jpeg,image/png,application/pdf,video/mp4"
                      onChange={async (e) => {
                        const selectedFile = e.target.files[0];
                        if (!selectedFile) return;

                        if (errors.fileUrl) {
                          setErrors({ ...errors, fileUrl: "" });
                        }

                        try {
                          setIsUploading(true);
                          toast.loading("Uploading asset securely to AWS S3...", { id: "s3-upload" });

                          const uploadResult = await uploadFile(selectedFile);

                          const { key, url } = uploadResult.data;

                          setFormData({
                            ...formData,
                            fileKey: key,
                            previewUrl: url
                          });

                          toast.success("Media uploaded successfully!", { id: "s3-upload" });
                        } catch (uploadError) {
                          console.error("S3 upload failed:", uploadError);
                          setErrors({
                            ...errors,
                            fileUrl: uploadError.response?.data?.message || uploadError.message || "Failed to upload file to S3."
                          });
                          toast.error("Upload failed. Please check constraints.", { id: "s3-upload" });
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      className="cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                    />
                  </div>

                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="tier" className="text-sm font-semibold">Access Level</Label>
                  <Select
                  value={formData.tierId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, tierId: val })
                  }
                  required
                >
                  <SelectTrigger>
                    <span className="truncate">
                      {selectedTier
                        ? `${selectedTier.name} ($${selectedTier.price})`
                        : "Select who can view this"}
                    </span>
                  </SelectTrigger>

                  <SelectContent>
                    {tiers?.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tier.name}</span>
                          <span className="text-xs text-muted-foreground">
                            (${tier.price})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  {errors.tierId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.tierId}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                // disabled={isUploading || !formData.fileUrl || createMutation.isPending}
                >
                  {isUploading ? 'Uploading File...' : createMutation.isPending ? 'Publishing...' : 'Publish Content'}
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
            {Array.isArray(contents) &&
              (() => {
                const flatTiers = Array.isArray(tiers)
                  ? tiers
                  : (tiers?.data || tiers?.data?.data || []);

                return contents.map((content) => {
                  const tier = flatTiers.find((t) => t.id === content.tierId);

                  const cleanFilePath = getCleanPath(content.previewUrl);

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
                        <div className="w-full h-full text-muted-foreground/40 transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                          {/\.(jpg|jpeg|png|webp)$/i.test(cleanFilePath) ? (
                            <img src={content.previewUrl} className="h-full w-full object-cover" alt="" />
                          ) : /\.(mp4|webm)$/i.test(cleanFilePath) ? (
                            <video src={content.previewUrl} controls className="h-full w-full object-contain bg-black" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 font-medium text-sm">
                              {getFileIcon(content.previewUrl)}
                              <span>Secure Attachment</span>
                            </div>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white border border-white/10">
                            <Lock className="h-3 w-3" />
                            {tier?.name || "Restricted"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 p-5">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <h3 className="font-bold text-foreground leading-tight line-clamp-2">
                            {content.title}
                          </h3>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {content.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                          <a
                            href={content.previewUrl}
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
                });
              })()}
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