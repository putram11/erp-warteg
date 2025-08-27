const { prisma } = require('../utils/database');

const getDailySalesReport = async (dateRange) => {
  const { start, end } = dateRange;

  const dailySales = await prisma.transaction.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: start,
        lte: end
      },
      status: { not: 'CANCELLED' }
    },
    _sum: {
      totalAmount: true,
      paidAmount: true
    },
    _count: {
      id: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const formattedData = dailySales.map(day => ({
    date: day.createdAt.toISOString().split('T')[0],
    totalSales: parseFloat(day._sum.totalAmount || 0),
    totalReceived: parseFloat(day._sum.paidAmount || 0),
    transactionCount: day._count.id,
    averageTransaction: day._count.id > 0 ? parseFloat(day._sum.totalAmount || 0) / day._count.id : 0
  }));

  const totalSales = formattedData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalReceived = formattedData.reduce((sum, day) => sum + day.totalReceived, 0);
  const totalTransactions = formattedData.reduce((sum, day) => sum + day.transactionCount, 0);

  return {
    period: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    },
    summary: {
      totalSales,
      totalReceived,
      totalTransactions,
      averageDaily: formattedData.length > 0 ? totalSales / formattedData.length : 0,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0
    },
    dailyData: formattedData
  };
};

const getMonthlySalesReport = async (year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const monthlySales = await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      status: { not: 'CANCELLED' }
    },
    _sum: {
      totalAmount: true,
      paidAmount: true
    },
    _count: {
      id: true
    }
  });

  // Category breakdown
  const categoryBreakdown = await prisma.transactionItem.groupBy({
    by: ['menuId'],
    where: {
      transaction: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: { not: 'CANCELLED' }
      }
    },
    _sum: {
      quantity: true,
      subtotal: true
    },
    _count: {
      id: true
    }
  });

  // Get menu details for category breakdown
  const menuIds = categoryBreakdown.map(item => item.menuId);
  const menus = await prisma.menu.findMany({
    where: { id: { in: menuIds } },
    select: { id: true, name: true, category: true }
  });

  const categoryData = categoryBreakdown.map(item => {
    const menu = menus.find(m => m.id === item.menuId);
    return {
      menuId: item.menuId,
      menuName: menu?.name || 'Unknown',
      category: menu?.category || 'Unknown',
      quantitySold: item._sum.quantity || 0,
      revenue: parseFloat(item._sum.subtotal || 0),
      orderCount: item._count.id
    };
  });

  // Group by category
  const categoryGrouped = categoryData.reduce((acc, item) => {
    const existing = acc.find(cat => cat.category === item.category);
    if (existing) {
      existing.quantitySold += item.quantitySold;
      existing.revenue += item.revenue;
      existing.orderCount += item.orderCount;
    } else {
      acc.push({
        category: item.category,
        quantitySold: item.quantitySold,
        revenue: item.revenue,
        orderCount: item.orderCount
      });
    }
    return acc;
  }, []);

  return {
    period: {
      year,
      month,
      monthName: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' })
    },
    summary: {
      totalSales: parseFloat(monthlySales._sum.totalAmount || 0),
      totalReceived: parseFloat(monthlySales._sum.paidAmount || 0),
      totalTransactions: monthlySales._count.id,
      averageTransaction: monthlySales._count.id > 0 ? parseFloat(monthlySales._sum.totalAmount || 0) / monthlySales._count.id : 0
    },
    categoryBreakdown: categoryGrouped.sort((a, b) => b.revenue - a.revenue),
    menuBreakdown: categoryData.sort((a, b) => b.revenue - a.revenue).slice(0, 20)
  };
};

const getPopularMenusReport = async (days = 30, limit = 10) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const popularMenus = await prisma.transactionItem.groupBy({
    by: ['menuId'],
    where: {
      transaction: {
        createdAt: {
          gte: startDate
        },
        status: { not: 'CANCELLED' }
      }
    },
    _sum: {
      quantity: true,
      subtotal: true
    },
    _count: {
      id: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: limit
  });

  // Get menu details
  const menuIds = popularMenus.map(item => item.menuId);
  const menus = await prisma.menu.findMany({
    where: { id: { in: menuIds } },
    select: { 
      id: true, 
      name: true, 
      category: true, 
      price: true,
      stock: true 
    }
  });

  const report = popularMenus.map((item, index) => {
    const menu = menus.find(m => m.id === item.menuId);
    return {
      rank: index + 1,
      menuId: item.menuId,
      menuName: menu?.name || 'Unknown',
      category: menu?.category || 'Unknown',
      currentPrice: parseFloat(menu?.price || 0),
      currentStock: menu?.stock || 0,
      quantitySold: item._sum.quantity || 0,
      revenue: parseFloat(item._sum.subtotal || 0),
      orderCount: item._count.id,
      averagePerOrder: item._count.id > 0 ? (item._sum.quantity || 0) / item._count.id : 0
    };
  });

  return {
    period: {
      days,
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    totalMenusAnalyzed: menuIds.length,
    popularMenus: report
  };
};

const getStockAlertsReport = async (lowStockThreshold = 5) => {
  const lowStockMenus = await prisma.menu.findMany({
    where: {
      stock: {
        lte: lowStockThreshold
      },
      isAvailable: true
    },
    orderBy: {
      stock: 'asc'
    }
  });

  const outOfStockMenus = await prisma.menu.findMany({
    where: {
      stock: 0,
      isAvailable: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return {
    threshold: lowStockThreshold,
    alerts: {
      outOfStock: {
        count: outOfStockMenus.length,
        items: outOfStockMenus.map(menu => ({
          id: menu.id,
          name: menu.name,
          category: menu.category,
          price: parseFloat(menu.price),
          stock: menu.stock
        }))
      },
      lowStock: {
        count: lowStockMenus.length,
        items: lowStockMenus.map(menu => ({
          id: menu.id,
          name: menu.name,
          category: menu.category,
          price: parseFloat(menu.price),
          stock: menu.stock,
          alertLevel: menu.stock === 0 ? 'critical' : menu.stock <= 2 ? 'high' : 'medium'
        }))
      }
    }
  };
};

const getDashboardData = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Today's sales
  const todaySales = await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: { not: 'CANCELLED' }
    },
    _sum: {
      totalAmount: true,
      paidAmount: true
    },
    _count: {
      id: true
    }
  });

  // This month's sales
  const monthSales = await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth
      },
      status: { not: 'CANCELLED' }
    },
    _sum: {
      totalAmount: true,
      paidAmount: true
    },
    _count: {
      id: true
    }
  });

  // Active debts
  const activeDebts = await prisma.customerDebt.aggregate({
    where: {
      isSettled: false
    },
    _sum: {
      remainingDebt: true
    },
    _count: {
      id: true
    }
  });

  // Low stock items
  const lowStockCount = await prisma.menu.count({
    where: {
      stock: {
        lte: 5
      },
      isAvailable: true
    }
  });

  // Recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    take: 5,
    where: {
      status: { not: 'CANCELLED' }
    },
    include: {
      customer: {
        select: {
          name: true
        }
      },
      transactionItems: {
        include: {
          menu: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Top selling items today
  const topItemsToday = await prisma.transactionItem.groupBy({
    by: ['menuId'],
    where: {
      transaction: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { not: 'CANCELLED' }
      }
    },
    _sum: {
      quantity: true
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 5
  });

  const topMenuIds = topItemsToday.map(item => item.menuId);
  const topMenus = await prisma.menu.findMany({
    where: { id: { in: topMenuIds } },
    select: { id: true, name: true, category: true }
  });

  const topItemsWithDetails = topItemsToday.map(item => {
    const menu = topMenus.find(m => m.id === item.menuId);
    return {
      menuName: menu?.name || 'Unknown',
      category: menu?.category || 'Unknown',
      quantitySold: item._sum.quantity || 0
    };
  });

  return {
    today: {
      sales: parseFloat(todaySales._sum.totalAmount || 0),
      received: parseFloat(todaySales._sum.paidAmount || 0),
      transactions: todaySales._count.id
    },
    month: {
      sales: parseFloat(monthSales._sum.totalAmount || 0),
      received: parseFloat(monthSales._sum.paidAmount || 0),
      transactions: monthSales._count.id
    },
    debts: {
      total: parseFloat(activeDebts._sum.remainingDebt || 0),
      count: activeDebts._count.id
    },
    inventory: {
      lowStockCount
    },
    recentTransactions: recentTransactions.map(transaction => ({
      id: transaction.id,
      customerName: transaction.customer.name,
      totalAmount: parseFloat(transaction.totalAmount),
      status: transaction.status,
      createdAt: transaction.createdAt,
      items: transaction.transactionItems.map(item => ({
        menuName: item.menu.name,
        quantity: item.quantity
      }))
    })),
    topItemsToday: topItemsWithDetails
  };
};

module.exports = {
  getDailySalesReport,
  getMonthlySalesReport,
  getPopularMenusReport,
  getStockAlertsReport,
  getDashboardData
};
