import axios from 'axios';

export interface OrderStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  statusCounts: Array<{ _id: string; count: number }>;
}

class OrderService {
  private baseURL = '/api/orders';

  async getAllOrders(filters?: { status?: string; limit?: number; page?: number }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.page) params.append('page', filters.page.toString());

      const response = await axios.get(`${this.baseURL}/admin/all?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await axios.patch(`${this.baseURL}/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await axios.get(`${this.baseURL}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    try {
      const response = await axios.get(`${this.baseURL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;