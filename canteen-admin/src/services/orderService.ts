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

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    wardNumber: string;
    bedNumber: string;
    patientId: string;
  };
  items: Array<{
    menuItem: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    price: number;
    category: string;
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    allergens: string[];
  }>;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  deliveryDetails: {
    wardNumber: string;
    bedNumber: string;
    deliveryTime: string;
    specialInstructions: string;
  };
  paymentDetails: {
    method: string;
    status: string;
    transactionId?: string;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    totalPaid: number;
  };
  createdAt: string;
  updatedAt: string;
}

class OrderService {
  private baseURL = '/orders'; // Fixed: removed /api prefix since axios baseURL already includes it

  async getAllOrders(filters?: { status?: string; limit?: number; page?: number }): Promise<Order[]> {
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
      // Return default stats if API fails
      return {
        totalOrders: 0,
        todayOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        todayRevenue: 0,
        totalRevenue: 0,
        statusCounts: []
      };
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${this.baseURL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.baseURL}/admin/all?limit=${limit}&page=1`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }

  async getOrdersByStatus(status: string, limit: number = 10): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.baseURL}/admin/all?status=${status}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();
export default orderService;