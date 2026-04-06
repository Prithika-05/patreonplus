import api from '@/lib/axios';

export const userService = {
  searchUsers: async (query) => {
    const response = await api.get(`/users/search?query=${query}`);
    return response.data;
  },

  getPublicProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },
};