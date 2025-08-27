const express = require('express');
const { query } = require('express-validator');
const financeController = require('../controllers/financeController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get customer debts (accessible by customer for their own debts)
router.get('/debts', [
  query('customerId').optional().isString(),
  query('settled').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, financeController.getCustomerDebts);

// Get debt summary (OWNER/EMPLOYEE only)
router.get('/debts/summary', authorize('OWNER', 'EMPLOYEE'), financeController.getDebtSummary);

// Get payment records (OWNER/EMPLOYEE only)
router.get('/payments', authorize('OWNER', 'EMPLOYEE'), [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, financeController.getPaymentRecords);

// Get cash flow report (OWNER/EMPLOYEE only)
router.get('/cash-flow', authorize('OWNER', 'EMPLOYEE'), [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], handleValidationErrors, financeController.getCashFlow);

module.exports = router;
