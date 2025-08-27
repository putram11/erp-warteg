'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { reportApi } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  totalMenus: number;
  salesThisMonth: number;
  salesLastMonth: number;
  recentTransactions: any[];
  lowStockMenus: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await reportApi.getDashboardData();
      setStats(response.data.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Selamat datang, {user?.name}!
          </h1>
          <p className="text-blue-100">
            Berikut adalah ringkasan aktivitas warteg hari ini
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Penjualan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? formatPrice(stats.totalSales) : formatPrice(0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingBagIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalTransactions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <UsersIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pelanggan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalCustomers || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <ChartBarIcon className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menu Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalMenus || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Transaksi Terbaru</h3>
            </div>
            <div className="p-6">
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">#{transaction.id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(transaction.totalAmount)}</p>
                        <p className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Belum ada transaksi hari ini</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Peringatan Stok</h3>
            </div>
            <div className="p-6">
              {stats?.lowStockMenus && stats.lowStockMenus.length > 0 ? (
                <div className="space-y-4">
                  {stats.lowStockMenus.slice(0, 5).map((menu) => (
                    <div key={menu.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{menu.name}</p>
                        <p className="text-sm text-gray-600">{menu.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          menu.stock <= 5 ? 'text-red-600' : 
                          menu.stock <= 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {menu.stock} tersisa
                        </p>
                        <p className="text-sm text-gray-600">{formatPrice(menu.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Semua menu memiliki stok yang cukup</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/transactions"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ShoppingBagIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Transaksi Baru</p>
            </a>
            <a
              href="/menu"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <ChartBarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Kelola Menu</p>
            </a>
            <a
              href="/customers"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <UsersIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Data Pelanggan</p>
            </a>
            <a
              href="/reports"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <CurrencyDollarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Laporan</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;