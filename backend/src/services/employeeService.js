const { prisma } = require('../utils/database');

const getEmployees = async (filters = {}, pagination = {}) => {
  return await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true
    },
    orderBy: [
      { isActive: 'desc' },
      { name: 'asc' }
    ],
    ...pagination
  });
};

const getEmployeesCount = async (filters = {}) => {
  return await prisma.user.count({
    where: filters
  });
};

const getEmployeeById = async (id) => {
  return await prisma.user.findUnique({
    where: { 
      id,
      role: { in: ['OWNER', 'EMPLOYEE'] }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

const updateEmployee = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  });
};

const deactivateEmployee = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  });
};

const activateEmployee = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: { isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true
    }
  });
};

module.exports = {
  getEmployees,
  getEmployeesCount,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  activateEmployee
};
