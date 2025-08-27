const menuService = require('../services/menuService');
const { asyncHandler, paginate } = require('../utils/helpers');

const getMenus = asyncHandler(async (req, res) => {
  const { category, available, page = 1, limit = 10, search } = req.query;
  
  const filters = {};
  if (category) filters.category = category;
  if (available !== undefined) filters.isAvailable = available === 'true';
  if (search) {
    filters.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [menus, total] = await Promise.all([
    menuService.getMenus(filters, pagination),
    menuService.getMenusCount(filters)
  ]);

  res.json({
    menus,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getMenuById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const menu = await menuService.getMenuById(id);
  if (!menu) {
    return res.status(404).json({ error: 'Menu not found' });
  }

  res.json({ menu });
});

const createMenu = asyncHandler(async (req, res) => {
  const menuData = req.body;
  
  const menu = await menuService.createMenu(menuData);
  
  res.status(201).json({
    message: 'Menu created successfully',
    menu
  });
});

const updateMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const menu = await menuService.updateMenu(id, updateData);
  
  res.json({
    message: 'Menu updated successfully',
    menu
  });
});

const deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await menuService.deleteMenu(id);
  
  res.json({ message: 'Menu deleted successfully' });
});

const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, type, description } = req.body;
  
  const result = await menuService.updateStock(id, {
    quantity,
    type,
    description
  });
  
  res.json({
    message: 'Stock updated successfully',
    menu: result.menu,
    stockHistory: result.stockHistory
  });
});

const getStockHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  const pagination = paginate(parseInt(page), parseInt(limit));
  
  const [history, total] = await Promise.all([
    menuService.getStockHistory(id, pagination),
    menuService.getStockHistoryCount(id)
  ]);
  
  res.json({
    history,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

module.exports = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  updateStock,
  getStockHistory
};
