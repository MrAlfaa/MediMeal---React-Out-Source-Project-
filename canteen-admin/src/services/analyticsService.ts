import axios from 'axios';

export interface AnalyticsData {
  orderTrends: Array<{ name: string; value: number; date: string }>;
  categoryStats: Array<{ name: string; value: number; revenue: number }>;
  statusBreakdown: Array<{ name: string; value: number; color: string }>;
  revenueGrowth: {
    current: number;
    previous: number;
    percentage: number;
  };
  topMenuItems: Array<{
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
  userGrowth: Array<{ name: string; value: number }>;
}

class AnalyticsService {
  private baseURL = '/analytics';

  async getDashboardAnalytics(days: number = 7): Promise<AnalyticsData> {
    try {
      const response = await axios.get(`${this.baseURL}/dashboard?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return mock data if API fails
      return this.getMockAnalyticsData();
    }
  }

  private getMockAnalyticsData(): AnalyticsData {
    return {
      orderTrends: [
        { name: 'Mon', value: 24, date: '2024-01-15' },
        { name: 'Tue', value: 32, date: '2024-01-16' },
        { name: 'Wed', value: 28, date: '2024-01-17' },
        { name: 'Thu', value: 45, date: '2024-01-18' },
        { name: 'Fri', value: 38, date: '2024-01-19' },
        { name: 'Sat', value: 29, date: '2024-01-20' },
        { name: 'Sun', value: 19, date: '2024-01-21' }
      ],
      categoryStats: [
        { name: 'Main Courses', value: 45, revenue: 1250 },
        { name: 'Breakfast', value: 32, revenue: 890 },
        { name: 'Beverages', value: 28, revenue: 560 },
        { name: 'Desserts', value: 15, revenue: 340 },
        { name: 'Snacks', value: 22, revenue: 480 }
      ],
      statusBreakdown: [
        { name: 'Delivered', value: 145, color: '#10B981' },
        { name: 'Processing', value: 23, color: '#3B82F6' },
        { name: 'Pending', value: 12, color: '#F59E0B' },
        { name: 'Ready', value: 8, color: '#8B5CF6' },
        { name: 'Cancelled', value: 3, color: '#EF4444' }
      ],
      revenueGrowth: {
        current: 3520,
        previous: 2890,
        percentage: 21.8
      },
      topMenuItems: [
        { name: 'Grilled Chicken', orders: 45, revenue: 675, category: 'Main Courses' },
        { name: 'Caesar Salad', orders: 32, revenue: 384, category: 'Salads' },
        { name: 'Chocolate Cake', orders: 28, revenue: 420, category: 'Desserts' },
        { name: 'Orange Juice', orders: 35, revenue: 175, category: 'Beverages' },
        { name: 'Vegetable Soup', orders: 25, revenue: 250, category: 'Soups' }
      ],
      userGrowth: [
        { name: 'Jan', value: 120 },
        { name: 'Feb', value: 135 },
        { name: 'Mar', value: 142 },
        { name: 'Apr', value: 156 },
        { name: 'May', value: 168 },
        { name: 'Jun', value: 175 }
      ]
    };
  }

  async getRevenueAnalytics(period: 'week' | 'month' | 'quarter' | 'year') {
    try {
      const response = await axios.get(`${this.baseURL}/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  async getMenuPerformance() {
    try {
      const response = await axios.get(`${this.baseURL}/menu-performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu performance:', error);
      throw error;
    }
  }

  async getCustomerInsights() {
    try {
      const response = await axios.get(`${this.baseURL}/customer-insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;