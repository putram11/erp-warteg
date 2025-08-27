const express = require('express');
const { body, query } = require('express-validator');
const menuController = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// Validation rules
const menuValidation = [
  body('name').trim().isLength({ min: 2 }),
  body('category').isIn(['NASI', 'LAUK', 'SAMBAL', 'SAYUR', 'MINUMAN']),
  body('price').isDecimal({ decimal_digits: '0,2' }).custom(value => value > 0),
  body('description').optional().trim(),
  body('stock').optional().isInt({ min: 0 }),
  body('imageUrl').optional().isURL()
];

const stockValidation = [
  body('quantity').isInt(),
  body('type').isIn(['RESTOCK', 'SALE', 'ADJUSTMENT']),
  body('description').optional().trim()
];

// Public routes
router.get('/', [
  query('category').optional().isIn(['NASI', 'LAUK', 'SAMBAL', 'SAYUR', 'MINUMAN']),
  query('available').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, menuController.getMenus);

router.get('/:id', menuController.getMenuById);

// Protected routes (require authentication)
router.use(authenticate);

// Routes for OWNER and EMPLOYEE
router.post('/', authorize('OWNER', 'EMPLOYEE'), menuValidation, handleValidationErrors, menuController.createMenu);
router.put('/:id', authorize('OWNER', 'EMPLOYEE'), menuValidation, handleValidationErrors, menuController.updateMenu);
router.delete('/:id', authorize('OWNER', 'EMPLOYEE'), menuController.deleteMenu);

// Stock management
router.post('/:id/stock', authorize('OWNER', 'EMPLOYEE'), stockValidation, handleValidationErrors, menuController.updateStock);
router.get('/:id/stock-history', authorize('OWNER', 'EMPLOYEE'), menuController.getStockHistory);

module.exports = router;
