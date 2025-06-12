const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
      averageBuyPrice: {
        type: Number,
        required: true
      },
      currentPrice: {
        type: Number
      },
      totalValue: {
        type: Number
      },
      profitLoss: {
        type: Number
      },
      profitLossPercentage: {
        type: Number
      }
    }
  ],
  totalValue: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
