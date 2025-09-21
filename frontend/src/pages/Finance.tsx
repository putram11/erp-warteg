import React, { useState } from 'react';
import {
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  createdAt: string;
}

const Finance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);

  // Mock data
  const financeRecords: FinanceRecord[] = [
    {
      id: 'FIN-001',
      type: 'income',
      category: 'Sales Revenue',
      description: 'Penjualan harian',
      amount: 2500000,
      date: '2024-01-15',
      paymentMethod: 'Cash',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'FIN-002',
      type: 'expense',
      category: 'Ingredients',
      description: 'Pembelian bahan baku',
      amount: 800000,
      date: '2024-01-14',
      paymentMethod: 'Transfer',
      createdAt: '2024-01-14T14:30:00Z',
    },
    {
      id: 'FIN-003',
      type: 'income',
      category: 'Sales Revenue',
      description: 'Penjualan harian',
      amount: 2800000,
      date: '2024-01-14',
      paymentMethod: 'Cash',
      createdAt: '2024-01-14T20:00:00Z',
    },
    {
      id: 'FIN-004',
      type: 'expense',
      category: 'Utilities',
      description: 'Tagihan listrik dan air',
      amount: 450000,
      date: '2024-01-13',
      paymentMethod: 'Transfer',
      createdAt: '2024-01-13T16:00:00Z',
    },
    {
      id: 'FIN-005',
      type: 'expense',
      category: 'Salary',
      description: 'Gaji karyawan bulan ini',
      amount: 15000000,
      date: '2024-01-01',
      paymentMethod: 'Transfer',
      createdAt: '2024-01-01T09:00:00Z',
    },
    {
      id: 'FIN-006',
      type: 'income',
      category: 'Sales Revenue',
      description: 'Penjualan weekend',
      amount: 3200000,
      date: '2024-01-13',
      paymentMethod: 'Mixed',
      createdAt: '2024-01-13T19:00:00Z',
    },
  ];

  const incomeCategories = ['Sales Revenue', 'Other Income'];
  const expenseCategories = ['Ingredients', 'Utilities', 'Salary', 'Equipment', 'Marketing', 'Other Expenses'];
  const allCategories = ['all', ...incomeCategories, ...expenseCategories];

  const filteredRecords = financeRecords.filter(record => {
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
    return matchesType && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleEdit = (record: FinanceRecord) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  // Calculate financial metrics
  const totalIncome = financeRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financeRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100) : 0;

  // Group records by category for chart simulation
  const categoryTotals = financeRecords.reduce((acc, record) => {
    if (!acc[record.category]) {
      acc[record.category] = { income: 0, expense: 0 };
    }
    acc[record.category][record.type] += record.amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor keuangan dan kelola pemasukan serta pengeluaran
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Record
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pemasukan</p>
              <p className="text-2xl font-semibold text-green-600">{formatPrice(totalIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pengeluaran</p>
              <p className="text-2xl font-semibold text-red-600">{formatPrice(totalExpense)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className={`text-2xl font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(netProfit)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Profit Margin</p>
              <p className={`text-2xl font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex space-x-2">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period === 'week' ? 'Minggu' : period === 'month' ? 'Bulan' : period === 'quarter' ? 'Kuartal' : 'Tahun'}
              </button>
            ))}
          </div>
          <div className="flex gap-4 lg:ml-auto">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {allCategories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Analisis per Kategori</h3>
          <ChartBarIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryTotals).map(([category, totals]) => (
            <div key={category} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
              <div className="space-y-2">
                {totals.income > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-600">Pemasukan</span>
                    <span className="text-sm font-medium text-green-600">{formatPrice(totals.income)}</span>
                  </div>
                )}
                {totals.expense > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-red-600">Pengeluaran</span>
                    <span className="text-sm font-medium text-red-600">{formatPrice(totals.expense)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Net</span>
                    <span className={`text-sm font-medium ${
                      (totals.income - totals.expense) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPrice(totals.income - totals.expense)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      record.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type === 'income' ? (
                        <>
                          <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                          Pemasukan
                        </>
                      ) : (
                        <>
                          <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                          Pengeluaran
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {record.type === 'income' ? '+' : '-'}{formatPrice(record.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <BanknotesIcon className="w-4 h-4 mr-1 text-gray-400" />
                      {record.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada record ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500">Coba ubah filter atau tambah record baru.</p>
        </div>
      )}

      {/* Modal for Add/Edit Finance Record (placeholder) */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingRecord ? 'Edit Record Keuangan' : 'Tambah Record Keuangan'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Form untuk {editingRecord ? 'mengedit' : 'menambah'} record keuangan akan segera tersedia.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
