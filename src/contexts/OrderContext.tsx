import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ordersAPI } from '@/lib/api';

interface OrderItem {
  product: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  address: { name: string; phone: string; city: string; address: string };
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  statusLabel: string;
  promoCode?: string;
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (data: Record<string, unknown>) => Promise<Order>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = async () => {
    if (!isAuthenticated) return;
    try {
      const { orders: data } = await ordersAPI.getAll();
      setOrders(data || []);
    } catch (err) {
      console.error('Orders fetch error:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) refreshOrders();
    else setOrders([]);
  }, [isAuthenticated]);

  const createOrder = async (data: Record<string, unknown>): Promise<Order> => {
    const { order } = await ordersAPI.create(data);
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
