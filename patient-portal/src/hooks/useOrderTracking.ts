import { useState, useEffect } from 'react';
import { orderService, Order } from '../services/orderService';

export const useOrderTracking = (orderId?: string, refreshInterval: number = 30000) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const fetchedOrder = await orderService.getOrderById(orderId);
        setOrder(fetchedOrder);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Set up polling for real-time updates
    const interval = setInterval(fetchOrder, refreshInterval);

    return () => clearInterval(interval);
  }, [orderId, refreshInterval]);

  return { order, loading, error, refetch: () => orderId && orderService.getOrderById(orderId) };
};