import React from 'react';

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  navigation: Array<{
    name: string;
    id: string;
    icon: string;
    color: string;
  }>;
  user: any;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  sidebarOpen,
  setSidebarOpen,
  activePage,
  setActivePage,
  navigation,
  user,
  logout
}) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Sidebar Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Logo Section */}
              <div className="flex-shrink-0 flex items-center px-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">MediMeal</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Admin Portal</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="px-4 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`text-xl mr-4 transition-transform duration-200 ${
                      activePage === item.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                    {activePage === item.id && (
                      <span className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Mobile User Profile */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName.charAt(0)}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out z-30`}>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Desktop Header with Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">MediMeal</h1>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Admin Portal</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
            )}
            
            {/* Single Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activePage === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <span className={`text-lg transition-all duration-200 ${
                    sidebarCollapsed ? 'mx-auto' : 'mr-3'
                  } ${activePage === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </span>
                  
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.name}</span>
                      {activePage === item.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Desktop User Profile */}
          <div className="border-t border-gray-100 p-3">
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
                  title="Logout"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.fullName.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Logout"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;