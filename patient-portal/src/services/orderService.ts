import axios from 'axios';

export interface OrderItem {
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
  allergens?: string[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  deliveryDetails: {
    wardNumber: string;
    bedNumber: string;
    deliveryTime: string;
    specialInstructions?: string;
  };
  paymentDetails: {
    method: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    totalPaid: number;
  };
  createdAt: string;
  updatedAt: string;
}

class OrderService {
  private baseURL = '/orders';

  async getUserOrders(): Promise<Order[]> {
    try {
      console.log('Fetching orders from:', `${axios.defaults.baseURL}${this.baseURL}`);
      const response = await axios.get(this.baseURL);
      console.log('Orders fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user orders:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        fullURL: `${axios.defaults.baseURL}${this.baseURL}`
      });
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${this.baseURL}/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        orderId
      });
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await axios.patch(`${this.baseURL}/${orderId}/cancel`);
      return response.data.order;
    } catch (error: any) {
      console.error('Error cancelling order:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        orderId
      });
      throw error;
    }
  }

  async reorderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const order = await this.getOrderById(orderId);
      return order.items;
    } catch (error) {
      console.error('Error getting order for reorder:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;