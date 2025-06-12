# Frontend Component Structure

## Layout Components
- `App.js` - Main application component with routing
- `Navbar.js` - Navigation bar with user authentication status
- `Footer.js` - Site footer with links and information
- `Sidebar.js` - Navigation sidebar for dashboard
- `PrivateRoute.js` - Route protection for authenticated users

## Authentication Components
- `Login.js` - Login form with email/password and social login options
- `Register.js` - Registration form for new users
- `SocialLogin.js` - Buttons for Google, Apple, and X authentication
- `Profile.js` - User profile management

## Dashboard Components
- `Dashboard.js` - Main dashboard container
- `PortfolioSummary.js` - Summary of portfolio value and performance
- `BalanceCard.js` - Display current cash balance
- `PerformanceChart.js` - Portfolio performance visualization
- `RecentTransactions.js` - List of recent transactions

## Stock Components
- `StockSearch.js` - Search bar for finding stocks
- `StockList.js` - List of stocks with basic information
- `StockDetail.js` - Detailed view of a specific stock
- `StockChart.js` - Price chart for a stock
- `StockNews.js` - News related to a stock

## Trading Components
- `TradeForm.js` - Form for buying and selling stocks
- `OrderTypeSelector.js` - Select between market and limit orders
- `ConfirmTrade.js` - Trade confirmation modal
- `TransactionHistory.js` - Complete transaction history

## Portfolio Components
- `PortfolioTable.js` - Table of stocks in portfolio
- `PortfolioStock.js` - Individual stock in portfolio with metrics
- `PortfolioAnalytics.js` - Advanced portfolio analytics
- `PortfolioAllocation.js` - Visualization of portfolio allocation

## Watchlist Components
- `WatchlistContainer.js` - Container for watchlists
- `WatchlistItem.js` - Individual watchlist
- `WatchlistStockItem.js` - Stock item in watchlist
- `CreateWatchlist.js` - Form to create new watchlist

## Utility Components
- `Loading.js` - Loading spinner/indicator
- `ErrorBoundary.js` - Error handling component
- `Notification.js` - Toast notifications for actions
- `Modal.js` - Reusable modal component
- `Pagination.js` - Pagination for lists
