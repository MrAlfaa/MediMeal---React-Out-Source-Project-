import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface MenuItem {
  id: string;
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
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/menu');
        setMenuItems(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching menu:', err);
        setError(err.response?.data?.message || 'Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    };

    // Mock data for demonstration
    setTimeout(() => {
      setMenuItems([
        {
          id: '1',
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
          allergens: []
        },
        {
          id: '2',
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
          allergens: []
        },
        {
          id: '3',
          name: 'Whole Grain Pasta',
          description: 'Whole grain pasta with marinara sauce and seasonal vegetables.',
          price: 7.99,
          category: 'Main Courses',
          image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
          tags: ['vegetarian', 'high-fiber'],
          nutritionalInfo: {
            calories: 380,
            protein: 12,
            carbs: 68,
            fat: 6
          },
          allergens: ['gluten', 'wheat']
        },
        {
          id: '4',
          name: 'Baked Salmon',
          description: 'Oven-baked salmon fillet with lemon and herbs, served with steamed vegetables.',
          price: 12.99,
          category: 'Main Courses',
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
          tags: ['high-protein', 'omega-3'],
          nutritionalInfo: {
            calories: 420,
            protein: 32,
            carbs: 8,
            fat: 28
          },
          allergens: ['fish']
        },
        {
          id: '5',
          name: 'Fresh Fruit Platter',
          description: 'Assortment of seasonal fresh fruits.',
          price: 6.99,
          category: 'Desserts',
          image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea',
          tags: ['vegetarian', 'vegan', 'low-calorie'],
          nutritionalInfo: {
            calories: 120,
            protein: 1,
            carbs: 30,
            fat: 0
          },
          allergens: []
        },
        {
          id: '6',
          name: 'Chicken Noodle Soup',
          description: 'Classic chicken soup with vegetables and noodles.',
          price: 5.99,
          category: 'Soups',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
          tags: ['comfort-food'],
          nutritionalInfo: {
            calories: 220,
            protein: 18,
            carbs: 24,
            fat: 6
          },
          allergens: ['gluten']
        }
      ]);
      setLoading(false);
    }, 1000);

    // In a real app, you would uncomment this to fetch actual data
    // fetchMenu();
  }, []);

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
                <span className="ml-2 text-xl font-bold text-gray-900">Menu</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  type="button"
                  title="Shopping Cart"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
                </button>
                {cart.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                    <div className="py-2 px-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Your Cart</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="py-2 px-4 flex justify-between items-center hover:bg-gray-50">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              title="Remove item"
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                            <button
                              type="button"
                              title="Add item"
                              onClick={() => addToCart(item)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="py-2 px-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm font-medium">
                        <p className="text-gray-900">Subtotal</p>
                        <p className="text-indigo-600">${cartTotal.toFixed(2)}</p>
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/checkout"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and filter */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0 md:w-1/3">
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search menu"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex overflow-x-auto pb-2 md:pb-0">
                {categories.map(category => (
                  <button
                    key={category}
                    title={`Filter by ${category}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium mr-2 whitespace-nowrap ${
                      activeCategory === category
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu items */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="h-48 w-full bg-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback image if the original fails to load
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
                      }}
                    />
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                      <span className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Nutritional Info</h4>
                      <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Calories</p>
                          <p>{item.nutritionalInfo.calories}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Protein</p>
                          <p>{item.nutritionalInfo.protein}g</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Carbs</p>
                          <p>{item.nutritionalInfo.carbs}g</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="font-medium">Fat</p>
                          <p>{item.nutritionalInfo.fat}g</p>
                        </div>
                      </div>
                    </div>
                    
                    {item.allergens.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Allergens</h4>
                        <p className="mt-1 text-sm text-gray-500">{item.allergens.join(', ')}</p>
                      </div>
                    )}
                    
                    <div className="mt-5">
                      <button
                        type="button"
                        title={`Add ${item.name} to cart`}
                        onClick={() => addToCart(item)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );};

export default Menu;