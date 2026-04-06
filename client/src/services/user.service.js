import api from '@/lib/axios';

export const userService = {
  searchUsers: async (query) => {
    if (!query) {
      const response = await api.get('/users/search?query=');
      return response.data;
    }
    const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getPublicProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },
};