#!/bin/bash

# Script to start the Stock Market Simulator without MongoDB check

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Create .env files with MongoDB Atlas connection
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env file with MongoDB Atlas connection..."
    cat > backend/.env << EOL
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://your_atlas_username:your_atlas_password@cluster0.mongodb.net/stocksimulator?retryWrites=true&w=majority
SESSION_SECRET=stocksimulator-secret-key
JWT_SECRET=jwt-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000

# OAuth credentials (leave empty for now) 
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY_PATH=
APPLE_CALLBACK_URL=http://localhost:5000/api/auth/apple/callback

TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_CALLBACK_URL=http://localhost:5000/api/auth/twitter/callback
EOL
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend .env file..."
    cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
EOL
fi

# Start the application
echo "Starting Stock Market Simulator..."
echo "The application will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the application"
npm run dev
