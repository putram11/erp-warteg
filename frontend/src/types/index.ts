export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'OWNER' | 'EMPLOYEE' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  name: string;
  category: 'NASI' | 'LAUK' | 'SAMBAL' | 'SAYUR' | 'MINUMAN';
  price: number;
  description?: string;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  employeeId?: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'TRANSFER' | 'DEBT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer: User;
  transactionItems: TransactionItem[];
  customerDebt?: CustomerDebt;
  paymentRecords?: PaymentRecord[];
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  menuId: string;
  quantity: number;
  price: number;
  subtotal: number;
  menu: Menu;
}

export interface CustomerDebt {
  id: string;
  customerId: string;
  transactionId: string;
  totalDebt: number;
  remainingDebt: number;
  dueDate?: string;
  isSettled: boolean;
  createdAt: string;
  updatedAt: string;
  customer: User;
  transaction: Transaction;
  paymentRecords: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  customerDebtId: string;
  transactionId: string;
  userId: string;
  amount: number;
  paymentMethod: 'CASH' | 'TRANSFER';
  notes?: string;
  createdAt: string;
  user: User;
}

export interface StockHistory {
  id: string;
  menuId: string;
  quantity: number;
  type: 'RESTOCK' | 'SALE' | 'ADJUSTMENT';
  description?: string;
  createdAt: string;
  menu: Menu;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface CreateMenuRequest {
  name: string;
  category: Menu['category'];
  price: number;
  description?: string;
  stock?: number;
  imageUrl?: string;
}

export interface CreateTransactionRequest {
  customerId: string;
  items: {
    menuId: string;
    quantity: number;
  }[];
  paymentMethod: Transaction['paymentMethod'];
  notes?: string;
}

export interface DashboardData {
  today: {
    sales: number;
    received: number;
    transactions: number;
  };
  month: {
    sales: number;
    received: number;
    transactions: number;
  };
  debts: {
    total: number;
    count: number;
  };
  inventory: {
    lowStockCount: number;
  };
  recentTransactions: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
      menuName: string;
      quantity: number;
    }>;
  }>;
  topItemsToday: Array<{
    menuName: string;
    category: string;
    quantitySold: number;
  }>;
}

export interface SalesReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSales: number;
    totalReceived: number;
    totalTransactions: number;
    averageDaily: number;
    averageTransaction: number;
  };
  dailyData: Array<{
    date: string;
    totalSales: number;
    totalReceived: number;
    transactionCount: number;
    averageTransaction: number;
  }>;
}

export interface PopularMenusReport {
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  totalMenusAnalyzed: number;
  popularMenus: Array<{
    rank: number;
    menuId: string;
    menuName: string;
    category: string;
    currentPrice: number;
    currentStock: number;
    quantitySold: number;
    revenue: number;
    orderCount: number;
    averagePerOrder: number;
  }>;
}
