import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  deliveryTime: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/orders/history');
        setOrders(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };
    
    // Mock data for demonstration
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2023-001',
          date: '2023-05-15T10:30:00Z',
          status: 'delivered',
          items: [
            { id: '1', name: 'Vegetable Soup', price: 5.99, quantity: 1 },
            { id: '2', name: 'Grilled Chicken Salad', price: 8.99, quantity: 1 }
          ],
          total: 14.98,
          deliveryTime: '2023-05-15T12:00:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORD-2023-002',
          date: '2023-05-16T18:45:00Z',
          status: 'preparing',
          items: [
            { id: '3', name: 'Whole Grain Pasta', price: 7.99, quantity: 1 },
            { id: '5', name: 'Herbal Tea', price: 2.99, quantity: 2 }
          ],
          total: 13.97,
          deliveryTime: '2023-05-16T19:30:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
    
    // In a real app, we would call fetchOrders() here
  }, []);
  
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Order History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-gray-500">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
              <div className="mt-6">
                <Link
                  to="/menu"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            Order #{order.orderNumber}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Delivery: {formatDate(order.deliveryTime)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p className="font-medium text-gray-900">
                            Total: ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="sm:flex sm:flex-col">
                          <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                            <ul className="mt-2 divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <li key={item.id} className="py-2">
                                  <div className="flex justify-between">
                                    <div className="flex">
                                      <span className="text-sm text-gray-900">{item.quantity} x {item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
