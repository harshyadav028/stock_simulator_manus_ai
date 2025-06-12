const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const axios = require('axios');

// Helper function to get current stock price
const getCurrentPrice = async (symbol) => {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote`, {
      params: { symbols: symbol },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.data.quoteResponse.result.length === 0) {
      throw new Error('Stock not found');
    }
    
    return response.data.quoteResponse.result[0].regularMarketPrice;
  } catch (error) {
    console.error(`Error fetching stock price: ${error}`);
    throw new Error('Failed to fetch current stock price');
  }
};

// @route   POST /api/transactions
// @desc    Create a new transaction (buy/sell)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, symbol, companyName, quantity, orderType, limitPrice } = req.body;
    
    if (!type || !symbol || !companyName || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get current price
    const currentPrice = await getCurrentPrice(symbol);
    
    // For limit orders, check if price conditions are met
    if (orderType === 'LIMIT') {
      if (!limitPrice) {
        return res.status(400).json({ message: 'Limit price is required for limit orders' });
      }
      
      if (type === 'BUY' && currentPrice > limitPrice) {
        return res.status(400).json({ 
          message: `Current price (${currentPrice}) is higher than limit price (${limitPrice})` 
        });
      }
      
      if (type === 'SELL' && currentPrice < limitPrice) {
        return res.status(400).json({ 
          message: `Current price (${currentPrice}) is lower than limit price (${limitPrice})` 
        });
      }
    }
    
    // Calculate total amount
    const price = currentPrice;
    const totalAmount = price * quantity;
    
    // Check if user has enough balance for buying
    if (type === 'BUY' && user.currentBalance < totalAmount) {
      return res.status(400).json({ 
        message: `Insufficient funds. Required: $${totalAmount.toFixed(2)}, Available: $${user.currentBalance.toFixed(2)}` 
      });
    }
    
    // Get user's portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    // If portfolio doesn't exist, create one
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        stocks: [],
        totalValue: 0
      });
    }
    
    // Find stock in portfolio
    const stockIndex = portfolio.stocks.findIndex(stock => stock.symbol === symbol);
    
    if (type === 'BUY') {
      // Update user balance
      user.currentBalance -= totalAmount;
      
      // Update portfolio
      if (stockIndex === -1) {
        // Add new stock to portfolio
        portfolio.stocks.push({
          symbol,
          companyName,
          quantity,
          averageBuyPrice: price,
          currentPrice: price,
          totalValue: totalAmount,
          profitLoss: 0,
          profitLossPercentage: 0
        });
      } else {
        // Update existing stock
        const stock = portfolio.stocks[stockIndex];
        const newTotalShares = stock.quantity + quantity;
        const newTotalCost = (stock.averageBuyPrice * stock.quantity) + (price * quantity);
        const newAveragePrice = newTotalCost / newTotalShares;
        
        stock.quantity = newTotalShares;
        stock.averageBuyPrice = newAveragePrice;
        stock.currentPrice = price;
        stock.totalValue = newTotalShares * price;
        stock.profitLoss = stock.totalValue - (newAveragePrice * newTotalShares);
        stock.profitLossPercentage = (stock.profitLoss / (newAveragePrice * newTotalShares)) * 100;
      }
    } else if (type === 'SELL') {
      // Check if user has the stock and enough shares
      if (stockIndex === -1) {
        return res.status(400).json({ message: `You don't own any shares of ${symbol}` });
      }
      
      const stock = portfolio.stocks[stockIndex];
      
      if (stock.quantity < quantity) {
        return res.status(400).json({ 
          message: `Insufficient shares. Required: ${quantity}, Available: ${stock.quantity}` 
        });
      }
      
      // Update user balance
      user.currentBalance += totalAmount;
      
      // Update portfolio
      if (stock.quantity === quantity) {
        // Remove stock from portfolio if selling all shares
        portfolio.stocks.splice(stockIndex, 1);
      } else {
        // Update existing stock
        stock.quantity -= quantity;
        stock.currentPrice = price;
        stock.totalValue = stock.quantity * price;
        stock.profitLoss = stock.totalValue - (stock.averageBuyPrice * stock.quantity);
        stock.profitLossPercentage = (stock.profitLoss / (stock.averageBuyPrice * stock.quantity)) * 100;
      }
    }
    
    // Calculate total portfolio value
    portfolio.totalValue = portfolio.stocks.reduce((total, stock) => total + stock.totalValue, 0);
    portfolio.lastUpdated = Date.now();
    
    // Create transaction
    const transaction = new Transaction({
      user: req.user.id,
      type,
      symbol,
      companyName,
      quantity,
      price,
      totalAmount,
      orderType: orderType || 'MARKET',
      status: 'COMPLETED'
    });
    
    // Save all changes
    await transaction.save();
    await portfolio.save();
    await user.save();
    
    res.status(201).json({
      transaction,
      portfolio,
      currentBalance: user.currentBalance
    });
  } catch (error) {
    console.error(`Transaction error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(`Get transactions error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get specific transaction details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(`Get transaction error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
