import api from '@/lib/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    const { accessToken, refreshToken, user } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  signup: async (name, username, email, password, role) => {
    const response = await api.post('/auth/signup', { name, username, email, password, role });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    return user && token ? { user: JSON.parse(user), token } : null;
  }
};