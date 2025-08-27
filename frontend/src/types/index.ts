export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'EMPLOYEE' | 'CUSTOMER';
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  stock: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 'MAKANAN' | 'MINUMAN' | 'SNACK' | 'LAINNYA';

export interface Transaction {
  id: string;
  customerId?: string;
  customer?: User;
  totalAmount: number;
  paymentMethod: 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  transactionItems: TransactionItem[];
  customerDebt?: CustomerDebt;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  menuId: string;
  menu: Menu;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomerDebt {
  id: string;
  customerId: string;
  transactionId: string;
  totalDebt: number;
  remainingDebt: number;
  isSettled: boolean;
  createdAt: string;
  updatedAt: string;
  paymentRecords: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  customerDebtId: string;
  amount: number;
  paymentMethod: 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER';
  notes?: string;
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
