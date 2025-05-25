import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import orderService from '../services/orderService';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalMenuItems: 24,
    todayOrders: 0,
    totalUsers: 156,
    todayRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await orderService.getOrderStats();
        setDashboardStats(prev => ({
          ...prev,
          todayOrders: stats.todayOrders,
          todayRevenue: stats.todayRevenue
        }));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    if (activePage === 'dashboard') {
      fetchStats();
    }
  }, [activePage]);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊', color: 'blue' },
    { name: 'Menu Management', id: 'menu', icon: '🍽️', color: 'green' },
    { name: 'Orders', id: 'orders', icon: '📋', color: 'yellow' },
    { name: 'Users', id: 'users', icon: '👥', color: 'purple' },
    { name: 'Analytics', id: 'analytics', icon: '📈', color: 'indigo' },
    { name: 'Settings', id: 'settings', icon: '⚙️', color: 'gray' }
  ];

  const renderPageContent = () => {
    switch (activePage) {
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Menu Items</p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Today's Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.todayOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                    <p className="text-2xl font-semibold text-gray-900">${dashboardStats.todayRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {navigation.find(item => item.id === activePage)?.name || 'Page'}
            </h1>
            <p className="text-gray-600 mt-2">This page is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        navigation={navigation}
        user={user}
        logout={logout}
      />
      
      {/* Main content */}
      <div className={`flex-1 overflow-hidden ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">MediMeal Admin</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-hidden bg-gray-50 h-screen">
          <div className="h-full">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;