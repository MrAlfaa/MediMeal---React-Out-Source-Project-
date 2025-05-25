import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import settingsService from '../services/settingsService';

interface SystemSettings {
  appName: string;
  hospitalName: string;
  contactEmail: string;
  deliveryFee: number;
  taxRate: number;
  orderTimeLimit: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderAlerts: boolean;
  dailyReports: boolean;
  systemUpdates: boolean;
  smsNotifications: boolean;
}

const Settings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Account Settings State
  const [accountData, setAccountData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    appName: 'MediMeal',
    hospitalName: 'General Hospital',
    contactEmail: 'admin@medimeal.com',
    deliveryFee: 2.50,
    taxRate: 8.5,
    orderTimeLimit: 30,
    maintenanceMode: false,
    allowRegistration: true
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderAlerts: true,
    dailyReports: true,
    systemUpdates: false,
    smsNotifications: false
  });

  const tabs = [
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'system', name: 'System', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'data', name: 'Data Management', icon: '💾' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' }
  ];

  const showMessage = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccessMessage(message);
      setErrorMessage('');
    } else {
      setErrorMessage(message);
      setSuccessMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update profile info
      await userService.updateUser(user?.id || '', {
        fullName: accountData.fullName,
        email: accountData.email
      });
      
      showMessage('Account updated successfully', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Failed to update account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accountData.newPassword !== accountData.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    
    if (accountData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await settingsService.changePassword(accountData.currentPassword, accountData.newPassword);
      showMessage('Password changed successfully', 'success');
      setAccountData({ ...accountData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showMessage(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsUpdate = async () => {
    setLoading(true);
    try {
      // API call to update system settings would go here
      showMessage('System settings updated successfully', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Failed to update system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      // API call to update notification settings would go here
      showMessage('Notification settings updated successfully', 'success');
    } catch (error: any) {
      showMessage(error.message || 'Failed to update notification settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async (type: string) => {
    setLoading(true);
    try {
      await settingsService.exportData(type);
      showMessage(`${type} data exported successfully`, 'success');
    } catch (error: any) {
      showMessage(`Failed to export ${type} data`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <form onSubmit={handleAccountUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={accountData.fullName}
                onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={accountData.email}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={accountData.currentPassword}
              onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={accountData.newPassword}
                onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={accountData.confirmPassword}
                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
              <input
                type="text"
                value={systemSettings.appName}
                onChange={(e) => setSystemSettings({ ...systemSettings, appName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name</label>
              <input
                type="text"
                value={systemSettings.hospitalName}
                onChange={(e) => setSystemSettings({ ...systemSettings, hospitalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              value={systemSettings.contactEmail}
              onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={systemSettings.deliveryFee}
                onChange={(e) => setSystemSettings({ ...systemSettings, deliveryFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={systemSettings.taxRate}
                onChange={(e) => setSystemSettings({ ...systemSettings, taxRate: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Time Limit (mins)</label>
              <input
                type="number"
                value={systemSettings.orderTimeLimit}
                onChange={(e) => setSystemSettings({ ...systemSettings, orderTimeLimit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Control</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-600">Temporarily disable the application for maintenance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.maintenanceMode}
                onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Allow Registration</h4>
              <p className="text-sm text-gray-600">Allow new users to register accounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.allowRegistration}
                onChange={(e) => setSystemSettings({ ...systemSettings, allowRegistration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSystemSettingsUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-gray-600">
                {key === 'emailNotifications' && 'Receive email notifications for important events'}
                {key === 'orderAlerts' && 'Get notified when new orders are placed'}
                {key === 'dailyReports' && 'Receive daily summary reports'}
                {key === 'systemUpdates' && 'Get notified about system updates and maintenance'}
                {key === 'smsNotifications' && 'Receive SMS notifications for urgent matters'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings({ 
                  ...notificationSettings, 
                  [key]: e.target.checked 
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNotificationUpdate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? 'Updating...' : 'Update Notifications'}
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Privacy</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span className="font-medium text-green-800">Two-Factor Authentication</span>
              <span className="ml-auto text-sm text-green-600">Enabled</span>
            </div>
            <p className="text-sm text-green-700 mt-1">Your account is protected with 2FA</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <span className="text-blue-600 mr-2">🔒</span>
              <span className="font-medium text-blue-800">Session Management</span>
              <button className="ml-auto text-sm text-blue-600 hover:text-blue-700">Manage Sessions</button>
            </div>
            <p className="text-sm text-blue-700 mt-1">Monitor and control active sessions</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">🔔</span>
              <span className="font-medium text-yellow-800">Login Alerts</span>
              <span className="ml-auto text-sm text-yellow-600">Enabled</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">Get notified of suspicious login attempts</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Date & Time</th>
                <th className="text-left py-2">Action</th>
                <th className="text-left py-2">IP Address</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">2024-01-15 09:30:42</td>
                <td className="py-2">Login</td>
                <td className="py-2">192.168.1.100</td>
                <td className="py-2"><span className="text-green-600">Success</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">2024-01-15 08:15:23</td>
                <td className="py-2">Password Change</td>
                <td className="py-2">192.168.1.100</td>
                <td className="py-2"><span className="text-green-600">Success</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">2024-01-14 17:45:12</td>
                <td className="py-2">Failed Login</td>
                <td className="py-2">203.0.113.45</td>
                <td className="py-2"><span className="text-red-600">Failed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📊 Orders Data</h4>
            <p className="text-sm text-gray-600 mb-3">Export all order history and statistics</p>
            <button
              onClick={() => handleDataExport('orders')}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              Export Orders
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">👥 Users Data</h4>
            <p className="text-sm text-gray-600 mb-3">Export user accounts and profiles</p>
            <button
              onClick={() => handleDataExport('users')}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
            >
              Export Users
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">🍽️ Menu Data</h4>
            <p className="text-sm text-gray-600 mb-3">Export menu items and categories</p>
            <button
              onClick={() => handleDataExport('menu')}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors duration-200"
            >
              Export Menu
            </button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">📈 Analytics</h4>
            <p className="text-sm text-gray-600 mb-3">Export analytics and reports</p>
            <button
              onClick={() => handleDataExport('analytics')}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
            >
              Export Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Management</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800">Database Backup</h4>
                <p className="text-sm text-blue-700">Create a backup of your database</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Create Backup
              </button>
            </div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-orange-800">Database Cleanup</h4>
                <p className="text-sm text-orange-700">Remove old logs and temporary data</p>
              </div>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
                Cleanup Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance & Branding</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border-2 border-blue-500 rounded-lg bg-blue-50 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                <span className="font-medium">Light Theme</span>
                <span className="ml-auto text-blue-600">✓</span>
              </div>
            </div>
            <div className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                <span className="font-medium">Dark Theme</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex space-x-3">
            {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-2H5a2 2 0 00-2-2v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Drop your logo here or click to browse</p>
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'system':
        return renderSystemSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'data':
        return renderDataManagement();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and application settings</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">✗</span>
            <span className="text-red-800">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Tabs and Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;