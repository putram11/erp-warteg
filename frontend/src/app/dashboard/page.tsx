'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/lib/services';
import { formatCurrency } from '@/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportApi.getDashboardData().then(res => res.data.dashboard),
    enabled: !!user && user.role !== 'CUSTOMER',
  });

  if (user?.role === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Selamat datang, {user.name}!
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Halaman pelanggan sedang dalam pengembangan. 
              Silakan hubungi kasir untuk melakukan pemesanan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard ERP Warteg
          </h1>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali, {user?.name}!
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Penjualan Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData?.today?.sales || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardData?.today?.transactions || 0} transaksi
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Penjualan Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData?.month?.sales || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardData?.month?.transactions || 0} transaksi
                </p>
              </div>
              <div className="p-3 bg-success-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Utang</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData?.debts?.total || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboardData?.debts?.count || 0} pelanggan
                </p>
              </div>
              <div className="p-3 bg-warning-100 rounded-full">
                <span className="text-2xl">💳</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Stok Menipis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.inventory?.lowStockCount || 0}
                </p>
                <p className="text-sm text-gray-500">item menu</p>
              </div>
              <div className="p-3 bg-danger-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transaksi Terbaru
            </h3>
            <div className="space-y-3">
              {dashboardData?.recentTransactions?.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {transaction.customerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.items.map(item => `${item.quantity}x ${item.menuName}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(transaction.totalAmount)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'COMPLETED' 
                        ? 'badge-success' 
                        : transaction.status === 'PENDING'
                        ? 'badge-warning'
                        : 'badge-gray'
                    }`}>
                      {transaction.status === 'COMPLETED' ? 'Selesai' : 
                       transaction.status === 'PENDING' ? 'Menunggu' : transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Items Today */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Menu Terlaris Hari Ini
            </h3>
            <div className="space-y-3">
              {dashboardData?.topItemsToday?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-semibold text-primary-600 mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.menuName}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.quantitySold} porsi
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn-primary p-4 text-center">
              <span className="block text-2xl mb-2">🍛</span>
              <span className="text-sm">Kelola Menu</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <span className="block text-2xl mb-2">💰</span>
              <span className="text-sm">Transaksi Baru</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <span className="block text-2xl mb-2">📊</span>
              <span className="text-sm">Lihat Laporan</span>
            </button>
            <button className="btn-secondary p-4 text-center">
              <span className="block text-2xl mb-2">👥</span>
              <span className="text-sm">Kelola Pelanggan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
