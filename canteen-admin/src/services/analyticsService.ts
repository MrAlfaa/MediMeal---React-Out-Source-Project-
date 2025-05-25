import axios from 'axios';

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface SalesAnalytics {
  salesData: SalesData[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

export interface MenuPerformance {
  topItems: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    quantity: number;
    revenue: number;
    orders: number;
  }>;
}

export interface CustomerAnalytics {
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    ward: string;
    bed: string;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
  }>;
  wardAnalytics: Array<{
    ward: string;
    orders: number;
    revenue: number;
  }>;
}

export interface OrderAnalytics {
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
  hourlyTrends: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
}

export interface ReportData {
  reportGenerated: string;
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalMenuItems: number;
    totalUsers: number;
  };
  topMenuItems: any[];
  orderStatusBreakdown: any[];
  userRoleBreakdown: any[];
}

class AnalyticsService {
  private baseURL = '/analytics';

  async getSalesAnalytics(period: string = '30d', startDate?: string, endDate?: string): Promise<SalesAnalytics> {
    try {
      const params = new URLSearchParams();
      params.append('period', period);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${this.baseURL}/sales?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  async getMenuPerformance(period: string = '30d'): Promise<MenuPerformance> {
    try {
      const response = await axios.get(`${this.baseURL}/menu-performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu performance:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(period: string = '30d'): Promise<CustomerAnalytics> {
    try {
      const response = await axios.get(`${this.baseURL}/customers?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  async getOrderAnalytics(period: string = '30d'): Promise<OrderAnalytics> {
    try {
      const response = await axios.get(`${this.baseURL}/orders?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      throw error;
    }
  }

  async generateReport(format: 'json' | 'pdf' = 'json', period: string = '30d', startDate?: string, endDate?: string): Promise<ReportData | Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      params.append('period', period);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${this.baseURL}/report?${params}`, {
        responseType: format === 'pdf' ? 'blob' : 'json'
      });

      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async downloadReport(period: string = '30d', startDate?: string, endDate?: string): Promise<void> {
    try {
      const blob = await this.generateReport('pdf', period, startDate, endDate) as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medimeal-report-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;