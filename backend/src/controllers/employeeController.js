const employeeService = require('../services/employeeService');
const { asyncHandler, paginate } = require('../utils/helpers');

const getEmployees = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  
  const filters = { 
    role: { in: ['OWNER', 'EMPLOYEE'] }
  };
  
  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [employees, total] = await Promise.all([
    employeeService.getEmployees(filters, pagination),
    employeeService.getEmployeesCount(filters)
  ]);

  res.json({
    employees,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const employee = await employeeService.getEmployeeById(id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  res.json({ employee });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const employee = await employeeService.updateEmployee(id, updateData);
  
  res.json({
    message: 'Employee updated successfully',
    employee
  });
});

const deactivateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const employee = await employeeService.deactivateEmployee(id);
  
  res.json({
    message: 'Employee deactivated successfully',
    employee
  });
});

const activateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const employee = await employeeService.activateEmployee(id);
  
  res.json({
    message: 'Employee activated successfully',
    employee
  });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee,
  activateEmployee
};
