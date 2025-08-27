const financeService = require('../services/financeService');
const { asyncHandler, paginate } = require('../utils/helpers');

const getCustomerDebts = asyncHandler(async (req, res) => {
  const { customerId, settled, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (settled !== undefined) filters.isSettled = settled === 'true';
  
  // Customers can only see their own debts
  if (req.user.role === 'CUSTOMER') {
    filters.customerId = req.user.id;
  } else if (customerId) {
    filters.customerId = customerId;
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [debts, total] = await Promise.all([
    financeService.getCustomerDebts(filters, pagination),
    financeService.getCustomerDebtsCount(filters)
  ]);

  res.json({
    debts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getDebtSummary = asyncHandler(async (req, res) => {
  const summary = await financeService.getDebtSummary();
  
  res.json({ summary });
});

const getPaymentRecords = asyncHandler(async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.gte = new Date(startDate);
    if (endDate) filters.createdAt.lte = new Date(endDate);
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [payments, total] = await Promise.all([
    financeService.getPaymentRecords(filters, pagination),
    financeService.getPaymentRecordsCount(filters)
  ]);

  res.json({
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getCashFlow = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateRange = {
    start: startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: endDate ? new Date(endDate) : new Date()
  };

  const cashFlow = await financeService.getCashFlow(dateRange);
  
  res.json({ cashFlow });
});

module.exports = {
  getCustomerDebts,
  getDebtSummary,
  getPaymentRecords,
  getCashFlow
};
