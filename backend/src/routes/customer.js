const express = require('express');
const { query } = require('express-validator');
const customerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get customers (OWNER/EMPLOYEE only)
router.get('/', authorize('OWNER', 'EMPLOYEE'), [
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, customerController.getCustomers);

// Get customer by ID
router.get('/:id', customerController.getCustomerById);

// Get customer transactions
router.get('/:id/transactions', customerController.getCustomerTransactions);

// Get customer debts
router.get('/:id/debts', customerController.getCustomerDebts);

module.exports = router;
