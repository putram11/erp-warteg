import React, { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  performanceScore?: number;
  createdAt: string;
}

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Mock data
  const employees: Employee[] = [
    {
      id: 'EMP-001',
      name: 'Siti Rahma',
      email: 'siti.rahma@warteg.com',
      phone: '081234567890',
      position: 'Manager',
      salary: 5000000,
      hireDate: '2023-01-15T00:00:00Z',
      status: 'active',
      performanceScore: 95,
      createdAt: '2023-01-15T00:00:00Z',
    },
    {
      id: 'EMP-002',
      name: 'Budi Kurniawan',
      email: 'budi.kurniawan@warteg.com',
      phone: '081234567891',
      position: 'Kasir',
      salary: 3500000,
      hireDate: '2023-02-01T00:00:00Z',
      status: 'active',
      performanceScore: 88,
      createdAt: '2023-02-01T00:00:00Z',
    },
    {
      id: 'EMP-003',
      name: 'Ahmad Rifai',
      email: 'ahmad.rifai@warteg.com',
      phone: '081234567892',
      position: 'Chef',
      salary: 4000000,
      hireDate: '2023-03-10T00:00:00Z',
      status: 'active',
      performanceScore: 92,
      createdAt: '2023-03-10T00:00:00Z',
    },
    {
      id: 'EMP-004',
      name: 'Dewi Sartika',
      email: 'dewi.sartika@warteg.com',
      position: 'Waitress',
      salary: 3000000,
      hireDate: '2023-04-05T00:00:00Z',
      status: 'on-leave',
      performanceScore: 85,
      createdAt: '2023-04-05T00:00:00Z',
    },
    {
      id: 'EMP-005',
      name: 'Rudi Hartono',
      email: 'rudi.hartono@warteg.com',
      phone: '081234567894',
      position: 'Kitchen Staff',
      salary: 3200000,
      hireDate: '2023-05-20T00:00:00Z',
      status: 'inactive',
      performanceScore: 75,
      createdAt: '2023-05-20T00:00:00Z',
    },
  ];

  const positions = ['all', 'Manager', 'Kasir', 'Chef', 'Waitress', 'Kitchen Staff'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone?.includes(searchTerm) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || employee.position === positionFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const averagePerformance = employees.reduce((sum, e) => sum + (e.performanceScore || 0), 0) / totalEmployees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola data karyawan dan monitor performa tim
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">{activeEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Gaji</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(totalSalary)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BriefcaseIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Performance</p>
              <p className="text-2xl font-semibold text-gray-900">{averagePerformance.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari karyawan berdasarkan nama, email, phone, atau ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="all">Semua Posisi</option>
              {positions.slice(1).map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.id}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                {employee.email}
              </div>
              {employee.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {employee.phone}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <BriefcaseIcon className="w-4 h-4 mr-2" />
                {employee.position}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Bergabung: {formatDate(employee.hireDate)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{formatPrice(employee.salary)}</p>
                <p className="text-xs text-gray-500">Gaji/Bulan</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className={`text-lg font-bold ${getPerformanceColor(employee.performanceScore || 0)}`}>
                  {employee.performanceScore || 0}%
                </p>
                <p className="text-xs text-gray-500">Performance</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(employee)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <EyeIcon className="w-4 h-4 mr-1" />
                Detail
              </button>
              <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada karyawan ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter.</p>
        </div>
      )}

      {/* Modal for Add/Edit Employee (placeholder) */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Form untuk {editingEmployee ? 'mengedit' : 'menambah'} karyawan akan segera tersedia.
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

export default Employees;
