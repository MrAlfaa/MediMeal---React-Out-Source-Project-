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
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<string | null>(null);

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
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex justify-between items-center p-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Refresh Orders
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="p-6 pb-20"> {/* Added extra bottom padding */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Enhanced Filter Tabs - Same as before */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Orders by Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { 
                    key: 'all', 
                    label: 'All Orders', 
                    icon: '📋', 
                    color: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
                    activeColor: 'bg-gray-100 text-gray-900 border-gray-300 shadow-sm'
                  },
                  { 
                    key: 'pending', 
                    label: 'Pending', 
                    icon: '⏳', 
                    color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200',
                    activeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm'
                  },
                  { 
                    key: 'accepted', 
                    label: 'Accepted', 
                    icon: '✅', 
                    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
                    activeColor: 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm'
                  },
                  { 
                    key: 'processing', 
                    label: 'Processing', 
                    icon: '👨‍🍳', 
                    color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
                    activeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300 shadow-sm'
                  },
                  { 
                    key: 'ready', 
                    label: 'Ready', 
                    icon: '🍽️', 
                    color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
                    activeColor: 'bg-green-100 text-green-800 border-green-300 shadow-sm'
                  },
                  { 
                    key: 'delivered', 
                    label: 'Delivered', 
                    icon: '🚚', 
                    color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
                    activeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                  },
                  { 
                    key: 'cancelled', 
                    label: 'Cancelled', 
                    icon: '❌', 
                    color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
                    activeColor: 'bg-red-100 text-red-800 border-red-300 shadow-sm'
                  }
                ].map(statusConfig => {
                  const count = statusConfig.key === 'all' 
                    ? orders.length 
                    : orders.filter(o => o.status === statusConfig.key).length;
                  const isActive = filter === statusConfig.key;
                  
                  return (
                    <button
                      key={statusConfig.key}
                      onClick={() => setFilter(statusConfig.key)}
                      className={`relative group p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md ${
                        isActive ? statusConfig.activeColor : statusConfig.color
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{statusConfig.icon}</span>
                        <div className="text-center">
                          <div className="font-semibold text-sm">{statusConfig.label}</div>
                          <div className="text-xs opacity-75 mt-1">
                            {count} order{count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                      )}
                      
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 bg-black transition-opacity duration-200"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orders List with improved layout */}
          <div className="space-y-6 min-h-0">
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
                  <div className="p-4 sm:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="mt-1 space-y-1">
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
                      </div>
                      <div className="flex flex-row sm:flex-col sm:text-right sm:ml-4 justify-between sm:justify-start items-center sm:items-end">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-gray-900 sm:mt-2">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
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

                    {/* Action Buttons - Always Visible */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
                      <p className="text-xs text-gray-500 order-2 sm:order-1">
                        Ordered: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'cancelled')}
                            disabled={updating === order._id}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 text-sm font-medium"
                          >
                            {updating === order._id ? 'Updating...' : 'Cancel Order'}
                          </button>
                        )}
                        
                        {getNextStatus(order.status) && order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, getNextStatus(order.status)!)}
                            disabled={updating === order._id}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                          >
                            {updating === order._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </>
                            ) : (
                              <>
                                <span className="mr-1">✓</span>
                                {getStatusActionText(order.status)}
                              </>
                            )}
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
      </div>
    </div>
  );
};

export default OrderManagement;