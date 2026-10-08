export interface User {
  name: string;
  role: 'owner' | 'staff';
  phone?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone?: string;
  order_date: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: 'paid' | 'due' | 'partial';
  notes?: string;
  created_at?: string;
  items?: OrderItem[];
}

export interface DailyPayment {
  id: string;
  payment_date: string;
  amount: number;
  payment_mode: string;
  customer_name?: string;
  order_id?: string;
  notes?: string;
  created_at?: string;
}

export interface Investment {
  id: string;
  investment_date: string;
  category: string;
  amount: number;
  description?: string;
  payment_mode: string;
  created_at?: string;
}

export interface DashboardStats {
  ordersCount: number;
  totalBilled: number;
  totalDue: number;
  todayReceived: number;
  totalReceived: number;
  totalInvestments: number;
}

export type DashboardFilter = 'all' | 'dues' | 'billed' | 'received' | 'investments' | null;
