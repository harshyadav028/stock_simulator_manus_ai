# Stock Market Simulator

A comprehensive stock market simulator with real-time data, social authentication, and portfolio tracking.

## Features

- Real-time stock market data from Yahoo Finance
- User authentication with Google, Apple, and X (Twitter)
- $100,000 virtual money for new users
- Stock search and detailed information
- Interactive price charts with multiple timeframes
- Buy and sell stocks with market or limit orders
- Portfolio tracking with performance metrics
- Transaction history
- Portfolio performance visualization

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with JWT
- **API Integration**: Yahoo Finance

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Setup

1. Clone the repository
```
git clone https://github.com/yourusername/stock-simulator.git
cd stock-simulator
```

2. Install dependencies
```
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Create a .env file in the backend directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_PATH=path_to_your_private_key
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback

TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback
```

4. Create a .env file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

To run both frontend and backend concurrently:
```
npm run dev
```

To run backend only:
```
npm run server
```

To run frontend only:
```
npm run client
```

### Production Mode

Build the frontend:
```
npm run build
```

Start the production server:
```
npm start
```

## Deployment

The application is ready for deployment on platforms like Heroku:

1. Create a new Heroku app
2. Set up environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy the main branch

## Usage

1. Register or login with email, Google, Apple, or X
2. Browse stocks using the search functionality
3. View detailed stock information and charts
4. Buy stocks using your $100,000 initial balance
5. Monitor your portfolio performance
6. Sell stocks when you're ready
7. Track your performance over time with the history charts

## License

MIT
