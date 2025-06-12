const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Watchlist = require('../models/Watchlist');
const axios = require('axios');

// Helper function to get current stock prices
const getCurrentPrices = async (symbols) => {
  try {
    if (symbols.length === 0) return {};
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote`, {
      params: { symbols: symbols.join(',') },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const priceMap = {};
    response.data.quoteResponse.result.forEach(stock => {
      priceMap[stock.symbol] = stock.regularMarketPrice;
    });
    
    return priceMap;
  } catch (error) {
    console.error(`Error fetching stock prices: ${error}`);
    throw new Error('Failed to fetch current stock prices');
  }
};

// @route   GET /api/watchlist
// @desc    Get user's watchlists
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let watchlists = await Watchlist.find({ user: req.user.id });
    
    // If no watchlists exist, create a default one
    if (watchlists.length === 0) {
      const defaultWatchlist = new Watchlist({
        user: req.user.id,
        name: 'Default Watchlist',
        stocks: []
      });
      
      await defaultWatchlist.save();
      watchlists = [defaultWatchlist];
    }
    
    // Get current prices for all stocks in watchlists
    const allSymbols = [];
    watchlists.forEach(watchlist => {
      watchlist.stocks.forEach(stock => {
        if (!allSymbols.includes(stock.symbol)) {
          allSymbols.push(stock.symbol);
        }
      });
    });
    
    if (allSymbols.length > 0) {
      const priceMap = await getCurrentPrices(allSymbols);
      
      // Add current prices to watchlist stocks
      watchlists = watchlists.map(watchlist => {
        const watchlistObj = watchlist.toObject();
        watchlistObj.stocks = watchlistObj.stocks.map(stock => {
          return {
            ...stock,
            currentPrice: priceMap[stock.symbol] || null
          };
        });
        return watchlistObj;
      });
    }
    
    res.json(watchlists);
  } catch (error) {
    console.error(`Get watchlists error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/watchlist
// @desc    Create a new watchlist
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Watchlist name is required' });
    }
    
    const newWatchlist = new Watchlist({
      user: req.user.id,
      name,
      stocks: []
    });
    
    await newWatchlist.save();
    
    res.status(201).json(newWatchlist);
  } catch (error) {
    console.error(`Create watchlist error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/watchlist/:id
// @desc    Update a watchlist
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Watchlist name is required' });
    }
    
    let watchlist = await Watchlist.findById(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Check if watchlist belongs to user
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    watchlist.name = name;
    await watchlist.save();
    
    res.json(watchlist);
  } catch (error) {
    console.error(`Update watchlist error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/watchlist/:id
// @desc    Delete a watchlist
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Check if watchlist belongs to user
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await watchlist.remove();
    
    res.json({ message: 'Watchlist removed' });
  } catch (error) {
    console.error(`Delete watchlist error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/watchlist/:id/stock
// @desc    Add stock to watchlist
// @access  Private
router.post('/:id/stock', protect, async (req, res) => {
  try {
    const { symbol, companyName } = req.body;
    
    if (!symbol || !companyName) {
      return res.status(400).json({ message: 'Symbol and company name are required' });
    }
    
    const watchlist = await Watchlist.findById(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Check if watchlist belongs to user
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if stock already exists in watchlist
    const stockExists = watchlist.stocks.some(stock => stock.symbol === symbol);
    
    if (stockExists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    
    watchlist.stocks.push({
      symbol,
      companyName,
      addedAt: Date.now()
    });
    
    await watchlist.save();
    
    res.json(watchlist);
  } catch (error) {
    console.error(`Add stock to watchlist error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/watchlist/:id/stock/:symbol
// @desc    Remove stock from watchlist
// @access  Private
router.delete('/:id/stock/:symbol', protect, async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.id);
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    // Check if watchlist belongs to user
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Find stock index
    const stockIndex = watchlist.stocks.findIndex(stock => stock.symbol === req.params.symbol);
    
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in watchlist' });
    }
    
    // Remove stock
    watchlist.stocks.splice(stockIndex, 1);
    await watchlist.save();
    
    res.json(watchlist);
  } catch (error) {
    console.error(`Remove stock from watchlist error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
