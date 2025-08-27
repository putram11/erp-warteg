'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { reportApi } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardData {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  totalMenus: number;
  recentTransactions: any[];
  lowStockMenus: any[];
  salesThisMonth: number;
  salesLastMonth: number;
}

interface SalesReport {
  date: string;
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
}

interface PopularMenu {
  menuId: string;
  menuName: string;
  totalQuantity: number;
  totalRevenue: number;
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'menu' | 'stock'>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [salesReport, setSalesReport] = useState<SalesReport[]>([]);
  const [popularMenus, setPopularMenus] = useState<PopularMenu[]>([]);
  const [stockAlerts, setStockAlerts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

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
  }, [activeTab, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchSalesReport(),
        fetchPopularMenus(),
        fetchStockAlerts()
      ]);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await reportApi.getDashboardData();
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchSalesReport = async () => {
    try {
      const response = await reportApi.getDailySalesReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setSalesReport(Array.isArray(response.data.report) ? response.data.report : []);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    }
  };

  const fetchPopularMenus = async () => {
    try {
      const response = await reportApi.getPopularMenusReport({ days: 30, limit: 10 });
      setPopularMenus(response.data.report.menus || []);
    } catch (error) {
      console.error('Failed to fetch popular menus:', error);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const response = await reportApi.getStockAlertsReport();
      setStockAlerts(response.data.menus || []);
    } catch (error) {
      console.error('Failed to fetch stock alerts:', error);
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
      day: 'numeric'
    });
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4"></div>;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTotalSales = () => {
    return salesReport.reduce((total, report) => total + report.totalSales, 0);
  };

  const getTotalTransactions = () => {
    return salesReport.reduce((total, report) => total + report.totalTransactions, 0);
  };

  const getAverageOrderValue = () => {
    const totalSales = getTotalSales();
    const totalTransactions = getTotalTransactions();
    return totalTransactions > 0 ? totalSales / totalTransactions : 0;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Analisis</h1>
          <p className="text-gray-600">Dashboard dan laporan bisnis</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
                { key: 'sales', label: 'Penjualan', icon: CurrencyDollarIcon },
                { key: 'menu', label: 'Menu Populer', icon: ShoppingBagIcon },
                { key: 'stock', label: 'Stok Alert', icon: ExclamationTriangleIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : dashboardData ? (
                  <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="w-10 h-10 text-blue-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Total Penjualan</p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatPrice(dashboardData.totalSales)}
                            </p>
                            {dashboardData.salesLastMonth > 0 && (
                              <div className="flex items-center mt-1">
                                {getTrendIcon(calculateTrend(dashboardData.salesThisMonth, dashboardData.salesLastMonth))}
                                <span className={`text-sm ml-1 ${getTrendColor(calculateTrend(dashboardData.salesThisMonth, dashboardData.salesLastMonth))}`}>
                                  {Math.abs(calculateTrend(dashboardData.salesThisMonth, dashboardData.salesLastMonth)).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="flex items-center">
                          <ShoppingBagIcon className="w-10 h-10 text-green-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Total Transaksi</p>
                            <p className="text-xl font-bold text-green-600">
                              {dashboardData.totalTransactions}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="flex items-center">
                          <ChartBarIcon className="w-10 h-10 text-purple-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Total Pelanggan</p>
                            <p className="text-xl font-bold text-purple-600">
                              {dashboardData.totalCustomers}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-lg">
                        <div className="flex items-center">
                          <ChartBarIcon className="w-10 h-10 text-orange-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Total Menu</p>
                            <p className="text-xl font-bold text-orange-600">
                              {dashboardData.totalMenus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Transaksi Terbaru</h3>
                        <div className="space-y-3">
                          {dashboardData.recentTransactions?.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">#{transaction.id.slice(-8)}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(transaction.createdAt)}
                                </p>
                              </div>
                              <span className="font-semibold">
                                {formatPrice(transaction.totalAmount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Stok Menipis</h3>
                        <div className="space-y-3">
                          {dashboardData.lowStockMenus?.slice(0, 5).map((menu) => (
                            <div key={menu.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                              <div>
                                <p className="font-medium">{menu.name}</p>
                                <p className="text-sm text-gray-600">{menu.category}</p>
                              </div>
                              <span className="text-red-600 font-semibold">
                                {menu.stock} tersisa
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
                  </div>
                )}
              </div>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <>
                    {/* Sales Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <h3 className="font-semibold text-blue-800 mb-2">Total Penjualan</h3>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(getTotalSales())}
                        </p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <h3 className="font-semibold text-green-800 mb-2">Total Transaksi</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {getTotalTransactions()}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <h3 className="font-semibold text-purple-800 mb-2">Rata-rata Order</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPrice(getAverageOrderValue())}
                        </p>
                      </div>
                    </div>

                    {/* Sales Chart Data */}
                    <div>
                      <h3 className="font-semibold mb-4">Laporan Penjualan Harian</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Tanggal
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Penjualan
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Transaksi
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Rata-rata Order
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {salesReport.map((report, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatDate(report.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatPrice(report.totalSales)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {report.totalTransactions}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatPrice(report.averageOrderValue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Popular Menus Tab */}
            {activeTab === 'menu' && (
              <div>
                <h3 className="font-semibold mb-4">Menu Terpopuler (30 Hari Terakhir)</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : popularMenus.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada data menu populer</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularMenus.map((menu, index) => (
                      <div key={menu.menuId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium">{menu.menuName}</h4>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Terjual</p>
                            <p className="font-semibold">{menu.totalQuantity} porsi</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-semibold text-green-600">
                              {formatPrice(menu.totalRevenue)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stock Alerts Tab */}
            {activeTab === 'stock' && (
              <div>
                <h3 className="font-semibold mb-4">Peringatan Stok Menipis</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : stockAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500">Semua menu memiliki stok yang cukup</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stockAlerts.map((menu) => (
                      <div key={menu.id} className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-red-800">{menu.name}</h4>
                            <p className="text-sm text-red-600 mb-2">{menu.category}</p>
                            <div className="flex items-center text-sm">
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-1" />
                              <span className="text-red-700">
                                Stok tersisa: {menu.stock}
                              </span>
                            </div>
                          </div>
                          <span className="text-red-600 font-semibold">
                            {formatPrice(menu.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
