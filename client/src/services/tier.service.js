import api from '@/lib/axios';

export const tierService = {
  getAllTiers: async () => {
    const response = await api.get('/tiers/');
    return response.data;
  },

  createTier: async (data) => {
    const response = await api.post('/tiers/create', data);
    return response.data;
  },

  updateTier: async (id, data) => {
    const response = await api.put(`/tiers/update/${id}`, data);
    return response.data;
  },

  deleteTier: async (id) => {
    const response = await api.delete(`/tiers/delete/${id}`);
    return response.data;
  },
};