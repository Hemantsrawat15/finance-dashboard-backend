const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: mongoose.Types.Decimal128,
            required: [true, 'Amount is required'],
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Type is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            maxlength: 50,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        description: {
            type: String,
            maxlength: 500,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

financialRecordSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.amount && ret.amount.toString) {
            ret.amount = parseFloat(ret.amount.toString());
        }
        return ret;
    }
});

financialRecordSchema.pre('find', function () {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
});

financialRecordSchema.pre('findOne', function () {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
});

financialRecordSchema.pre('findOneAndUpdate', function () {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
});

financialRecordSchema.pre('countDocuments', function () {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: false });
  }
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);