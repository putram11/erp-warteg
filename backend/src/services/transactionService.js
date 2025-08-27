const { prisma } = require('../utils/database');
const menuService = require('./menuService');

const getTransactions = async (filters = {}, pagination = {}) => {
  return await prisma.transaction.findMany({
    where: filters,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
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
      customerDebt: true,
      _count: {
        select: {
          paymentRecords: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    ...pagination
  });
};

const getTransactionsCount = async (filters = {}) => {
  return await prisma.transaction.count({
    where: filters
  });
};

const getTransactionById = async (id) => {
  return await prisma.transaction.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      transactionItems: {
        include: {
          menu: true
        }
      },
      customerDebt: true,
      paymentRecords: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

const createTransaction = async (transactionData) => {
  const { customerId, employeeId, items, paymentMethod, notes } = transactionData;

  return await prisma.$transaction(async (prisma) => {
    // Validate menus and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const menu = await prisma.menu.findUnique({
        where: { id: item.menuId }
      });

      if (!menu) {
        throw new Error(`Menu with ID ${item.menuId} not found`);
      }

      if (!menu.isAvailable) {
        throw new Error(`Menu ${menu.name} is not available`);
      }

      if (menu.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${menu.name}. Available: ${menu.stock}, Requested: ${item.quantity}`);
      }

      const subtotal = menu.price * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        menuId: item.menuId,
        quantity: item.quantity,
        price: menu.price,
        subtotal
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        customerId,
        employeeId,
        totalAmount,
        paidAmount: paymentMethod === 'CASH' ? totalAmount : 0,
        status: paymentMethod === 'CASH' ? 'COMPLETED' : paymentMethod === 'DEBT' ? 'PENDING' : 'COMPLETED',
        paymentMethod,
        notes,
        transactionItems: {
          create: validatedItems
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        transactionItems: {
          include: {
            menu: true
          }
        }
      }
    });

    // Update stock for each item
    for (const item of validatedItems) {
      await menuService.updateStock(item.menuId, {
        quantity: item.quantity,
        type: 'SALE',
        description: `Sale from transaction ${transaction.id}`
      });
    }

    // Create debt record if payment method is DEBT
    if (paymentMethod === 'DEBT') {
      await prisma.customerDebt.create({
        data: {
          customerId,
          transactionId: transaction.id,
          totalDebt: totalAmount,
          remainingDebt: totalAmount
        }
      });
    }

    return transaction;
  });
};

const updateTransactionStatus = async (id, status) => {
  return await prisma.transaction.update({
    where: { id },
    data: { status },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      transactionItems: {
        include: {
          menu: true
        }
      }
    }
  });
};

const addPayment = async (transactionId, paymentData) => {
  const { amount, paymentMethod, notes, userId } = paymentData;

  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { customerDebt: true }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'COMPLETED') {
      throw new Error('Transaction is already completed');
    }

    const newPaidAmount = parseFloat(transaction.paidAmount) + amount;
    const totalAmount = parseFloat(transaction.totalAmount);

    let newStatus = transaction.status;
    if (newPaidAmount >= totalAmount) {
      newStatus = 'COMPLETED';
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIAL';
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus
      }
    });

    // Create payment record
    const paymentRecord = await prisma.paymentRecord.create({
      data: {
        customerDebtId: transaction.customerDebt?.id,
        transactionId,
        userId,
        amount,
        paymentMethod,
        notes
      }
    });

    // Update customer debt if exists
    if (transaction.customerDebt) {
      const remainingDebt = Math.max(0, parseFloat(transaction.customerDebt.remainingDebt) - amount);
      
      await prisma.customerDebt.update({
        where: { id: transaction.customerDebt.id },
        data: {
          remainingDebt,
          isSettled: remainingDebt === 0
        }
      });
    }

    return { transaction: updatedTransaction, paymentRecord };
  });
};

const getTransactionPayments = async (transactionId) => {
  return await prisma.paymentRecord.findMany({
    where: { transactionId },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const cancelTransaction = async (id) => {
  return await prisma.$transaction(async (prisma) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionItems: true,
        customerDebt: true
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'COMPLETED') {
      throw new Error('Cannot cancel completed transaction');
    }

    // Restore stock for each item
    for (const item of transaction.transactionItems) {
      await menuService.updateStock(item.menuId, {
        quantity: item.quantity,
        type: 'RESTOCK',
        description: `Refund from cancelled transaction ${id}`
      });
    }

    // Delete customer debt if exists
    if (transaction.customerDebt) {
      await prisma.customerDebt.delete({
        where: { id: transaction.customerDebt.id }
      });
    }

    // Update transaction status
    return await prisma.transaction.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  });
};

const getDailyTransactionSummary = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.transaction.aggregate({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        not: 'CANCELLED'
      }
    },
    _sum: {
      totalAmount: true,
      paidAmount: true
    },
    _count: {
      id: true
    }
  });
};

module.exports = {
  getTransactions,
  getTransactionsCount,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  addPayment,
  getTransactionPayments,
  cancelTransaction,
  getDailyTransactionSummary
};
