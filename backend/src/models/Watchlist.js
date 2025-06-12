const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchlistSchema = new Schema({
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
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  name: {
    type: String,
    default: 'Default Watchlist'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
