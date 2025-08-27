const { prisma } = require('../utils/database');

const getCustomers = async (filters = {}, pagination = {}) => {
  return await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          transactions: true,
          customerDebts: {
            where: {
              isSettled: false
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' },
    ...pagination
  });
};

const getCustomersCount = async (filters = {}) => {
  return await prisma.user.count({
    where: filters
  });
};

const getCustomerById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          transactions: true,
          customerDebts: {
            where: {
              isSettled: false
            }
          }
        }
      }
    }
  });
};

const getCustomerTransactions = async (customerId, pagination = {}) => {
  return await prisma.transaction.findMany({
    where: { customerId },
    include: {
      transactionItems: {
        include: {
          menu: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      },
      customerDebt: true
    },
    orderBy: { createdAt: 'desc' },
    ...pagination
  });
};

const getCustomerTransactionsCount = async (customerId) => {
  return await prisma.transaction.count({
    where: { customerId }
  });
};

const getCustomerDebts = async (customerId) => {
  return await prisma.customerDebt.findMany({
    where: { 
      customerId,
      isSettled: false
    },
    include: {
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
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const getCustomerStats = async (customerId) => {
  const [totalTransactions, totalSpent, activeDebts] = await Promise.all([
    prisma.transaction.count({
      where: { 
        customerId,
        status: { not: 'CANCELLED' }
      }
    }),
    prisma.transaction.aggregate({
      where: { 
        customerId,
        status: { not: 'CANCELLED' }
      },
      _sum: {
        totalAmount: true
      }
    }),
    prisma.customerDebt.aggregate({
      where: { 
        customerId,
        isSettled: false
      },
      _sum: {
        remainingDebt: true
      }
    })
  ]);

  return {
    totalTransactions,
    totalSpent: totalSpent._sum.totalAmount || 0,
    activeDebts: activeDebts._sum.remainingDebt || 0
  };
};

module.exports = {
  getCustomers,
  getCustomersCount,
  getCustomerById,
  getCustomerTransactions,
  getCustomerTransactionsCount,
  getCustomerDebts,
  getCustomerStats
};
