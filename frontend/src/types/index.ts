export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  customerId?: string;
  customer?: Customer;
  employeeId: string;
  employee?: Employee;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface FinanceRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'SALES' | 'FINANCE' | 'INVENTORY' | 'EMPLOYEE';
  data: any;
  dateFrom: string;
  dateTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  totalMenuItems: number;
  dailySales: { date: string; amount: number }[];
  topItems: { item: string; quantity: number }[];
  recentTransactions: Transaction[];
}
