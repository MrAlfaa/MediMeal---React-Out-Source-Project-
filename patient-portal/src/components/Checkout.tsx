import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // In a real app, this would come from a cart context or state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Vegetable Soup', price: 5.99, quantity: 1 },
    { id: '3', name: 'Whole Grain Pasta', price: 7.99, quantity: 1 }
  ]);
  
  const [deliveryTime, setDeliveryTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('hospital-account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Free delivery within hospital
  const total = subtotal + deliveryFee;
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!deliveryTime) {
      setError('Please select a delivery time');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, this would be an API call to create an order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful order
      navigate('/order-confirmation', { 
        state: { 
          orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
          orderDate: new Date().toISOString(),
          deliveryTime,
          items: cartItems,
          total
        } 
      });
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate delivery time options (every 30 minutes for the next 8 hours)
  const getDeliveryTimeOptions = () => {
    const options = [];
    const now = new Date();
    const startTime = new Date(now);
    startTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30); // Round up to next 30 min
    
    for (let i = 0; i < 16; i++) {
      const time = new Date(startTime);
      time.setMinutes(time.getMinutes() + (i * 30));
      
      const formattedTime = time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      
      options.push({
        value: time.toISOString(),
        label: formattedTime
      });
    }
    
    return options;
  };
  
  const deliveryTimeOptions = getDeliveryTimeOptions();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/menu" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
          )}
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <div className="lg:col-span-7">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
                </div>
                <div className="border-t border-gray-200">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Your cart is empty</p>
                      <div className="mt-4">
                        <Link
                          to="/menu"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Browse Menu
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map(item => (
                        <li key={item.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                title="Decrease quantity"
                                aria-label="Decrease quantity"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                title="Increase quantity"
                                aria-label="Increase quantity"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="ml-4 text-red-400 hover:text-red-500"
                                onClick={() => handleRemoveItem(item.id)}
                                title="Remove item"
                                aria-label="Remove item"
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}                    </ul>
                  )}
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delivery Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
                          Delivery Time
                        </label>
                        <select
                          id="deliveryTime"
                          name="deliveryTime"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          required
                        >
                          <option value="">Select a delivery time</option>
                          {deliveryTimeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                          Special Instructions (Optional)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="specialInstructions"
                            name="specialInstructions"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Any dietary preferences or delivery instructions"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Payment Method
                        </label>
                        <div className="mt-2 space-y-3">
                          <div className="flex items-center">
                            <input
                              id="hospital-account"
                              name="paymentMethod"
                              type="radio"
                              checked={paymentMethod === 'hospital-account'}
                              onChange={() => setPaymentMethod('hospital-account')}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="hospital-account" className="ml-3 block text-sm font-medium text-gray-700">
                              Hospital Account (Billed to your stay)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="credit-card"
                              name="paymentMethod"
                              type="radio"
                              checked={paymentMethod === 'credit-card'}
                              onChange={() => setPaymentMethod('credit-card')}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                              Credit Card
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:col-span-5">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Delivery Fee</dt>
                      <dd className="text-sm font-medium text-gray-900">${deliveryFee.toFixed(2)}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-base font-medium text-indigo-600">${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-gray-500">
                            Your meal will be delivered to Ward {user?.wardNumber}, Bed {user?.bedNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting || cartItems.length === 0}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting || cartItems.length === 0
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
