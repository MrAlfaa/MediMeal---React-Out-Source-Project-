import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OrderItem {
  menuItem: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    fullName: string;
    wardNumber: string;
    bedNumber: string;
    patientId: string;
  };
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
  };
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/admin/all');
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      console.log(`Updating order ${orderId} to status ${newStatus}`);
      
      const response = await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
      
      // Update the order in the local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      
      setError(null);
      console.log('Order status updated successfully:', response.data);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Failed to update order status';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'accepted';
      case 'accepted': return 'processing';
      case 'processing': return 'ready';
      case 'ready': return 'delivered';
      default: return null;
    }
  };

  const getStatusActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Accept Order';
      case 'accepted': return 'Start Processing';
      case 'processing': return 'Mark Ready';
      case 'ready': return 'Mark Delivered';
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatDeliveryTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['all', 'pending', 'accepted', 'processing', 'ready', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  filter === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status === 'all' ? 'All Orders' : status}
                <span className="ml-2 text-xs">
                  ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'No orders have been placed yet.' : `No orders with status "${filter}".`}
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Patient: {order.user.fullName} (ID: {order.user.patientId})
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: Ward {order.deliveryDetails.wardNumber}, Bed {order.deliveryDetails.bedNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Delivery Time: {formatDeliveryTime(order.deliveryDetails.deliveryTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                          <p className="text-xs font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                {order.deliveryDetails.specialInstructions && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Special Instructions:</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      {order.deliveryDetails.specialInstructions}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Ordered: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex space-x-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {updating === order._id ? 'Updating...' : 'Cancel'}
                      </button>
                    )}
                    
                    {getNextStatus(order.status) && order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status)!)}
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {updating === order._id ? 'Updating...' : getStatusActionText(order.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;