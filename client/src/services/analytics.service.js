import api from "@/lib/axios";

export const analyticsService = {
  getOverview: async (params = { range: 'all' }) => {
    const response = await api.get("/analytics/overview", { params });
    return response.data;
  },

  getRecentSubscribers: async () => {
    const response = await api.get("/analytics/recent-subscribers");
    return response.data;
  },

  getSubscriberGrowth: async (params = { range: 'all' }) => {
    const response = await api.get("/analytics/subscriber-growth", { params });
    return response.data;
  },

  getRevenueHistory: async (params = { range: 'all' }) => {
    const response = await api.get("/analytics/revenue-history", { params });
    return response.data;
  },

  getChurnRate: async () => {
    const response = await api.get("/analytics/churn");
    return response.data;
  },

  getTierPerformance: async () => {
    const response = await api.get("/analytics/tier-performance");
    return response.data;
  },

  getTopContent: async (limit = 10) => {
    const response = await api.get("/analytics/top-content", {
      params: { limit },
    });
    return response.data;
  },

  getContentEngagement: async (contentId) => {
    const response = await api.get(`/analytics/content/${contentId}`);
    return response.data;
  },
};

export default analyticsService;
