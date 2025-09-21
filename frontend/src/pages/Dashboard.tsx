import React from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Penjualan Hari Ini',
      value: 'Rp 2,450,000',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Transaksi Hari Ini',
      value: '127',
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Pelanggan',
      value: '1,234',
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+3%',
      changeType: 'increase',
    },
    {
      name: 'Menu Item',
      value: '45',
      icon: Squares2X2Icon,
      color: 'bg-orange-500',
      change: '0%',
      changeType: 'neutral',
    },
  ];

  const recentTransactions = [
    { id: '1', customer: 'Ahmad Santoso', amount: 'Rp 45,000', time: '10:30', status: 'completed' },
    { id: '2', customer: 'Maria Sari', amount: 'Rp 67,500', time: '10:25', status: 'completed' },
    { id: '3', customer: 'Budi Kurniawan', amount: 'Rp 32,000', time: '10:20', status: 'pending' },
    { id: '4', customer: 'Siti Nurhaliza', amount: 'Rp 58,000', time: '10:15', status: 'completed' },
  ];

  const topMenuItems = [
    { name: 'Nasi Gudeg', sold: 23, revenue: 'Rp 345,000' },
    { name: 'Ayam Goreng', sold: 19, revenue: 'Rp 285,000' },
    { name: 'Rendang', sold: 15, revenue: 'Rp 225,000' },
    { name: 'Gado-gado', sold: 12, revenue: 'Rp 180,000' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selamat datang kembali, {user?.name}! Berikut ringkasan bisnis Anda hari ini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change} dari kemarin
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Transaksi Terbaru</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {transaction.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                      <p className="text-sm text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{transaction.amount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="btn-primary btn-sm w-full">
                Lihat Semua Transaksi
              </button>
            </div>
          </div>
        </div>

        {/* Top Menu Items */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Menu Terlaris</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topMenuItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.sold} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="btn-primary btn-sm w-full">
                Lihat Menu Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary flex flex-col items-center py-4">
            <ShoppingCartIcon className="w-6 h-6 mb-2" />
            <span className="text-sm">Transaksi Baru</span>
          </button>
          <button className="btn-secondary flex flex-col items-center py-4">
            <Squares2X2Icon className="w-6 h-6 mb-2" />
            <span className="text-sm">Tambah Menu</span>
          </button>
          <button className="btn-secondary flex flex-col items-center py-4">
            <UsersIcon className="w-6 h-6 mb-2" />
            <span className="text-sm">Pelanggan Baru</span>
          </button>
          <button className="btn-secondary flex flex-col items-center py-4">
            <CurrencyDollarIcon className="w-6 h-6 mb-2" />
            <span className="text-sm">Laporan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
