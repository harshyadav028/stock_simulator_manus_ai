// API Endpoints for Stock Market Simulator

// Authentication Routes
POST /api/auth/register - Register a new user
POST /api/auth/login - Login with email/password
GET /api/auth/google - Google OAuth login
GET /api/auth/apple - Apple OAuth login
GET /api/auth/twitter - Twitter/X OAuth login
GET /api/auth/user - Get current user info
POST /api/auth/logout - Logout user

// Stock Data Routes
GET /api/stocks/search?query={query} - Search for stocks
GET /api/stocks/quote/:symbol - Get real-time quote for a stock
GET /api/stocks/chart/:symbol - Get chart data for a stock
GET /api/stocks/trending - Get trending/popular stocks
GET /api/stocks/news/:symbol? - Get market news (general or for specific symbol)

// Portfolio Routes
GET /api/portfolio - Get user's portfolio
GET /api/portfolio/performance - Get portfolio performance metrics
GET /api/portfolio/history - Get portfolio value history

// Transaction Routes
POST /api/transactions - Create a new transaction (buy/sell)
GET /api/transactions - Get user's transaction history
GET /api/transactions/:id - Get specific transaction details
POST /api/transactions/order - Place a limit order

// Watchlist Routes
GET /api/watchlist - Get user's watchlists
POST /api/watchlist - Create a new watchlist
PUT /api/watchlist/:id - Update a watchlist
DELETE /api/watchlist/:id - Delete a watchlist
POST /api/watchlist/:id/stock - Add stock to watchlist
DELETE /api/watchlist/:id/stock/:symbol - Remove stock from watchlist

// User Settings Routes
GET /api/settings - Get user settings
PUT /api/settings - Update user settings
