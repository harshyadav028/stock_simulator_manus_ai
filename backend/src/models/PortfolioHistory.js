const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  portfolioValue: {
    type: Number,
    required: true
  },
  cashBalance: {
    type: Number,
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  stocks: [
    {
      symbol: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('PortfolioHistory', PortfolioHistorySchema);
