import api from '@/lib/api';
import type {
  LoginRequest,
  LoginResponse,
  User,
  Menu,
  CreateMenuRequest,
  Transaction,
  CreateTransactionRequest,
  DashboardData,
  SalesReport,
  PopularMenusReport,
  CustomerDebt,
  PaymentRecord,
  ApiResponse,
} from '@/types';

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),
  
  register: (data: any) =>
    api.post<LoginResponse>('/auth/register', data),
  
  getProfile: () =>
    api.get<{ user: User }>('/auth/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<{ user: User }>('/auth/profile', data),
  
  logout: () =>
    api.post('/auth/logout'),
};

// Menu API
export const menuApi = {
  getMenus: (params?: {
    category?: string;
    available?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ menus: Menu[]; pagination: any }>('/menus', { params }),
  
  getMenuById: (id: string) =>
    api.get<{ menu: Menu }>(`/menus/${id}`),
  
  createMenu: (data: CreateMenuRequest) =>
    api.post<{ menu: Menu }>('/menus', data),
  
  updateMenu: (id: string, data: Partial<CreateMenuRequest>) =>
    api.put<{ menu: Menu }>(`/menus/${id}`, data),
  
  deleteMenu: (id: string) =>
    api.delete(`/menus/${id}`),
  
  updateStock: (id: string, data: {
    quantity: number;
    type: 'RESTOCK' | 'SALE' | 'ADJUSTMENT';
    description?: string;
  }) =>
    api.post(`/menus/${id}/stock`, data),
  
  getStockHistory: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/menus/${id}/stock-history`, { params }),
};

// Transaction API
export const transactionApi = {
  getTransactions: (params?: {
    status?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ transactions: Transaction[]; pagination: any }>('/transactions', { params }),
  
  getTransactionById: (id: string) =>
    api.get<{ transaction: Transaction }>(`/transactions/${id}`),
  
  createTransaction: (data: CreateTransactionRequest) =>
    api.post<{ transaction: Transaction }>('/transactions', data),
  
  updateTransactionStatus: (id: string, status: string) =>
    api.patch(`/transactions/${id}/status`, { status }),
  
  addPayment: (id: string, data: {
    amount: number;
    paymentMethod?: 'CASH' | 'TRANSFER';
    notes?: string;
  }) =>
    api.post(`/transactions/${id}/payments`, data),
  
  getTransactionPayments: (id: string) =>
    api.get<{ payments: PaymentRecord[] }>(`/transactions/${id}/payments`),
  
  cancelTransaction: (id: string) =>
    api.delete(`/transactions/${id}`),
};

// Customer API
export const customerApi = {
  getCustomers: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ customers: User[]; pagination: any }>('/customers', { params }),
  
  getCustomerById: (id: string) =>
    api.get<{ customer: User }>(`/customers/${id}`),
  
  getCustomerTransactions: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<{ transactions: Transaction[]; pagination: any }>(`/customers/${id}/transactions`, { params }),
  
  getCustomerDebts: (id: string) =>
    api.get<{ debts: CustomerDebt[] }>(`/customers/${id}/debts`),
};

// Finance API
export const financeApi = {
  getCustomerDebts: (params?: {
    customerId?: string;
    settled?: boolean;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ debts: CustomerDebt[]; pagination: any }>('/finance/debts', { params }),
  
  getDebtSummary: () =>
    api.get('/finance/debts/summary'),
  
  getPaymentRecords: (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ payments: PaymentRecord[]; pagination: any }>('/finance/payments', { params }),
  
  getCashFlow: (params?: {
    startDate?: string;
    endDate?: string;
  }) =>
    api.get('/finance/cash-flow', { params }),
};

// Report API
export const reportApi = {
  getDailySalesReport: (params?: {
    startDate?: string;
    endDate?: string;
  }) =>
    api.get<{ report: SalesReport }>('/reports/sales/daily', { params }),
  
  getMonthlySalesReport: (params?: {
    year?: number;
    month?: number;
  }) =>
    api.get('/reports/sales/monthly', { params }),
  
  getPopularMenusReport: (params?: {
    days?: number;
    limit?: number;
  }) =>
    api.get<{ report: PopularMenusReport }>('/reports/menu/popular', { params }),
  
  getStockAlertsReport: () =>
    api.get('/reports/menu/stock-alerts'),
  
  getDashboardData: () =>
    api.get<{ dashboard: DashboardData }>('/reports/dashboard'),
};

// Employee API
export const employeeApi = {
  getEmployees: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<{ employees: User[]; pagination: any }>('/employees', { params }),
  
  getEmployeeById: (id: string) =>
    api.get<{ employee: User }>(`/employees/${id}`),
  
  updateEmployee: (id: string, data: Partial<User>) =>
    api.put<{ employee: User }>(`/employees/${id}`, data),
  
  deactivateEmployee: (id: string) =>
    api.patch(`/employees/${id}/deactivate`),
  
  activateEmployee: (id: string) =>
    api.patch(`/employees/${id}/activate`),
};
