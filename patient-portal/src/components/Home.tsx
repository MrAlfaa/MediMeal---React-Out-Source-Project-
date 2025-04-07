import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar - Keeping existing navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">MediMeal Connect</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {/* Desktop Navigation Links */}
                <Link to="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/menu" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Food Menu
                </Link>
                <Link to="/orders" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  My Orders
                </Link>
                <Link to="/dietary" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dietary Info
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Notification Bell */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfileMenu}
                    className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                      {user?.fullName.charAt(0)}
                    </div>
                  </button>
                </div>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Your Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Home
              </Link>
              <Link to="/menu" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Food Menu
              </Link>
              <Link to="/orders" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                My Orders
              </Link>
              <Link to="/dietary" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Dietary Info
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {user?.fullName.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner Section - Enhanced with better CTA */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Hospital meals, simplified
                </h1>
                <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                  Welcome to MediMeal Connect, where you can easily order meals that meet your dietary needs and preferences during your hospital stay.
                </p>
                <div className="mt-10 flex space-x-4">
                  <Link
                    to="/menu"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Browse Menu
                  </Link>
                  <Link
                    to="/dietary"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Dietary Guidelines
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Healthy hospital meal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Quick Access Cards Section */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
      Quick Access
    </h2>
    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
      Everything you need, just a click away
    </p>
  </div>
  
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {/* Card 1 */}
    <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0 bg-indigo-500 rounded-full p-4">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <Link to="/menu" className="font-bold text-gray-900 text-xl mb-2 block hover:text-indigo-600 transition-colors">Order Food</Link>
          <p className="text-gray-600 mb-5">Browse our diverse menu options</p>
          <Link to="/menu" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full">
            View Menu
          </Link>
        </div>
      </div>
    </div>

    {/* Card 2 */}
    <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0 bg-green-500 rounded-full p-4">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <Link to="/orders" className="font-bold text-gray-900 text-xl mb-2 block hover:text-green-600 transition-colors">Track Orders</Link>
          <p className="text-gray-600 mb-5">Check the status of your meals</p>
          <Link to="/orders" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors w-full">
            View Orders
          </Link>
        </div>
      </div>
    </div>

    {/* Card 3 */}
    <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0 bg-purple-500 rounded-full p-4">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <Link to="/dietary" className="font-bold text-gray-900 text-xl mb-2 block hover:text-purple-600 transition-colors">Dietary Info</Link>
          <p className="text-gray-600 mb-5">View nutritional guidelines</p>
          <Link to="/dietary" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors w-full">
            Learn More
          </Link>
        </div>
      </div>
    </div>

    {/* Card 4 */}
    <div className="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0 bg-yellow-500 rounded-full p-4">
            <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <Link to="/profile" className="font-bold text-gray-900 text-xl mb-2 block hover:text-yellow-600 transition-colors">My Profile</Link>
          <p className="text-gray-600 mb-5">Update your preferences</p>
          <Link to="/profile" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition-colors w-full">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>
      

        {/* Featured Meals Section - Enhanced with badges and better layout */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Today's Featured Meals
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Explore our nutritionist-approved meals designed for your health and recovery.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Meal Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Healthy salad bowl" 
                  />
                  <div className="absolute top-0 right-0 mt-3 mr-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Popular
                    </span>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Mediterranean Salad Bowl</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Vegetarian
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Gluten-free
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Low Calorie
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-500">
                    Fresh mixed greens with feta cheese, olives, tomatoes, and a light lemon dressing.
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>450 calories</div>
                    <div>$8.99</div>
                  </div>
                  
                  <div className="mt-5">
                    <Link to="/menu" className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Meal Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Grilled chicken with vegetables" 
                  />
                  <div className="absolute top-0 right-0 mt-3 mr-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Staff Pick
                    </span>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Herb-Roasted Chicken</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      High Protein
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Low Carb
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-500">
                    Tender chicken breast seasoned with herbs, served with steamed seasonal vegetables.
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>520 calories</div>
                    <div>$10.99</div>
                  </div>
                  
                  <div className="mt-5">
                    <Link to="/menu" className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Meal Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <img 
                    className="h-48 w-full object-cover" 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Vegetable soup" 
                  />
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Hearty Vegetable Soup</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Vegan
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Low Sodium
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-500">
                    A comforting blend of fresh vegetables, herbs, and broth, perfect for a light meal.
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>320 calories</div>
                    <div>$7.99</div>
                  </div>
                  <div className="mt-5">
                    <Link to="/menu" className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to="/menu" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Full Menu
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* NEW: Special Offers Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Special Offers
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Take advantage of these limited-time promotions.
              </p>
            </div>

            <div className="mt-10">
              <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 overflow-hidden shadow-lg">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Meal Plan Package</h3>
                      <div className="mt-3 flex items-baseline text-white">
                        <span className="text-5xl font-extrabold tracking-tight">$49</span>
                        <span className="ml-1 text-xl font-semibold">/week</span>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full p-3 text-white">
                      <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-5 text-lg text-white text-opacity-90">
                    Get a full week of balanced meals delivered to your room at scheduled times.
                  </p>
                </div>
                <div className="px-6 pt-6 pb-8 bg-indigo-800 bg-opacity-50 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-white">Daily breakfast, lunch, and dinner</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-white">Customizable to dietary restrictions</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-white">Save 15% compared to ordering individually</p>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link to="/menu" className="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base font-medium text-indigo-700 shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500">
                      Select Plan
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Meal Scheduling Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Meal Planning</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Plan your meals in advance
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Schedule your meals for the week to ensure you always get what you want when you want it.
              </p>
            </div>

            <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Weekly Meal Planner
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select meal times and dishes for each day of your stay.
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="border rounded-lg p-4 bg-indigo-50">
                    <h4 className="font-medium text-indigo-800">Tomorrow's Breakfast</h4>
                    <p className="text-sm text-gray-600 mt-1">7:00 AM - 9:00 AM</p>
                    <Link to="/menu" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Schedule now 
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="border rounded-lg p-4 bg-indigo-50">
                    <h4 className="font-medium text-indigo-800">Tomorrow's Lunch</h4>
                    <p className="text-sm text-gray-600 mt-1">12:00 PM - 2:00 PM</p>
                    <Link to="/menu" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Schedule now 
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="border rounded-lg p-4 bg-indigo-50">
                    <h4 className="font-medium text-indigo-800">Tomorrow's Dinner</h4>
                    <p className="text-sm text-gray-600 mt-1">6:00 PM - 8:00 PM</p>
                    <Link to="/menu" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Schedule now 
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Full Week Planner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Testimonials Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What Our Patients Say
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Read about experiences from patients who've used our meal service.
              </p>
            </div>
            
            <div className="mt-12 space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-lg">JD</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">John D.</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  "The meal options are excellent and cater to my dietary restrictions. Having good food delivered to my room has made my hospital stay so much better."
                </blockquote>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold text-lg">SM</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Sarah M.</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  "I love how I can customize my meals according to my preferences. The app is intuitive and the delivery is always on time. Highly recommend!"
                </blockquote>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-lg">RP</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Robert P.</h4>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic">
                  "As someone with diabetes, I appreciate how each meal shows nutritional information. The diabetic-friendly options taste great and help me manage my health."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Health Tips & Articles Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Health & Nutrition</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Tips for a Healthy Recovery
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Learn about nutrition and how it can support your healing journey.
              </p>
            </div>

            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {/* Article 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">The Role of Nutrition in Recovery</h3>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-500">
                      Proper nutrition is essential for healing. Learn how different nutrients can support your body's recovery process.
                    </p>
                    <div className="mt-6">
                      <Link to="/dietary" className="text-indigo-600 hover:text-indigo-500">
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Staying Hydrated</h3>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-500">
                      Water is crucial for bodily functions. Discover how proper hydration can accelerate your recovery and improve overall health.
                    </p>
                    <div className="mt-6">
                      <Link to="/dietary" className="text-indigo-600 hover:text-indigo-500">
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Foods That Boost Immunity</h3>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-500">
                      Some foods naturally strengthen your immune system. Learn which foods to include in your diet for optimal immune function.
                    </p>
                    <div className="mt-6">
                      <Link to="/dietary" className="text-indigo-600 hover:text-indigo-500">
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Simple steps to order your meals
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our easy-to-use system ensures you get the right meals at the right time during your hospital stay.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Browse the menu</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Explore our diverse menu options that cater to various dietary needs and preferences.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Place your order</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Select your meals and customize them according to your preferences and dietary restrictions.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Enjoy your meal</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Your meal will be delivered to your room at your chosen time, freshly prepared and ready to enjoy.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Dietary Information Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Dietary Information</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Meals tailored to your health needs
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our menu is designed by nutritionists to support your recovery and meet your specific dietary requirements.
              </p>
            </div>

            <div className="mt-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Available Dietary Options</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">We cater to a variety of dietary needs.</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Vegetarian</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Meals that exclude meat, poultry, and seafood but may include dairy and eggs.
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Vegan</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Plant-based meals that exclude all animal products including dairy, eggs, and honey.
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Gluten-Free</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Meals that exclude wheat, barley, rye, and other gluten-containing ingredients.
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Low Sodium</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Meals with reduced salt content, suitable for patients with hypertension or heart conditions.
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Diabetic-Friendly</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Meals with controlled carbohydrate content and low glycemic index ingredients.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to="/dietary" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Explore Complete Dietary Guidelines
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <Link to="/menu" className="text-base text-gray-500 hover:text-gray-900">
                Menu
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="/dietary" className="text-base text-gray-500 hover:text-gray-900">
                Dietary Information
              </Link>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                FAQ
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Privacy Policy
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.153c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            © 2023 MediMeal Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
