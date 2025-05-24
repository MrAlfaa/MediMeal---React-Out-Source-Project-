import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊', color: 'bg-blue-500' },
    { name: 'Orders', id: 'orders', icon: '📋', color: 'bg-green-500' },
    { name: 'Menu Management', id: 'menu', icon: '🍽️', color: 'bg-orange-500' },
    { name: 'User Management', id: 'users', icon: '👥', color: 'bg-purple-500' },
    { name: 'Reports', id: 'reports', icon: '📈', color: 'bg-pink-500' },
    { name: 'Settings', id: 'settings', icon: '⚙️', color: 'bg-gray-500' },
  ];

  const statsData = [
    { title: "Today's Orders", value: "24", change: "+12%", icon: "📋", color: "bg-blue-500", textColor: "text-blue-600" },
    { title: "Active Patients", value: "156", change: "+8%", icon: "👥", color: "bg-green-500", textColor: "text-green-600" },
    { title: "Menu Items", value: "42", change: "+3%", icon: "🍽️", color: "bg-orange-500", textColor: "text-orange-600" },
    { title: "Today's Revenue", value: "$1,247", change: "+15%", icon: "💰", color: "bg-purple-500", textColor: "text-purple-600" },
  ];

  const recentOrders = [
    { id: "001", patient: "John Doe", ward: "A1", bed: "12", status: "Delivered", amount: "$25.99", time: "2 mins ago" },
    { id: "002", patient: "Jane Smith", ward: "B2", bed: "08", status: "Preparing", amount: "$18.50", time: "5 mins ago" },
    { id: "003", patient: "Mike Johnson", ward: "C1", bed: "15", status: "Pending", amount: "$32.75", time: "8 mins ago" },
    { id: "004", patient: "Sarah Wilson", ward: "A2", bed: "06", status: "Delivered", amount: "$22.25", time: "12 mins ago" },
    { id: "005", patient: "Tom Brown", ward: "B1", bed: "20", status: "Cancelled", amount: "$28.00", time: "15 mins ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Welcome back, {user?.fullName}! Here's your hospital food service overview.
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2">
                  <span>📊</span>
                  <span>View Reports</span>
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                  <span>➕</span>
                  <span>New Order</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm font-medium ${stat.textColor} mt-1`}>
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Orders</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart component would go here</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Items</h3>
                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart component would go here</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Location</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentOrders.map((order, index) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 font-medium text-gray-900">#{order.id}</td>
                          <td className="py-4 text-gray-900">{order.patient}</td>
                          <td className="py-4 text-gray-600">Ward {order.ward}, Bed {order.bed}</td>
                          <td className="py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 font-medium text-gray-900">{order.amount}</td>
                          <td className="py-4 text-gray-500">{order.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                New Order
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
                <p className="text-gray-600 mb-6">Orders management functionality will be implemented here.</p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                Add Item
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Management</h3>
                <p className="text-gray-600 mb-6">Menu management functionality will be implemented here.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Add User
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-gray-600 mb-6">User management functionality will be implemented here.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <span>📊</span>
                  <span>View Reports</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <span>➕</span>
                  <span>New Order</span>
                </button>
              </div>            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports</h3>
                <p className="text-gray-600 mb-6">Reports functionality will be implemented here.</p>
                <button className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600 mb-6">Settings functionality will be implemented here.</p>
                <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
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
      <div className={`${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'} flex flex-col w-0 flex-1 transition-all duration-300 ease-in-out`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          logout={logout}
        />

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;