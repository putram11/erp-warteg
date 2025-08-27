const express = require('express');
const { body, query } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// Validation rules
const transactionValidation = [
  body('customerId').isString().notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.menuId').isString().notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('paymentMethod').isIn(['CASH', 'TRANSFER', 'DEBT']),
  body('notes').optional().trim()
];

const paymentValidation = [
  body('amount').isDecimal({ decimal_digits: '0,2' }).custom(value => value > 0),
  body('paymentMethod').optional().isIn(['CASH', 'TRANSFER']),
  body('notes').optional().trim()
];

// All routes require authentication
router.use(authenticate);

// Get transactions with filters
router.get('/', [
  query('status').optional().isIn(['PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED']),
  query('customerId').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, transactionController.getTransactions);

// Get single transaction
router.get('/:id', transactionController.getTransactionById);

// Create new transaction
router.post('/', transactionValidation, handleValidationErrors, transactionController.createTransaction);

// Update transaction status (OWNER/EMPLOYEE only)
router.patch('/:id/status', authorize('OWNER', 'EMPLOYEE'), [
  body('status').isIn(['PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED'])
], handleValidationErrors, transactionController.updateTransactionStatus);

// Add payment to transaction
router.post('/:id/payments', paymentValidation, handleValidationErrors, transactionController.addPayment);

// Get transaction payments
router.get('/:id/payments', transactionController.getTransactionPayments);

// Cancel transaction (OWNER/EMPLOYEE only)
router.delete('/:id', authorize('OWNER', 'EMPLOYEE'), transactionController.cancelTransaction);

module.exports = router;
