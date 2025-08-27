'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { customerApi } from '@/lib/services';
import { User, Transaction, CustomerDebt } from '@/types';
import { 
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([]);
  const [customerDebts, setCustomerDebts] = useState<CustomerDebt[]>([]);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerApi.getCustomers();
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customer: User) => {
    try {
      setSelectedCustomer(customer);
      const [transactionsResponse, debtsResponse] = await Promise.all([
        customerApi.getCustomerTransactions(customer.id),
        customerApi.getCustomerDebts(customer.id)
      ]);
      setCustomerTransactions(transactionsResponse.data.transactions);
      setCustomerDebts(debtsResponse.data.debts);
      setShowDetail(true);
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      day: 'numeric'
    });
  };

  const getTotalDebt = (debts: CustomerDebt[]) => {
    return debts
      .filter(debt => !debt.isSettled)
      .reduce((total, debt) => total + debt.remainingDebt, 0);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pelanggan</h1>
            <p className="text-gray-600">Kelola data pelanggan dan riwayat transaksi</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : filteredCustomers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada pelanggan ditemukan</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {customer.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        {customer.phone}
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {customer.address}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <UserIcon className="w-4 h-4 mr-2" />
                      Bergabung {formatDate(customer.createdAt)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      onClick={() => fetchCustomerDetails(customer)}
                      className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Customer Detail Modal */}
        {showDetail && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Detail Pelanggan</h2>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-medium">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p className="text-gray-600">{selectedCustomer.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center">
                        <ShoppingBagIcon className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Transaksi</p>
                          <p className="text-lg font-semibold">{customerTransactions.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Pembelian</p>
                          <p className="text-lg font-semibold">
                            {formatPrice(customerTransactions.reduce((total, t) => total + t.totalAmount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-8 h-8 text-red-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Total Hutang</p>
                          <p className="text-lg font-semibold">
                            {formatPrice(getTotalDebt(customerDebts))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transactions */}
                  <div>
                    <h3 className="font-semibold mb-3">Riwayat Transaksi</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customerTransactions.length === 0 ? (
                        <p className="text-gray-500 text-sm">Belum ada transaksi</p>
                      ) : (
                        customerTransactions.map((transaction) => (
                          <div key={transaction.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">#{transaction.id.slice(-8)}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {formatDate(transaction.createdAt)}
                              </span>
                              <span className="font-semibold">
                                {formatPrice(transaction.totalAmount)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Debts */}
                  <div>
                    <h3 className="font-semibold mb-3">Riwayat Hutang</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customerDebts.length === 0 ? (
                        <p className="text-gray-500 text-sm">Tidak ada hutang</p>
                      ) : (
                        customerDebts.map((debt) => (
                          <div key={debt.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">Hutang #{debt.transactionId.slice(-8)}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                debt.isSettled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {debt.isSettled ? 'Lunas' : 'Belum Lunas'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Hutang:</span>
                                <span>{formatPrice(debt.totalDebt)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Sisa Hutang:</span>
                                <span className="font-semibold">
                                  {formatPrice(debt.remainingDebt)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(debt.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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

export default CustomersPage;
