const express = require('express');
const { query } = require('express-validator');
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication and OWNER/EMPLOYEE role
router.use(authenticate);
router.use(authorize('OWNER', 'EMPLOYEE'));

// Sales reports
router.get('/sales/daily', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], handleValidationErrors, reportController.getDailySalesReport);

router.get('/sales/monthly', [
  query('year').optional().isInt({ min: 2020, max: 2030 }),
  query('month').optional().isInt({ min: 1, max: 12 })
], handleValidationErrors, reportController.getMonthlySalesReport);

// Menu reports
router.get('/menu/popular', [
  query('days').optional().isInt({ min: 1, max: 365 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], handleValidationErrors, reportController.getPopularMenusReport);

router.get('/menu/stock-alerts', reportController.getStockAlertsReport);

// Dashboard data
router.get('/dashboard', reportController.getDashboardData);

module.exports = router;
