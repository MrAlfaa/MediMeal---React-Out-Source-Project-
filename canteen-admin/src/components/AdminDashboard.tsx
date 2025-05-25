import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import Charts from './Charts';
import orderService, { Order } from '../services/orderService';
import menuService, { MenuItem } from '../services/menuService';
import userService from '../services/userService';

interface DashboardStats {
  totalMenuItems: number;
  todayOrders: number;
  totalUsers: number;
  todayRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  totalRevenue: number;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ChartData {
  orderTrends: ChartDataPoint[];
  categoryData: ChartDataPoint[];
  statusData: ChartDataPoint[];
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalMenuItems: 0,
    todayOrders: 0,
    totalUsers: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    orderTrends: [],
    categoryData: [],
    statusData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activePage === 'dashboard') {
        setLoading(true);
        try {
          // Fetch all dashboard data concurrently
          const [statsData, ordersData, menuData, usersData] = await Promise.all([
            orderService.getOrderStats(),
            orderService.getAllOrders({ limit: 5, page: 1 }),
            menuService.getAllMenuItems(),
            userService.getAllUsers({ limit: 5 })
          ]);

          setDashboardStats({
            totalMenuItems: menuData.length,
            todayOrders: statsData.todayOrders,
            totalUsers: usersData.totalUsers || 0,
            todayRevenue: statsData.todayRevenue,
            pendingOrders: statsData.pendingOrders || 0,
            processingOrders: statsData.processingOrders || 0,
            totalRevenue: statsData.totalRevenue || 0
          });

          setRecentOrders(ordersData.slice(0, 5));
          
          // Calculate popular items from menu data
          const sortedItems = menuData
            .sort((a: MenuItem, b: MenuItem) => (b.orderCount || 0) - (a.orderCount || 0))
            .slice(0, 5);
          setPopularItems(sortedItems);

          // Prepare chart data
          const orderTrendsData: ChartDataPoint[] = [
            { name: 'Mon', value: 24 },
            { name: 'Tue', value: 32 },
            { name: 'Wed', value: 28 },
            { name: 'Thu', value: 45 },
            { name: 'Fri', value: 38 },
            { name: 'Sat', value: 29 },
            { name: 'Sun', value: 19 }
          ];

          // Category data from menu items
          const categoryCount = menuData.reduce((acc: Record<string, number>, item: MenuItem) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {});

          const categoryData: ChartDataPoint[] = Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value: value as number
          }));

          // Status data from orders
          const statusData: ChartDataPoint[] = statsData.statusCounts.map((status) => ({
            name: status._id,
            value: status.count
          }));

          setChartData({
            orderTrends: orderTrendsData,
            categoryData,
            statusData
          });

        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [activePage]);

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊', color: 'blue' },
    { name: 'Menu Management', id: 'menu', icon: '🍽️', color: 'green' },
    { name: 'Orders', id: 'orders', icon: '📋', color: 'yellow' },
    { name: 'Users', id: 'users', icon: '👥', color: 'purple' },
    { name: 'Analytics', id: 'analytics', icon: '📈', color: 'indigo' },
    { name: 'Settings', id: 'settings', icon: '⚙️', color: 'gray' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const renderDashboardContent = () => (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.fullName}! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setActivePage('orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>📋</span>
            <span>View All Orders</span>
          </button>
          <button 
            onClick={() => setActivePage('menu')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Orders</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.todayOrders}</p>
              <p className="text-sm text-green-600 mt-1">↗ Active orders</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${dashboardStats.todayRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">↗ +12% vs yesterday</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Menu Items</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalMenuItems}</p>
              <p className="text-sm text-blue-600 mt-1">Available items</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
              <p className="text-sm text-purple-600 mt-1">Registered patients</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingOrders}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardStats.processingOrders}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-lg">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${dashboardStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-lg">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Charts 
            data={chartData.orderTrends}
            type="area"
            title="Order Trends (Last 7 Days)"
            height={300}
            colors={['#3B82F6']}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Charts 
            data={chartData.categoryData}
            type="pie"
            title="Menu Categories Distribution"
            height={300}
            colors={['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']}
          />
        </div>
      </div>

      {/* Order Status Chart */}
      {chartData.statusData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Charts 
            data={chartData.statusData}
            type="bar"
            title="Orders by Status"
            height={300}
            colors={['#3B82F6']}
          />
        </div>
      )}

      {/* Recent Orders & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button 
                onClick={() => setActivePage('orders')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: Order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.user?.fullName}</p>
                      <p className="text-xs text-gray-500">Ward {order.deliveryDetails?.wardNumber}, Bed {order.deliveryDetails?.bedNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">${order.totalAmount?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">📋</span>
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Popular Menu Items</h3>
              <button 
                onClick={() => setActivePage('menu')}
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Manage Menu
              </button>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading menu items...</p>
              </div>
            ) : popularItems.length > 0 ? (
              <div className="space-y-4">
                {popularItems.map((item: MenuItem, index: number) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">#{index + 1} popular</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">🍽️</span>
                <p className="text-gray-500">No menu items found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setActivePage('orders')}
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center"
          >
            <span className="text-2xl mb-2 block">📋</span>
            <p className="font-medium text-gray-900">Manage Orders</p>
            <p className="text-sm text-gray-500">View and update order status</p>
          </button>
          
          <button 
            onClick={() => setActivePage('menu')}
            className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center"
          >
            <span className="text-2xl mb-2 block">🍽️</span>
            <p className="font-medium text-gray-900">Add Menu Item</p>
            <p className="text-sm text-gray-500">Create new food items</p>
          </button>
          
          <button 
            onClick={() => setActivePage('users')}
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center"
          >
            <span className="text-2xl mb-2 block">👥</span>
            <p className="font-medium text-gray-900">User Management</p>
            <p className="text-sm text-gray-500">Manage patient accounts</p>
          </button>
          
          <button 
            onClick={() => setActivePage('analytics')}
            className="p-4 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200 text-center"
          >
            <span className="text-2xl mb-2 block">📈</span>
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-500">Sales and performance reports</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPageContent = () => {
    switch (activePage) {
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'dashboard':
        return renderDashboardContent();
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
        <main className="flex-1 overflow-y-auto bg-gray-50 h-screen">
          <div className="h-full">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
