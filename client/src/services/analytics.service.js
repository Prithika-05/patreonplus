import api from "@/lib/axios";

export const analyticsService = {
  getOverview: async () => {
    const res = await api.get("/analytics/overview");
    return res.data;
  },

  getRevenueHistory: async () => {
    const res = await api.get(
      "/analytics/revenue-history"
    );
    return res.data;
  },

  getTierPerformance: async () => {
    const res = await api.get(
      "/analytics/tier-performance"
    );
    return res.data;
  },

  getChurnRate: async () => {
    const res = await api.get(
      "/analytics/churn"
    );
    return res.data;
  },

  getRecentSubscribers: async () => {
    const res = await api.get(
      "/analytics/recent-subscribers"
    );
    return res.data;
  },
};