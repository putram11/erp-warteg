'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { financeApi, transactionApi } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDebt, PaymentRecord } from '@/types';
import { 
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const FinancePage: React.FC = () => {
  const { user } = useAuth();
  const [debts, setDebts] = useState<CustomerDebt[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'debts' | 'payments' | 'cashflow'>('debts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'CASH' as 'CASH' | 'TRANSFER',
    notes: ''
  });
  const [summary, setSummary] = useState<any>(null);
  const [cashFlow, setCashFlow] = useState<any>(null);

  // Check permission
  if (user?.role === 'CUSTOMER') {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDebts(),
        fetchPayments(),
        fetchSummary(),
        fetchCashFlow()
      ]);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebts = async () => {
    try {
      const response = await financeApi.getCustomerDebts();
      setDebts(response.data.debts);
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await financeApi.getPaymentRecords();
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await financeApi.getDebtSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const fetchCashFlow = async () => {
    try {
      const response = await financeApi.getCashFlow();
      setCashFlow(response.data);
    } catch (error) {
      console.error('Failed to fetch cash flow:', error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebt) return;

    try {
      await transactionApi.addPayment(selectedDebt.transactionId, {
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes
      });
      
      setShowPaymentForm(false);
      setSelectedDebt(null);
      setPaymentData({ amount: '', paymentMethod: 'CASH', notes: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to add payment:', error);
      alert('Gagal menambahkan pembayaran');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDebts = debts.filter(debt => 
    debt.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => 
    payment.customerDebtId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH':
        return <BanknotesIcon className="w-5 h-5" />;
      case 'TRANSFER':
        return <CreditCardIcon className="w-5 h-5" />;
      default:
        return <CurrencyDollarIcon className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH':
        return 'Tunai';
      case 'TRANSFER':
        return 'Transfer';
      default:
        return method;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h1>
          <p className="text-gray-600">Kelola pembayaran, hutang, dan cash flow</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-10 h-10 text-green-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Piutang</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(summary.totalDebt || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircleIcon className="w-10 h-10 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Hutang Lunas</p>
                  <p className="text-xl font-bold text-blue-600">
                    {summary.settledDebts || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <XCircleIcon className="w-10 h-10 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Hutang Pending</p>
                  <p className="text-xl font-bold text-red-600">
                    {summary.pendingDebts || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BanknotesIcon className="w-10 h-10 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Pembayaran Hari Ini</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatPrice(summary.todayPayments || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('debts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'debts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hutang Piutang
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Riwayat Pembayaran
              </button>
              <button
                onClick={() => setActiveTab('cashflow')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cashflow'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cash Flow
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Cari ${activeTab === 'debts' ? 'hutang' : 'pembayaran'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'debts' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : filteredDebts.length === 0 ? (
                  <div className="text-center py-8">
                    <CurrencyDollarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada hutang ditemukan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDebts.map((debt) => (
                      <div key={debt.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-medium">Customer #{debt.customerId.slice(-8)}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Transaksi #{debt.transactionId.slice(-8)}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {formatDate(debt.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              debt.isSettled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {debt.isSettled ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Total Hutang</p>
                            <p className="font-semibold">{formatPrice(debt.totalDebt)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sisa Hutang</p>
                            <p className="font-semibold text-red-600">
                              {formatPrice(debt.remainingDebt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sudah Dibayar</p>
                            <p className="font-semibold text-green-600">
                              {formatPrice(debt.totalDebt - debt.remainingDebt)}
                            </p>
                          </div>
                        </div>

                        {!debt.isSettled && (
                          <button
                            onClick={() => {
                              setSelectedDebt(debt);
                              setShowPaymentForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Tambah Pembayaran
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada pembayaran ditemukan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="ml-2 font-medium">
                                {formatPrice(payment.amount)}
                              </span>
                              <span className="ml-2 text-sm text-gray-600">
                                via {getPaymentMethodLabel(payment.paymentMethod)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <UserIcon className="w-4 h-4 mr-1" />
                              Customer #{payment.customerDebtId.slice(-8)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {formatDate(payment.createdAt)}
                            </div>
                            {payment.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                Catatan: {payment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cashflow' && (
              <div>
                {cashFlow ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-4">Pemasukan</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Penjualan Tunai:</span>
                            <span className="font-medium">
                              {formatPrice(cashFlow.cashSales || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pembayaran Hutang:</span>
                            <span className="font-medium">
                              {formatPrice(cashFlow.debtPayments || 0)}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Pemasukan:</span>
                            <span>{formatPrice(cashFlow.totalIncome || 0)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-4">Pengeluaran</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Pembelian Bahan:</span>
                            <span className="font-medium">
                              {formatPrice(cashFlow.expenses || 0)}
                            </span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Pengeluaran:</span>
                            <span>{formatPrice(cashFlow.totalExpenses || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-4">Ringkasan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Cash Flow Bersih</p>
                          <p className={`text-2xl font-bold ${
                            (cashFlow.netCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPrice(cashFlow.netCashFlow || 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Saldo Kas</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(cashFlow.cashBalance || 0)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Piutang</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {formatPrice(cashFlow.totalReceivables || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedDebt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Tambah Pembayaran</h2>
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Customer: #{selectedDebt.customerId.slice(-8)}</p>
                  <p className="text-sm text-gray-600">
                    Sisa Hutang: <span className="font-bold text-red-600">
                      {formatPrice(selectedDebt.remainingDebt)}
                    </span>
                  </p>
                </div>
                
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Pembayaran
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={selectedDebt.remainingDebt}
                      step="0.01"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value as 'CASH' | 'TRANSFER' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CASH">Tunai</option>
                      <option value="TRANSFER">Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setSelectedDebt(null);
                        setPaymentData({ amount: '', paymentMethod: 'CASH', notes: '' });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Simpan Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FinancePage;
