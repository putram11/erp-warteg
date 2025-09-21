import { apiCall } from '../lib/api';
import type { 
  User, 
  MenuItem, 
  Customer, 
  Employee, 
  Transaction, 
  FinanceRecord, 
  Report,
  DashboardStats,
  PaginatedResponse 
} from '../types';

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    apiCall<{ user: User; token: string }>('POST', '/auth/login', { email, password }),
  
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) =>
    apiCall<{ user: User; token: string }>('POST', '/auth/register', data),
  
  logout: () =>
    apiCall('POST', '/auth/logout'),
  
  getCurrentUser: () =>
    apiCall<User>('GET', '/auth/me'),
};

// Menu Services
export const menuService = {
  getMenuItems: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    apiCall<PaginatedResponse<MenuItem>>('GET', `/menu${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getMenuItem: (id: string) =>
    apiCall<MenuItem>('GET', `/menu/${id}`),
  
  createMenuItem: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<MenuItem>('POST', '/menu', data),
  
  updateMenuItem: (id: string, data: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiCall<MenuItem>('PUT', `/menu/${id}`, data),
  
  deleteMenuItem: (id: string) =>
    apiCall('DELETE', `/menu/${id}`),
};

// Customer Services
export const customerService = {
  getCustomers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiCall<PaginatedResponse<Customer>>('GET', `/customers${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getCustomer: (id: string) =>
    apiCall<Customer>('GET', `/customers/${id}`),
  
  createCustomer: (data: Omit<Customer, 'id' | 'totalSpent' | 'createdAt' | 'updatedAt'>) =>
    apiCall<Customer>('POST', '/customers', data),
  
  updateCustomer: (id: string, data: Partial<Omit<Customer, 'id' | 'totalSpent' | 'createdAt' | 'updatedAt'>>) =>
    apiCall<Customer>('PUT', `/customers/${id}`, data),
  
  deleteCustomer: (id: string) =>
    apiCall('DELETE', `/customers/${id}`),
};

// Employee Services
export const employeeService = {
  getEmployees: (params?: { page?: number; limit?: number; search?: string }) =>
    apiCall<PaginatedResponse<Employee>>('GET', `/employees${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getEmployee: (id: string) =>
    apiCall<Employee>('GET', `/employees/${id}`),
  
  createEmployee: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<Employee>('POST', '/employees', data),
  
  updateEmployee: (id: string, data: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiCall<Employee>('PUT', `/employees/${id}`, data),
  
  deleteEmployee: (id: string) =>
    apiCall('DELETE', `/employees/${id}`),
};

// Transaction Services
export const transactionService = {
  getTransactions: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    apiCall<PaginatedResponse<Transaction>>('GET', `/transactions${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getTransaction: (id: string) =>
    apiCall<Transaction>('GET', `/transactions/${id}`),
  
  createTransaction: (data: {
    customerId?: string;
    items: { menuItemId: string; quantity: number; price: number }[];
    paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
  }) =>
    apiCall<Transaction>('POST', '/transactions', data),
  
  updateTransaction: (id: string, data: { status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' }) =>
    apiCall<Transaction>('PUT', `/transactions/${id}`, data),
  
  deleteTransaction: (id: string) =>
    apiCall('DELETE', `/transactions/${id}`),
};

// Finance Services
export const financeService = {
  getFinanceRecords: (params?: { page?: number; limit?: number; type?: string; category?: string }) =>
    apiCall<PaginatedResponse<FinanceRecord>>('GET', `/finance${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getFinanceRecord: (id: string) =>
    apiCall<FinanceRecord>('GET', `/finance/${id}`),
  
  createFinanceRecord: (data: Omit<FinanceRecord, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<FinanceRecord>('POST', '/finance', data),
  
  updateFinanceRecord: (id: string, data: Partial<Omit<FinanceRecord, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiCall<FinanceRecord>('PUT', `/finance/${id}`, data),
  
  deleteFinanceRecord: (id: string) =>
    apiCall('DELETE', `/finance/${id}`),
};

// Report Services
export const reportService = {
  getReports: (params?: { page?: number; limit?: number; type?: 'SALES' | 'FINANCE' | 'INVENTORY' | 'EMPLOYEE' }) =>
    apiCall<PaginatedResponse<Report>>('GET', `/reports${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),
  
  getReport: (id: string) =>
    apiCall<Report>('GET', `/reports/${id}`),
  
  generateReport: (data: { 
    title: string; 
    type: 'SALES' | 'FINANCE' | 'INVENTORY' | 'EMPLOYEE'; 
    dateFrom: string; 
    dateTo: string; 
  }) =>
    apiCall<Report>('POST', '/reports', data),
  
  deleteReport: (id: string) =>
    apiCall('DELETE', `/reports/${id}`),
};

// Dashboard Services
export const dashboardService = {
  getStats: () =>
    apiCall<DashboardStats>('GET', '/dashboard/stats'),
  
  getDailySales: (days: number = 7) =>
    apiCall<{ date: string; amount: number }[]>('GET', `/dashboard/daily-sales?days=${days}`),
  
  getTopItems: (limit: number = 5) =>
    apiCall<{ item: string; quantity: number; revenue: number }[]>('GET', `/dashboard/top-items?limit=${limit}`),
  
  getRecentTransactions: (limit: number = 5) =>
    apiCall<Transaction[]>('GET', `/dashboard/recent-transactions?limit=${limit}`),
};
