const { prisma } = require('../utils/database');

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const updateUser = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  });
};

const deactivateUser = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { isActive: false }
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deactivateUser
};
