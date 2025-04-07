import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

interface OrderConfirmationState {
  orderId: string;
  orderDate: string;
  deliveryTime: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const orderData = location.state as OrderConfirmationState;
  
  // If no order data is present, redirect to home
  if (!orderData) {
    return <Navigate to="/" />;
  }
  
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your order has been successfully placed.
            </p>
          </div>
          
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              <dl className="mt-2 divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Order Number</dt>
                  <dd className="text-sm font-medium text-gray-900">{orderData.orderId}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Order Date</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(orderData.orderDate)}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Delivery Time</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(orderData.deliveryTime)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {orderData.items.map(item => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-900">{item.quantity} x {item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                <li className="py-2 flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-indigo-600">${orderData.total.toFixed(2)}</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    You will receive a notification when your meal is being prepared and when it's on the way.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Link
                to="/order-history"
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Order History
              </Link>
              <Link
                to="/"
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
