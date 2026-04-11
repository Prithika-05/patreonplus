import api from '../lib/axios';
import { tierService } from './tier.service';
import { contentService } from './content.service';

export const analyticsService = {
  getCreatorOverview: async () => {
    const [tiers, contents] = await Promise.all([
      tierService.getAllTiers(),
      contentService.getAllContents(),
    ]);

    const mockSubscribers = 12; 
    const mockRevenue = 450.00;

    return {
      totalTiers: tiers?.length || 0,
      totalContent: contents?.length || 0,
      activeSubscribers: mockSubscribers,
      totalRevenue: mockRevenue,
      recentActivity: [
        { id: 1, user: 'John Doe', action: 'Subscribed to Pro', date: new Date().toISOString() },
        { id: 2, user: 'Jane Smith', action: 'Subscribed to Basic', date: new Date().toISOString() },
      ]
    };
  },
};