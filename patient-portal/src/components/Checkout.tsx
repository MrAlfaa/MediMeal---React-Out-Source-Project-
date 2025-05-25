import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [deliveryTime, setDeliveryTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('hospital-account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Card payment fields
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  // Hospital account fields
  const [hospitalAccountId, setHospitalAccountId] = useState('');
  
  const subtotal = cartTotal;
  const deliveryFee = 0; // Free delivery within hospital
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;
  
  const handleCardDetailsChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
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

    // Validate payment method specific fields
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv || !cardDetails.cardholderName) {
        setError('Please fill in all card details');
        return;
      }
    }

    if (paymentMethod === 'hospital-account' && !hospitalAccountId) {
      setError('Please enter your hospital account ID');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const orderData = {
        items: cartItems.map(item => ({
          menuItem: item._id,
          name: item.name,
          description: item.description,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
          nutritionalInfo: item.nutritionalInfo || {},
          allergens: item.allergens || []
        })),
        totalAmount: total,
        deliveryDetails: {
          wardNumber: user?.wardNumber || '',
          bedNumber: user?.bedNumber || '',
          deliveryTime: deliveryTime,
          specialInstructions: specialInstructions
        },
        paymentDetails: {
          method: paymentMethod,
          subtotal,
          deliveryFee,
          tax,
          totalPaid: total,
          status: paymentMethod === 'cash' ? 'pending' : 'processing',
          ...(paymentMethod === 'card' && {
            cardDetails: {
              last4: cardDetails.cardNumber.slice(-4),
              brand: 'visa', // You would detect this from card number
              expiryMonth: parseInt(cardDetails.expiryMonth),
              expiryYear: parseInt(cardDetails.expiryYear)
            }
          }),
          ...(paymentMethod === 'hospital-account' && {
            hospitalAccountId
          })
        }
      };
      
      console.log('Sending order data:', orderData);
      
      const response = await axios.post('/orders', orderData);
      
      console.log('Order response:', response.data);
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          order: response.data.order
        } 
      });
    } catch (err: any) {
      console.error('Error placing order:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };  
  // Generate delivery time options (every 30 minutes for the next 8 hours)
  const getDeliveryTimeOptions = () => {
    const options = [];
    const now = new Date();
    const startTime = new Date(now);
    startTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0); // Round up to next 30 min
    
    for (let i = 1; i <= 16; i++) { // Start from 1 to give at least 30 min prep time
      const time = new Date(startTime);
      time.setMinutes(time.getMinutes() + (i * 30));
      
      const formattedTime = time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      
      const formattedDate = time.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      options.push({
        value: time.toISOString(),
        label: `${formattedDate} at ${formattedTime}`,
        displayTime: time.toLocaleString([], {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
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
              <Link to="/cart" className="flex-shrink-0 flex items-center">
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
                        <li key={item._id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                                }}
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each × {item.quantity}</p>
                                <p className="text-xs text-gray-400">{item.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delivery & Payment Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
                          Delivery Time *
                        </label>
                        <select
                          id="deliveryTime"
                          name="deliveryTime"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900 placeholder-gray-500"
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          required
                        >
                          <option value="" className="text-gray-500">Select a delivery time</option>
                          {deliveryTimeOptions.map(option => (
                            <option key={option.value} value={option.value} className="text-gray-900">
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
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Any dietary preferences or delivery instructions"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Payment Method *
                        </label>
                        <div className="space-y-3">
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
                              id="cash"
                              name="paymentMethod"
                              type="radio"
                              checked={paymentMethod === 'cash'}
                              onChange={() => setPaymentMethod('cash')}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                              Cash on Delivery
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="card"
                              name="paymentMethod"
                              type="radio"
                              checked={paymentMethod === 'card'}
                              onChange={() => setPaymentMethod('card')}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                              Credit/Debit Card
                            </label>
                          </div>
                        </div>

                        {/* Hospital Account Details */}
                        {paymentMethod === 'hospital-account' && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div>
                              <label htmlFor="hospitalAccountId" className="block text-sm font-medium text-gray-700">
                                Hospital Account ID *
                              </label>
                              <input
                                type="text"
                                id="hospitalAccountId"
                                value={hospitalAccountId}
                                onChange={(e) => setHospitalAccountId(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 placeholder-gray-500"
                                placeholder="Enter your hospital account ID"
                                required
                              />
                            </div>
                            <p className="mt-2 text-sm text-blue-600">
                              Your meal will be charged to your hospital account and included in your final bill.
                            </p>
                          </div>
                        )}

                        {/* Cash Payment Info */}
                        {paymentMethod === 'cash' && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              You will pay ${total.toFixed(2)} in cash when your meal is delivered to your room.
                            </p>
                          </div>
                        )}

                        {/* Card Payment Form */}
                        {paymentMethod === 'card' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                            <div>
                              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                                Cardholder Name *
                              </label>
                              <input
                                type="text"
                                id="cardholderName"
                                value={cardDetails.cardholderName}
                                onChange={(e) => handleCardDetailsChange('cardholderName', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 placeholder-gray-500 font-medium"
                                placeholder="Full name as shown on card"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value.replace(/\D/g, '').substring(0, 16))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 placeholder-gray-500 font-mono tracking-widest"
                                placeholder="1234 5678 9012 3456"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
                                  Month *
                                </label>
                                <select
                                  id="expiryMonth"
                                  value={cardDetails.expiryMonth}
                                  onChange={(e) => handleCardDetailsChange('expiryMonth', e.target.value)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                                  required
                                >
                                  <option value="" className="text-gray-500">MM</option>
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <option key={month} value={month.toString().padStart(2, '0')} className="text-gray-900">
                                      {month.toString().padStart(2, '0')}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
                                  Year *
                                </label>
                                <select
                                  id="expiryYear"
                                  value={cardDetails.expiryYear}
                                  onChange={(e) => handleCardDetailsChange('expiryYear', e.target.value)}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900"
                                  required
                                >
                                  <option value="" className="text-gray-500">YYYY</option>
                                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <option key={year} value={year.toString()} className="text-gray-900">
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                  CVV *
                                </label>
                                <input
                                  type="text"
                                  id="cvv"
                                  value={cardDetails.cvv}
                                  onChange={(e) => handleCardDetailsChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-900 placeholder-gray-500 font-mono"
                                  placeholder="123"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
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
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Tax (5%)</dt>
                      <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
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
                          <div>
                            <p className="text-sm text-gray-500">
                              Delivery to Ward {user?.wardNumber}, Bed {user?.bedNumber}
                            </p>
                            {deliveryTime && (
                              <p className="text-sm font-medium text-gray-700 mt-1">
                                Scheduled for: {deliveryTimeOptions.find(option => option.value === deliveryTime)?.displayTime || 'Invalid time'}
                              </p>
                            )}
                          </div>
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
                      ) : `Pay ${total.toFixed(2)} - Place Order`}
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
