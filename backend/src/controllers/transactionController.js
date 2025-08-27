const transactionService = require('../services/transactionService');
const { asyncHandler, paginate } = require('../utils/helpers');

const getTransactions = asyncHandler(async (req, res) => {
  const { 
    status, 
    customerId, 
    startDate, 
    endDate, 
    page = 1, 
    limit = 10 
  } = req.query;
  
  const filters = {};
  if (status) filters.status = status;
  if (customerId) filters.customerId = customerId;
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.gte = new Date(startDate);
    if (endDate) filters.createdAt.lte = new Date(endDate);
  }

  // Customers can only see their own transactions
  if (req.user.role === 'CUSTOMER') {
    filters.customerId = req.user.id;
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [transactions, total] = await Promise.all([
    transactionService.getTransactions(filters, pagination),
    transactionService.getTransactionsCount(filters)
  ]);

  res.json({
    transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const transaction = await transactionService.getTransactionById(id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  // Customers can only see their own transactions
  if (req.user.role === 'CUSTOMER' && transaction.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  res.json({ transaction });
});

const createTransaction = asyncHandler(async (req, res) => {
  const { customerId, items, paymentMethod, notes } = req.body;
  
  // Customers can only create transactions for themselves
  if (req.user.role === 'CUSTOMER' && customerId !== req.user.id) {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  const transaction = await transactionService.createTransaction({
    customerId,
    employeeId: req.user.role !== 'CUSTOMER' ? req.user.id : null,
    items,
    paymentMethod,
    notes
  });
  
  res.status(201).json({
    message: 'Transaction created successfully',
    transaction
  });
});

const updateTransactionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const transaction = await transactionService.updateTransactionStatus(id, status);
  
  res.json({
    message: 'Transaction status updated successfully',
    transaction
  });
});

const addPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod = 'CASH', notes } = req.body;
  
  const result = await transactionService.addPayment(id, {
    amount: parseFloat(amount),
    paymentMethod,
    notes,
    userId: req.user.id
  });
  
  res.json({
    message: 'Payment added successfully',
    transaction: result.transaction,
    paymentRecord: result.paymentRecord
  });
});

const getTransactionPayments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const payments = await transactionService.getTransactionPayments(id);
  
  res.json({ payments });
});

const cancelTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const transaction = await transactionService.cancelTransaction(id);
  
  res.json({
    message: 'Transaction cancelled successfully',
    transaction
  });
});

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  addPayment,
  getTransactionPayments,
  cancelTransaction
};
