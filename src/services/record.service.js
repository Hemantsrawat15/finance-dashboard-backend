const FinancialRecord = require('../models/FinancialRecord');

const getAll = async ({ type, category, from, to, page = 1, limit = 10 }) => {
  const filter = {};

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;

  const records = await FinancialRecord.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await FinancialRecord.countDocuments({ ...filter, isDeleted: false });

  return { records, total, page: Number(page), limit: Number(limit) };
};

const getOne = async (id) => {
  const record = await FinancialRecord.findById(id);
  if (!record) throw { status: 404, message: 'Record not found' };
  return record;
};

const create = async (data) => {
  const record = await FinancialRecord.create(data);
  return record;
};

const update = async (id, data) => {
  const record = await FinancialRecord.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!record) throw { status: 404, message: 'Record not found' };
  return record;
};

const softDelete = async (id) => {
  const record = await FinancialRecord.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!record) throw { status: 404, message: 'Record not found' };
  return { message: 'Record deleted successfully' };
};

module.exports = { getAll, getOne, create, update, softDelete };