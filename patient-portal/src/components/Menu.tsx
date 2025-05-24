import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import { useCart } from '../context/CartContext';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  isAvailable: boolean;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { cartItems, addToCart, removeFromCart, cartTotal, cartCount } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/menu', {
        params: {
          available: true
        }
      });
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again later.');
      // Fallback to mock data if API fails
      setTimeout(() => {
        setMenuItems([
          {
            _id: '1',
            name: 'Vegetable Soup',
            description: 'A hearty soup with seasonal vegetables and herbs.',
            price: 5.99,
            category: 'Soups',
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
            tags: ['vegetarian', 'healthy', 'low-sodium'],
            nutritionalInfo: {
              calories: 120,
              protein: 4,
              carbs: 20,
              fat: 2
            },
            allergens: [],
            isAvailable: true
          },
          {
            _id: '2',
            name: 'Grilled Chicken Salad',
            description: 'Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette.',
            price: 8.99,
            category: 'Salads',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            tags: ['high-protein', 'low-carb'],
            nutritionalInfo: {
              calories: 320,
              protein: 28,
              carbs: 12,
              fat: 18
            },
            allergens: [],
            isAvailable: true
          }
        ]);
        setLoading(false);
        setError(null);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      nutritionalInfo: item.nutritionalInfo,
      allergens: item.allergens
    });
  };

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(item => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Cart Floating Button and Overlay */}
      <div className="fixed top-20 right-4 z-50">
        <div className="relative">
          <Link
            to="/cart"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="mr-1">Cart</span>
            <span className="bg-white text-indigo-600 rounded-full px-2 py-0.5 text-xs font-bold">
              {cartCount}
            </span>
          </Link>
          
          {cartItems.length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-hidden border border-gray-200">
              <div className="py-3 px-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Your Cart</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item._id} className="py-3 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center flex-1 min-w-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center ml-3">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors duration-150"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="py-3 px-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between text-base font-medium">
                  <p className="text-gray-900">Subtotal</p>
                  <p className="text-indigo-600">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="mt-3">
                  <Link
                    to="/cart"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header with Refresh Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
              <p className="mt-1 text-sm text-gray-500">Fresh meals prepared daily</p>
            </div>
            <button
              onClick={fetchMenuItems}
              disabled={loading}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
            >
              <svg className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Menu
            </button>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Search menu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex overflow-x-auto pb-2 lg:pb-0 space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Menu items */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
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
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map(item => {
                const quantityInCart = getItemQuantityInCart(item._id);
                return (
                  <div key={item._id} className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                    <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      {quantityInCart > 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white shadow-sm">
                            {quantityInCart} in cart
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Nutritional Info</h4>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <p className="font-medium text-gray-700">Calories</p>
                            <p className="text-indigo-600 font-semibold">{item.nutritionalInfo.calories}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <p className="font-medium text-gray-700">Protein</p>
                            <p className="text-indigo-600 font-semibold">{item.nutritionalInfo.protein}g</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <p className="font-medium text-gray-700">Carbs</p>
                            <p className="text-indigo-600 font-semibold">{item.nutritionalInfo.carbs}g</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded text-center">
                            <p className="font-medium text-gray-700">Fat</p>
                            <p className="text-indigo-600 font-semibold">{item.nutritionalInfo.fat}g</p>
                          </div>
                        </div>
                      </div>
                      
                      {item.allergens.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Allergens</h4>
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{item.allergens.join(', ')}</p>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
                      >
                        <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          {filteredItems.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/dietary"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Dietary Info
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Order History
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
