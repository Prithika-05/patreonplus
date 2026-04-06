import api from '@/lib/axios';

export const contentService = {
  getAllContents: async () => {
    const response = await api.get('/contents/');
    return response.data;
  },

  createContent: async (data) => {
    const response = await api.post('/contents/create', data);
    return response.data;
  },

  updateContent: async (id, data) => {
    const response = await api.put(`/contents/update/${id}`, data);
    return response.data;
  },

  deleteContent: async (id) => {
    const response = await api.delete(`/contents/delete/${id}`);
    return response.data;
  },
};