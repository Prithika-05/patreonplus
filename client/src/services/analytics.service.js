import api from "@/lib/axios";

export const analyticsService = {
  /**
   * Fetches real-time overview metrics from the backend API
   * @returns {Promise<{success: boolean, data: {totalSubscribers: number, totalContent: number, monthlyRevenue: number}}>}
   */
  getOverview: async () => {
    const response = await api.get("/analytics/overview");
    return response.data; 
  },
};
