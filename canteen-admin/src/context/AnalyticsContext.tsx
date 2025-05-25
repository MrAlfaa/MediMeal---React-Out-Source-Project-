import React, { createContext, useContext, useState, ReactNode } from 'react';
import analyticsService, { 
  SalesAnalytics, 
  MenuPerformance, 
  CustomerAnalytics, 
  OrderAnalytics 
} from '../services/analyticsService';

interface AnalyticsContextType {
  salesData: SalesAnalytics | null;
  menuData: MenuPerformance | null;
  customerData: CustomerAnalytics | null;
  orderData: OrderAnalytics | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: (period: string, startDate?: string, endDate?: string) => Promise<void>;
  downloadReport: (period: string, startDate?: string, endDate?: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [menuData, setMenuData] = useState<MenuPerformance | null>(null);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  const [orderData, setOrderData] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (period: string, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [sales, menu, customer, order] = await Promise.all([
        analyticsService.getSalesAnalytics(period, startDate, endDate),
        analyticsService.getMenuPerformance(period),
        analyticsService.getCustomerAnalytics(period),
        analyticsService.getOrderAnalytics(period)
      ]);

      setSalesData(sales);
      setMenuData(menu);
      setCustomerData(customer);
      setOrderData(order);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (period: string, startDate?: string, endDate?: string) => {
    try {
      await analyticsService.downloadReport(period, startDate, endDate);
    } catch (err: any) {
      setError(err.message || 'Failed to download report');
      console.error('Error downloading report:', err);
    }
  };

  const value: AnalyticsContextType = {
    salesData,
    menuData,
    customerData,
    orderData,
    loading,
    error,
    fetchAnalytics,
    downloadReport
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};