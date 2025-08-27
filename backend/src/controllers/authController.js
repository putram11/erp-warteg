const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const { generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../utils/helpers');

const register = asyncHandler(async (req, res) => {
  const { email, password, name, phone, address, role = 'CUSTOMER' } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authService.createUser({
    email,
    password: hashedPassword,
    name,
    phone,
    address,
    role
  });

  const token = generateToken({ userId: user.id, role: user.role });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ error: 'Account is deactivated' });
  }

  const token = generateToken({ userId: user.id, role: user.role });

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  // For now, just return a message
  // In production, implement proper refresh token mechanism
  res.json({ message: 'Refresh token endpoint - implement as needed' });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  
  const updatedUser = await authService.updateUser(req.user.id, {
    name,
    phone,
    address
  });

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  // For JWT, logout is handled on client side
  // In production, you might want to implement token blacklisting
  res.json({ message: 'Logout successful' });
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  logout
};
