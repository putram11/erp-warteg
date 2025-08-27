const express = require('express');
const { body, query } = require('express-validator');
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication and OWNER role
router.use(authenticate);
router.use(authorize('OWNER'));

// Get employees
router.get('/', [
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, employeeController.getEmployees);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update employee
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('id-ID'),
  body('address').optional().trim(),
  body('isActive').optional().isBoolean()
], handleValidationErrors, employeeController.updateEmployee);

// Deactivate employee
router.patch('/:id/deactivate', employeeController.deactivateEmployee);

// Activate employee
router.patch('/:id/activate', employeeController.activateEmployee);

module.exports = router;
