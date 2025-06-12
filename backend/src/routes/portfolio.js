const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Portfolio = require('../models/Portfolio');
const PortfolioHistory = require('../models/PortfolioHistory');
const User = require('../models/User');
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

// @route   GET /api/portfolio
// @desc    Get user's portfolio
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    // If portfolio doesn't exist, create one
    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        stocks: [],
        totalValue: 0
      });
      await portfolio.save();
    }
    
    // Get current prices for all stocks in portfolio
    if (portfolio.stocks.length > 0) {
      const symbols = portfolio.stocks.map(stock => stock.symbol);
      const priceMap = await getCurrentPrices(symbols);
      
      // Update portfolio with current prices
      let totalValue = 0;
      portfolio.stocks.forEach(stock => {
        if (priceMap[stock.symbol]) {
          stock.currentPrice = priceMap[stock.symbol];
          stock.totalValue = stock.quantity * stock.currentPrice;
          stock.profitLoss = stock.totalValue - (stock.averageBuyPrice * stock.quantity);
          stock.profitLossPercentage = (stock.profitLoss / (stock.averageBuyPrice * stock.quantity)) * 100;
          totalValue += stock.totalValue;
        }
      });
      
      portfolio.totalValue = totalValue;
      portfolio.lastUpdated = Date.now();
      await portfolio.save();
      
      // Record portfolio history (once per day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingHistory = await PortfolioHistory.findOne({
        user: req.user.id,
        date: { $gte: today }
      });
      
      if (!existingHistory) {
        const portfolioHistory = new PortfolioHistory({
          user: req.user.id,
          portfolioValue: totalValue,
          cashBalance: user.currentBalance,
          totalValue: totalValue + user.currentBalance,
          stocks: portfolio.stocks.map(stock => ({
            symbol: stock.symbol,
            companyName: stock.companyName,
            quantity: stock.quantity,
            price: stock.currentPrice,
            value: stock.totalValue
          }))
        });
        
        await portfolioHistory.save();
      }
    }
    
    res.json({
      portfolio,
      cashBalance: user.currentBalance,
      initialBalance: user.initialBalance
    });
  } catch (error) {
    console.error(`Get portfolio error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/performance
// @desc    Get portfolio performance metrics
// @access  Private
router.get('/performance', protect, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    
    // Calculate performance metrics
    const totalValue = portfolio.totalValue;
    const cashBalance = user.currentBalance;
    const portfolioValue = totalValue + cashBalance;
    const initialBalance = user.initialBalance;
    const totalGain = portfolioValue - initialBalance;
    const totalGainPercentage = (totalGain / initialBalance) * 100;
    
    // Calculate allocation percentages
    const stockAllocation = portfolio.stocks.map(stock => ({
      symbol: stock.symbol,
      companyName: stock.companyName,
      value: stock.totalValue,
      percentage: (stock.totalValue / portfolioValue) * 100
    }));
    
    // Add cash as an allocation
    stockAllocation.push({
      symbol: 'CASH',
      companyName: 'Cash Balance',
      value: cashBalance,
      percentage: (cashBalance / portfolioValue) * 100
    });
    
    res.json({
      portfolioValue,
      cashBalance,
      investedValue: totalValue,
      initialBalance,
      totalGain,
      totalGainPercentage,
      allocation: stockAllocation
    });
  } catch (error) {
    console.error(`Get portfolio performance error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/portfolio/history
// @desc    Get portfolio value history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { period = '1m' } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1w':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'all':
        // Get all history
        startDate = new Date(0);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Get portfolio history
    const history = await PortfolioHistory.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    // Format data for chart
    const chartData = history.map(entry => ({
      date: entry.date,
      totalValue: entry.totalValue,
      portfolioValue: entry.portfolioValue,
      cashBalance: entry.cashBalance
    }));
    
    res.json(chartData);
  } catch (error) {
    console.error(`Get portfolio history error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
