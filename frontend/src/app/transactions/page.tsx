'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { transactionApi, menuApi } from '@/lib/services';
import { Transaction, Menu, MenuCategory } from '@/types';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState<Array<{ menu: Menu; quantity: number }>>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    paymentMethod: 'CASH' as 'CASH' | 'DEBIT' | 'CREDIT' | 'TRANSFER',
    notes: ''
  });

  const statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Selesai' },
    { value: 'CANCELLED', label: 'Dibatalkan' }
  ];

  const paymentMethods = [
    { value: 'CASH', label: 'Tunai' },
    { value: 'DEBIT', label: 'Debit' },
    { value: 'CREDIT', label: 'Kredit' },
    { value: 'TRANSFER', label: 'Transfer' }
  ];

  useEffect(() => {
    fetchTransactions();
    fetchMenus();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionApi.getTransactions();
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await menuApi.getMenus({ available: true });
      setMenus(response.data.menus);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const addToCart = (menu: Menu) => {
    const existingItem = cart.find(item => item.menu.id === menu.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.menu.id === menu.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { menu, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.menu.id !== menuId));
    } else {
      setCart(cart.map(item => 
        item.menu.id === menuId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.menu.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }

    try {
      const transactionData = {
        customerId: formData.customerId || undefined,
        items: cart.map(item => ({
          menuId: item.menu.id,
          quantity: item.quantity
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      await transactionApi.createTransaction(transactionData);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Gagal membuat transaksi');
    }
  };

  const handleStatusUpdate = async (id: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await transactionApi.updateTransactionStatus(id, status);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      paymentMethod: 'CASH',
      notes: ''
    });
    setCart([]);
    setShowForm(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
            <p className="text-gray-600">Kelola transaksi penjualan</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Transaksi Baru</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Memuat transaksi...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada transaksi ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transaksi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                          {transaction.customer?.name || 'Guest'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(transaction.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mr-2" />
                          {paymentMethods.find(pm => pm.value === transaction.paymentMethod)?.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                            {statusOptions.find(s => s.value === transaction.status)?.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {transaction.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(transaction.id, 'COMPLETED')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Selesai
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(transaction.id, 'CANCELLED')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Batal
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Transaksi Baru</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Menu Selection */}
                  <div>
                    <h3 className="font-semibold mb-3">Pilih Menu</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {menus.map((menu) => (
                        <div key={menu.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-medium">{menu.name}</p>
                            <p className="text-sm text-gray-600">{formatPrice(menu.price)}</p>
                            <p className="text-xs text-gray-500">Stok: {menu.stock}</p>
                          </div>
                          <button
                            onClick={() => addToCart(menu)}
                            disabled={menu.stock <= 0}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
                          >
                            Tambah
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cart */}
                  <div>
                    <h3 className="font-semibold mb-3">Keranjang</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-sm">Keranjang kosong</p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.menu.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <p className="font-medium">{item.menu.name}</p>
                              <p className="text-sm text-gray-600">
                                {formatPrice(item.menu.price)} x {item.quantity} = {formatPrice(item.menu.price * item.quantity)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQuantity(item.menu.id, item.quantity - 1)}
                                className="bg-red-100 text-red-600 w-6 h-6 rounded text-sm"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.menu.id, item.quantity + 1)}
                                className="bg-green-100 text-green-600 w-6 h-6 rounded text-sm"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-bold">Total:</span>
                          <span className="font-bold text-lg">{formatPrice(getTotalAmount())}</span>
                        </div>
                      </div>
                    )}

                    {/* Transaction Details */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Pelanggan (Opsional)
                        </label>
                        <input
                          type="text"
                          value={formData.customerId}
                          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Kosongkan untuk guest"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Metode Pembayaran
                        </label>
                        <select
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {paymentMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catatan (Opsional)
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={cart.length === 0}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                        >
                          Buat Transaksi
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionsPage;
