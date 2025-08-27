const customerService = require('../services/customerService');
const { asyncHandler, paginate } = require('../utils/helpers');

const getCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  
  const filters = { role: 'CUSTOMER' };
  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [customers, total] = await Promise.all([
    customerService.getCustomers(filters, pagination),
    customerService.getCustomersCount(filters)
  ]);

  res.json({
    customers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Customers can only see their own data
  if (req.user.role === 'CUSTOMER' && req.user.id !== id) {
    return res.status(403).json({ error: 'Access forbidden' });
  }
  
  const customer = await customerService.getCustomerById(id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  res.json({ customer });
});

const getCustomerTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  // Customers can only see their own transactions
  if (req.user.role === 'CUSTOMER' && req.user.id !== id) {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [transactions, total] = await Promise.all([
    customerService.getCustomerTransactions(id, pagination),
    customerService.getCustomerTransactionsCount(id)
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

const getCustomerDebts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Customers can only see their own debts
  if (req.user.role === 'CUSTOMER' && req.user.id !== id) {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  const debts = await customerService.getCustomerDebts(id);

  res.json({ debts });
});

module.exports = {
  getCustomers,
  getCustomerById,
  getCustomerTransactions,
  getCustomerDebts
};
