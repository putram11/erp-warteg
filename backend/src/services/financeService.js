const { prisma } = require('../utils/database');

const getCustomerDebts = async (filters = {}, pagination = {}) => {
  return await prisma.customerDebt.findMany({
    where: filters,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      transaction: {
        select: {
          id: true,
          totalAmount: true,
          createdAt: true
        }
      },
      paymentRecords: {
        select: {
          id: true,
          amount: true,
          paymentMethod: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: [
      { isSettled: 'asc' },
      { createdAt: 'desc' }
    ],
    ...pagination
  });
};

const getCustomerDebtsCount = async (filters = {}) => {
  return await prisma.customerDebt.count({
    where: filters
  });
};

const getDebtSummary = async () => {
  const [totalDebts, settledDebts, pendingDebts] = await Promise.all([
    prisma.customerDebt.aggregate({
      _sum: {
        totalDebt: true,
        remainingDebt: true
      },
      _count: {
        id: true
      }
    }),
    prisma.customerDebt.aggregate({
      where: { isSettled: true },
      _sum: {
        totalDebt: true
      },
      _count: {
        id: true
      }
    }),
    prisma.customerDebt.aggregate({
      where: { isSettled: false },
      _sum: {
        remainingDebt: true
      },
      _count: {
        id: true
      }
    })
  ]);

  return {
    total: {
      amount: totalDebts._sum.totalDebt || 0,
      remaining: totalDebts._sum.remainingDebt || 0,
      count: totalDebts._count.id
    },
    settled: {
      amount: settledDebts._sum.totalDebt || 0,
      count: settledDebts._count.id
    },
    pending: {
      amount: pendingDebts._sum.remainingDebt || 0,
      count: pendingDebts._count.id
    }
  };
};

const getPaymentRecords = async (filters = {}, pagination = {}) => {
  return await prisma.paymentRecord.findMany({
    where: filters,
    include: {
      customerDebt: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      transaction: {
        select: {
          id: true,
          totalAmount: true
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    ...pagination
  });
};

const getPaymentRecordsCount = async (filters = {}) => {
  return await prisma.paymentRecord.count({
    where: filters
  });
};

const getCashFlow = async (dateRange) => {
  const { start, end } = dateRange;

  // Daily cash flow for the specified period
  const dailyCashFlow = await prisma.transaction.groupBy({
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

  // Payment method breakdown
  const paymentBreakdown = await prisma.transaction.groupBy({
    by: ['paymentMethod'],
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
    }
  });

  // Total summary
  const totalSummary = await prisma.transaction.aggregate({
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
    }
  });

  // Debt collections in the period
  const debtCollections = await prisma.paymentRecord.aggregate({
    where: {
      createdAt: {
        gte: start,
        lte: end
      }
    },
    _sum: {
      amount: true
    },
    _count: {
      id: true
    }
  });

  return {
    period: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    },
    summary: {
      totalSales: totalSummary._sum.totalAmount || 0,
      totalReceived: totalSummary._sum.paidAmount || 0,
      totalTransactions: totalSummary._count.id,
      debtCollections: debtCollections._sum.amount || 0,
      debtCollectionCount: debtCollections._count.id
    },
    dailyCashFlow: dailyCashFlow.map(day => ({
      date: day.createdAt.toISOString().split('T')[0],
      totalSales: day._sum.totalAmount || 0,
      totalReceived: day._sum.paidAmount || 0,
      transactionCount: day._count.id
    })),
    paymentBreakdown: paymentBreakdown.map(payment => ({
      method: payment.paymentMethod,
      totalAmount: payment._sum.totalAmount || 0,
      paidAmount: payment._sum.paidAmount || 0,
      count: payment._count.id
    }))
  };
};

module.exports = {
  getCustomerDebts,
  getCustomerDebtsCount,
  getDebtSummary,
  getPaymentRecords,
  getPaymentRecordsCount,
  getCashFlow
};
