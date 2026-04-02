const dashboardService = require('../services/dashboard.service');

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getByCategory = async (req, res, next) => {
  try {
    const data = await dashboardService.getByCategory();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getRecent = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecent();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecent };