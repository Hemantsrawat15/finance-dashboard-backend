const FinancialRecord = require('../models/FinancialRecord');

const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, { $toDouble: '$amount' }, 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, { $toDouble: '$amount' }, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
      },
    },
  ]);

  return result[0] || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
};

const getByCategory = async () => {
  return await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: { $toDouble: '$amount' } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        type: '$_id.type',
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const getMonthlyTrends = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  return await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$date' } },
          type: '$type',
        },
        total: { $sum: { $toDouble: '$amount' } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        type: '$_id.type',
        total: 1,
        count: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);
};

const getRecent = async () => {
  return await FinancialRecord.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'name email');
};

module.exports = { getSummary, getByCategory, getMonthlyTrends, getRecent };