const reportService = require('../services/reportService');
const { asyncHandler } = require('../utils/helpers');

const getDailySalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const dateRange = {
    start: startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30)),
    end: endDate ? new Date(endDate) : new Date()
  };

  const report = await reportService.getDailySalesReport(dateRange);
  
  res.json({ report });
});

const getMonthlySalesReport = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  
  const currentDate = new Date();
  const targetYear = year ? parseInt(year) : currentDate.getFullYear();
  const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;

  const report = await reportService.getMonthlySalesReport(targetYear, targetMonth);
  
  res.json({ report });
});

const getPopularMenusReport = asyncHandler(async (req, res) => {
  const { days = 30, limit = 10 } = req.query;
  
  const report = await reportService.getPopularMenusReport(parseInt(days), parseInt(limit));
  
  res.json({ report });
});

const getStockAlertsReport = asyncHandler(async (req, res) => {
  const lowStockThreshold = 5; // You can make this configurable
  
  const report = await reportService.getStockAlertsReport(lowStockThreshold);
  
  res.json({ report });
});

const getDashboardData = asyncHandler(async (req, res) => {
  const dashboard = await reportService.getDashboardData();
  
  res.json({ dashboard });
});

module.exports = {
  getDailySalesReport,
  getMonthlySalesReport,
  getPopularMenusReport,
  getStockAlertsReport,
  getDashboardData
};
