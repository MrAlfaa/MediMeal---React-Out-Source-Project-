import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

interface OrderConfirmationState {
  order: {
    _id: string;
    orderNumber: string;
    createdAt: string;
    deliveryDetails: {
      deliveryTime: string;
      wardNumber: string;
      bedNumber: string;
      specialInstructions?: string;
    };
    items: {
      _id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      category: string;
    }[];
    totalAmount: number;
    paymentDetails: {
      method: string;
      status: string;
      subtotal: number;
      deliveryFee: number;
      tax: number;
      totalPaid: number;
    };
    status: string;
  };
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const orderData = location.state as OrderConfirmationState;
  
  // If no order data is present, redirect to home
  if (!orderData || !orderData.order) {
    return <Navigate to="/" />;
  }
  
  const { order } = orderData;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'local' // Use local timezone
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDeliveryTime = (dateString: string) => {
    const deliveryDate = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return deliveryDate.toLocaleDateString(undefined, options);
  };  
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'hospital-account':
        return 'Hospital Account';
      case 'cash':
        return 'Cash on Delivery';
      case 'card':
        return 'Credit/Debit Card';
      default:
        return method;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'preparing':
        return 'text-blue-600 bg-blue-100';
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'delivered':
        return 'text-green-800 bg-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your order has been successfully placed and is being processed.
            </p>
            <div className="mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                  <dd className="text-sm font-medium text-gray-900">{order.orderNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Delivery Time</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDeliveryTime(order.deliveryDetails.deliveryTime)}</dd>
                </div>                <div>
                  <dt className="text-sm font-medium text-gray-500">Delivery Location</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Ward {order.deliveryDetails.wardNumber}, Bed {order.deliveryDetails.bedNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="text-sm font-medium text-gray-900">{getPaymentMethodDisplay(order.paymentDetails.method)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
                  </dd>
                </div>
              </dl>
              
              {order.deliveryDetails.specialInstructions && (
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                  <dd className="text-sm text-gray-900 mt-1 p-2 bg-yellow-50 rounded">
                    {order.deliveryDetails.specialInstructions}
                  </dd>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {order.items.map(item => (
                    <li key={item._id} className="p-4 flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">${order.paymentDetails.subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Delivery Fee</dt>
                    <dd className="font-medium text-gray-900">${order.paymentDetails.deliveryFee.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="font-medium text-gray-900">${order.paymentDetails.tax.toFixed(2)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <dt className="text-base font-medium text-gray-900">Total Paid</dt>
                    <dd className="text-base font-medium text-indigo-600">${order.paymentDetails.totalPaid.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">What's Next?</h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>You will receive notifications when your meal preparation begins</li>
                      <li>Another notification will be sent when your meal is ready for delivery</li>
                      <li>Our delivery team will bring your meal to your room at the scheduled time</li>
                      {order.paymentDetails.method === 'cash' && (
                        <li className="font-medium">Please have ${order.paymentDetails.totalPaid.toFixed(2)} ready for cash payment</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/orders"
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                View All Orders
              </Link>
              <Link
                to="/menu"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Order More Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
