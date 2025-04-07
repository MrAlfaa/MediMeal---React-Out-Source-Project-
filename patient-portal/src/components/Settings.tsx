import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface NotificationSettings {
  orderConfirmations: boolean;
  deliveryUpdates: boolean;
  menuUpdates: boolean;
  promotions: boolean;
}

interface DisplaySettings {
  darkMode: boolean;
  highContrast: boolean;
  largeText: boolean;
}

const Settings: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderConfirmations: true,
    deliveryUpdates: true,
    menuUpdates: false,
    promotions: false
  });
  
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    darkMode: false,
    highContrast: false,
    largeText: false
  });
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDisplaySettings({
      ...displaySettings,
      [name]: checked
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to the server
    // For now, just show a success message
    setSuccessMessage('Settings saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleChangePassword = () => {
    // This would open a modal or navigate to change password page
    alert('Change password functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage how you receive notifications.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="orderConfirmations"
                        name="orderConfirmations"
                        type="checkbox"
                        checked={notificationSettings.orderConfirmations}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="orderConfirmations" className="font-medium text-gray-700">Order confirmations</label>
                      <p className="text-gray-500">Receive notifications when your order is confirmed.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="deliveryUpdates"
                        name="deliveryUpdates"
                        type="checkbox"
                        checked={notificationSettings.deliveryUpdates}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="deliveryUpdates" className="font-medium text-gray-700">Delivery updates</label>
                      <p className="text-gray-500">Receive notifications about your meal delivery status.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="menuUpdates"
                        name="menuUpdates"
                        type="checkbox"
                        checked={notificationSettings.menuUpdates}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="menuUpdates" className="font-medium text-gray-700">Menu updates</label>
                      <p className="text-gray-500">Receive notifications when new menu items are available.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="promotions"
                        name="promotions"
                        type="checkbox"
                        checked={notificationSettings.promotions}
                        onChange={handleNotificationChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="promotions" className="font-medium text-gray-700">Promotions</label>
                      <p className="text-gray-500">Receive notifications about special offers and promotions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Display Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Customize your viewing experience.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={displaySettings.darkMode}
                        onChange={handleDisplayChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="darkMode" className="font-medium text-gray-700">Dark mode</label>
                      <p className="text-gray-500">Use a darker color scheme to reduce eye strain.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="highContrast"
                        name="highContrast"
                        type="checkbox"
                        checked={displaySettings.highContrast}
                        onChange={handleDisplayChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="highContrast" className="font-medium text-gray-700">High contrast</label>
                      <p className="text-gray-500">Increase contrast for better visibility.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="largeText"
                        name="largeText"
                        type="checkbox"
                        checked={displaySettings.largeText}
                        onChange={handleDisplayChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="largeText" className="font-medium text-gray-700">Large text</label>
                      <p className="text-gray-500">Increase text size for better readability.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account security.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Change Password
                  </button>
                  
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={logout}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
              </Link>
              
              <button
                type="button"
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
