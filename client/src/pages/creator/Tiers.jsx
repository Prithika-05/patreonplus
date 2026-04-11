import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tierService } from '@/services/tier.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Crown, Clock, DollarSign, Sparkles, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tiers = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    unlockDuration: '' 
  });

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['tiers'],
    queryFn: tierService.getAllTiers,
  });

  const createMutation = useMutation({
    mutationFn: tierService.createTier,
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers']);
      toast.success('Tier created successfully!');
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create tier'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tierService.updateTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers']);
      toast.success('Tier updated successfully!');
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update tier'),
  });

  const deleteMutation = useMutation({
    mutationFn: tierService.deleteTier,
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers']);
      toast.success('Tier deleted successfully');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete tier'),
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', unlockDuration: '' });
    setEditingTier(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      unlockDuration: parseInt(formData.unlockDuration),
      level: editingTier ? editingTier.level : (tiers?.length || 0) + 1,
    };

    if (editingTier) {
      updateMutation.mutate({ id: editingTier.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (tier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description || '',
      price: tier.price.toString(),
      unlockDuration: tier.unlockDuration.toString(),
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tier? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Membership Tiers</h2>
          <p className="text-muted-foreground mt-1">Manage your subscription levels and pricing.</p>
        </div>
        
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 group">
              <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
              Create New Tier
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50">
            <div className="bg-gradient-to-r from-primary to-violet-600 p-6 text-primary-foreground">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {editingTier ? 'Edit Membership Tier' : 'Create New Tier'}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  {editingTier ? 'Update the details of your existing tier.' : 'Define a new level for your subscribers to access exclusive content.'}
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-card">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Tier Name</Label>
                  <div className="relative">
                    <Crown className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="e.g., Gold Supporter"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="description"
                      placeholder="What do subscribers get?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-semibold">Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-semibold">Duration (Days)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        placeholder="30"
                        value={formData.unlockDuration}
                        onChange={(e) => setFormData({ ...formData, unlockDuration: e.target.value })}
                        required
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{formData.name || 'Tier Name'}</h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{formData.description || 'Description goes here...'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${formData.price || '0'}</div>
                      <div className="text-[10px] text-muted-foreground">/{formData.unlockDuration || '0'} days</div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (editingTier ? 'Update Tier' : 'Create Tier')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tiers && tiers.length > 0 ? (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {tiers.map((tier) => (
              <motion.div
                key={tier.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/30"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-violet-500" />
                
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Crown className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      Level {tier.level}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {tier.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-bold text-foreground">${tier.price}</span>
                    <span className="text-sm text-muted-foreground">/ {tier.unlockDuration} days</span>
                  </div>
                </div>

                <div className="border-t border-border/60 bg-muted/20 p-4 flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(tier)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(tier.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Tiers Created Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Start by creating your first membership tier to offer exclusive content to your subscribers.
          </p>
          <Button className="mt-6" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create First Tier
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tiers;