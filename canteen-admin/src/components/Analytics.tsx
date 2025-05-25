import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import menuService from '../services/menuService';
import userService from '../services/userService';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState({
    orderTrends: [],
    popularCategories: [],
    revenueGrowth: 0,
    customerSatisfaction: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Fetch analytics data based on time range
        const [orderStats, menuItems, userStats] = await Promise.all([
          orderService.getOrderStats(),
          menuService.getAllMenuItems(),
          userService.getUserStats()
        ]);

        // Process data for analytics
        const averageOrderValue = orderStats.totalOrders > 0 
          ? orderStats.totalRevenue / orderStats.totalOrders 
          : 0;

        setAnalyticsData({
          orderTrends: [], // Would implement chart data
          popularCategories: [], // Would implement category analysis
          revenueGrowth: 12.5, // Mock data - would calculate actual growth
          customerSatisfaction: 4.2, // Mock data - would get from reviews
          averageOrderValue
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Revenue Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{analyticsData.revenueGrowth}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-xl">📈</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                  <p className="text-2xl font-bold text-blue-600">${analyticsData.averageOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-xl">💳</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{analyticsData.customerSatisfaction}/5</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span className="text-xl">⭐</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Completion</p>
                  <p className="text-2xl font-bold text-purple-600">94.2%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trends</h3>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📊</span>
                  <p className="text-gray-600">Order trends chart</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🥘</span>
                  <p className="text-gray-600">Category breakdown</p>
                  <p className="text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📈</span>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics Coming Soon</h4>
              <p className="text-gray-600 mb-6">We're working on comprehensive analytics including:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl block mb-2">🎯</span>
                  <p className="font-medium">Customer Insights</p>
                  <p className="text-sm text-gray-600">Behavior analysis & preferences</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl block mb-2">💰</span>
                  <p className="font-medium">Revenue Analytics</p>
                  <p className="text-sm text-gray-600">Detailed financial reports</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl block mb-2">📊</span>
                  <p className="font-medium">Operational Metrics</p>
                  <p className="text-sm text-gray-600">Performance & efficiency tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;