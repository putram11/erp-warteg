import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'badge-success';
    case 'PENDING':
      return 'badge-warning';
    case 'PARTIAL':
      return 'badge-warning';
    case 'CANCELLED':
      return 'badge-danger';
    default:
      return 'badge-gray';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'Selesai';
    case 'PENDING':
      return 'Menunggu';
    case 'PARTIAL':
      return 'Sebagian';
    case 'CANCELLED':
      return 'Dibatalkan';
    default:
      return status;
  }
}

export function getCategoryText(category: string): string {
  switch (category) {
    case 'NASI':
      return 'Nasi';
    case 'LAUK':
      return 'Lauk';
    case 'SAMBAL':
      return 'Sambal';
    case 'SAYUR':
      return 'Sayur';
    case 'MINUMAN':
      return 'Minuman';
    default:
      return category;
  }
}

export function getRoleText(role: string): string {
  switch (role) {
    case 'OWNER':
      return 'Pemilik';
    case 'EMPLOYEE':
      return 'Karyawan';
    case 'CUSTOMER':
      return 'Pelanggan';
    default:
      return role;
  }
}

export function getPaymentMethodText(method: string): string {
  switch (method) {
    case 'CASH':
      return 'Tunai';
    case 'TRANSFER':
      return 'Transfer';
    case 'DEBT':
      return 'Utang';
    default:
      return method;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
