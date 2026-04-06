import api from '@/lib/axios';

export const subscriptionService = {
  subscribe: async (tierId) => {
    const response = await api.post('/subscriptions/subscribe', { tierId });
    return response.data;
  },

  getMySubscriptions: async () => {
    const response = await api.get('/subscriptions/my-subscriptions');
    return response.data;
  },

  cancelSubscription: async (id) => {
    const response = await api.patch(`/subscriptions/cancel/${id}`);
    return response.data;
  },
};