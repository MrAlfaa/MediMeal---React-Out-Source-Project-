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
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  deliveryTime: string;
  specialInstructions?: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/orders');
        setOrders(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    // Mock data for demonstration
    setTimeout(() => {
      setOrders([
        {
          id: '60d21b4967d0d8992e610c85',
          userId: '60d21b4967d0d8992e610c80',
          items: [
            { id: '1', name: 'Vegetable Soup', price: 5.99, quantity: 1 },
            { id: '2', name: 'Grilled Chicken Salad', price: 8.99, quantity: 1 }
          ],
          totalAmount: 14.98,
          status: 'delivered',
          deliveryTime: 'June 22, 2023 - 12:30 PM',
          createdAt: '2023-06-22T12:00:00Z'
        },
        {
          id: '60d21b4967d0d8992e610c86',
          userId: '60d21b4967d0d8992e610c80',
          items: [
            { id: '3', name: 'Fruit Platter', price: 6.99, quantity: 1 },
            { id: '4', name: 'Whole Grain Bread', price: 3.49, quantity: 1 },
            { id: '5', name: 'Fresh Orange Juice', price: 2.99, quantity: 1 }
          ],
          totalAmount: 13.47,
          status: 'processing',
          deliveryTime: 'June 23, 2023 - 8:00 AM',
          specialInstructions: 'Please ensure fruit is ripe',
          createdAt: '2023-06-22T20:00:00Z'
        },
        {
          id: '60d21b4967d0d8992e610c87',
          userId: '60d21b4967d0d8992e610c80',
          items: [
            { id: '6', name: 'Vegetarian Pasta', price: 9.99, quantity: 1 },
            { id: '7', name: 'Garden Salad', price: 4.99, quantity: 1 },
            { id: '8', name: 'Sparkling Water', price: 1.99, quantity: 1 }
          ],
          totalAmount: 16.97,
          status: 'pending',
          deliveryTime: 'June 23, 2023 - 6:30 PM',
          specialInstructions: 'No dressing on salad please',
          createdAt: '2023-06-23T10:00:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);

    // In a real app, you would uncomment this to fetch actual data
    // fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      // Update the order status in the UI
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
      console.error('Error cancelling order:', err);
    }
  };

  // Function to format date
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

  // Function to get status badge color
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">My Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Order History</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
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
            <div className="space-y-4 sm:space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white shadow overflow-hidden rounded-lg">
                  <div className="px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
                        Order #{order.id.substring(order.id.length - 6)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Delivery Time</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.deliveryTime}</dd>
                      </div>
                      <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Items</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <li key={item.id} className="px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                                <div className="flex-1 min-w-0">
                                  <span className="truncate">
                                    {item.quantity} x {item.name}
                                  </span>
                                </div>
                                <div className="mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">
                                  ${item.price.toFixed(2)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      {order.specialInstructions && (
                        <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.specialInstructions}</dd>
                        </div>
                      )}
                      <div className={`${order.specialInstructions ? 'bg-white' : 'bg-gray-50'} px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                        <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900 sm:mt-0 sm:col-span-2">${order.totalAmount.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => alert('Cancel order functionality would be implemented here')}
                      >
                        Cancel Order
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => alert('Track order functionality would be implemented here')}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Place New Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
