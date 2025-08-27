const { prisma } = require('../utils/database');

const getMenus = async (filters = {}, pagination = {}) => {
  return await prisma.menu.findMany({
    where: filters,
    orderBy: [
      { isAvailable: 'desc' },
      { name: 'asc' }
    ],
    ...pagination
  });
};

const getMenusCount = async (filters = {}) => {
  return await prisma.menu.count({
    where: filters
  });
};

const getMenuById = async (id) => {
  return await prisma.menu.findUnique({
    where: { id },
    include: {
      stockHistories: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

const createMenu = async (menuData) => {
  const { stock = 0, ...data } = menuData;
  
  return await prisma.$transaction(async (prisma) => {
    const menu = await prisma.menu.create({
      data: {
        ...data,
        stock
      }
    });

    // Create initial stock history if stock > 0
    if (stock > 0) {
      await prisma.stockHistory.create({
        data: {
          menuId: menu.id,
          quantity: stock,
          type: 'RESTOCK',
          description: 'Initial stock'
        }
      });
    }

    return menu;
  });
};

const updateMenu = async (id, updateData) => {
  return await prisma.menu.update({
    where: { id },
    data: updateData
  });
};

const deleteMenu = async (id) => {
  return await prisma.menu.delete({
    where: { id }
  });
};

const updateStock = async (menuId, { quantity, type, description }) => {
  return await prisma.$transaction(async (prisma) => {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId }
    });

    if (!menu) {
      throw new Error('Menu not found');
    }

    let newStock = menu.stock;
    
    if (type === 'RESTOCK') {
      newStock += quantity;
    } else if (type === 'SALE') {
      newStock -= quantity;
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }
    } else if (type === 'ADJUSTMENT') {
      newStock = quantity; // Set absolute value
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: { stock: newStock }
    });

    const stockHistory = await prisma.stockHistory.create({
      data: {
        menuId,
        quantity: type === 'ADJUSTMENT' ? quantity - menu.stock : quantity,
        type,
        description
      }
    });

    return { menu: updatedMenu, stockHistory };
  });
};

const getStockHistory = async (menuId, pagination = {}) => {
  return await prisma.stockHistory.findMany({
    where: { menuId },
    orderBy: { createdAt: 'desc' },
    include: {
      menu: {
        select: { name: true }
      }
    },
    ...pagination
  });
};

const getStockHistoryCount = async (menuId) => {
  return await prisma.stockHistory.count({
    where: { menuId }
  });
};

const getPopularMenus = async (limit = 5, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await prisma.menu.findMany({
    include: {
      transactionItems: {
        where: {
          transaction: {
            createdAt: {
              gte: startDate
            }
          }
        }
      },
      _count: {
        select: {
          transactionItems: {
            where: {
              transaction: {
                createdAt: {
                  gte: startDate
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      transactionItems: {
        _count: 'desc'
      }
    },
    take: limit
  });
};

module.exports = {
  getMenus,
  getMenusCount,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  updateStock,
  getStockHistory,
  getStockHistoryCount,
  getPopularMenus
};
