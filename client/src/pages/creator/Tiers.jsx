import { useState } from 'react';   
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tierService } from '@/services/tier.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Edit } from 'lucide-react';

const Tiers = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', unlockDuration: '' });

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['tiers'],
    queryFn: tierService.getAllTiers,
  });

  const createMutation = useMutation({
    mutationFn: tierService.createTier,
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers']);
      toast.success('Tier created successfully');
      setOpen(false);
      resetForm();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create tier'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tierService.updateTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tiers']);
      toast.success('Tier updated successfully');
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
      price: tier.price,
      unlockDuration: tier.unlockDuration,
    });
    setOpen(true);
  };

  if (isLoading) return <div>Loading tiers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tiers</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTier ? 'Edit Tier' : 'Create New Tier'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div>
                  <Label>Duration (Days)</Label>
                  <Input type="number" value={formData.unlockDuration} onChange={(e) => setFormData({ ...formData, unlockDuration: e.target.value })} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTier ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers?.map((tier) => (
              <TableRow key={tier.id}>
                <TableCell className="font-medium">{tier.name}</TableCell>
                <TableCell>${tier.price}</TableCell>
                <TableCell>{tier.unlockDuration} days</TableCell>
                <TableCell>{tier.level}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(tier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(tier.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tiers;