const recordService = require('../services/record.service');

const getAll = async (req, res, next) => {
  try {
    const result = await recordService.getAll(req.query);
    res.status(200).json({
      success: true,
      data: result.records,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const record = await recordService.getOne(req.params.id);
    res.status(200).json({ success: true, data: record });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const record = await recordService.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, data: record, message: 'Record created successfully' });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const record = await recordService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: record, message: 'Record updated successfully' });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const result = await recordService.softDelete(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };