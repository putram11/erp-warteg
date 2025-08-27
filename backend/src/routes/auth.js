const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// Register validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  body('role').optional().isIn(['OWNER', 'EMPLOYEE', 'CUSTOMER'])
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('id-ID'),
  body('address').optional().trim()
], handleValidationErrors, authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
