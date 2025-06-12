const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');
require('dotenv').config();

// Helper function to fetch stock data from Yahoo Finance API
const fetchStockData = async (endpoint, params) => {
  try {
    // In a production environment, you would use your API key and proper authentication
    // For this simulator, we'll create a wrapper around the Yahoo Finance API
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/${endpoint}`, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data: ${error}`);
    throw new Error('Failed to fetch stock data');
  }
};

// @route   GET /api/stocks/search
// @desc    Search for stocks
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/search`, {
      params: {
        q: query,
        quotesCount: 10,
        newsCount: 0
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Search error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stocks/quote/:symbol
// @desc    Get real-time quote for a stock
// @access  Public
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote`, {
      params: {
        symbols: symbol
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.data.quoteResponse.result.length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    res.json(response.data.quoteResponse.result[0]);
  } catch (error) {
    console.error(`Quote error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stocks/chart/:symbol
// @desc    Get chart data for a stock
// @access  Public
router.get('/chart/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1d', range = '1mo' } = req.query;
    
    // Using the Yahoo Finance API data source provided
    const params = {
      symbol,
      interval,
      range,
      includeAdjustedClose: true
    };
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.data.chart.result || response.data.chart.result.length === 0) {
      return res.status(404).json({ message: 'Chart data not found' });
    }
    
    res.json(response.data.chart.result[0]);
  } catch (error) {
    console.error(`Chart error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stocks/trending
// @desc    Get trending/popular stocks
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/trending/US`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`Trending error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stocks/news/:symbol?
// @desc    Get market news (general or for specific symbol)
// @access  Public
router.get('/news/:symbol?', async (req, res) => {
  try {
    const { symbol } = req.params;
    let endpoint = 'news';
    let params = {};
    
    if (symbol) {
      params = { category: symbol };
    }
    
    const response = await axios.get(`https://query1.finance.yahoo.com/v2/finance/${endpoint}`, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(`News error: ${error}`);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
