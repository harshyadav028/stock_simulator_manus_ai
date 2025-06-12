#!/bin/bash

# Script to prepare the Stock Market Simulator for deployment

echo "Preparing Stock Market Simulator for deployment..."

# Create deployment directories if they don't exist
mkdir -p deployment/frontend
mkdir -p deployment/backend

# Copy frontend files
echo "Copying frontend files..."
cp -r /home/ubuntu/stock-simulator/frontend/* deployment/frontend/
cp /home/ubuntu/stock-simulator/frontend/.env.production deployment/frontend/

# Copy backend files
echo "Copying backend files..."
cp -r /home/ubuntu/stock-simulator/backend/* deployment/backend/
cp /home/ubuntu/stock-simulator/backend/Procfile deployment/backend/

# Copy deployment guide
echo "Copying deployment guide..."
cp /home/ubuntu/stock-simulator/DEPLOYMENT.md deployment/

# Create a README in the deployment directory
cat > deployment/README.md << EOL
# Stock Market Simulator Deployment Package

This package contains all the files needed to deploy the Stock Market Simulator to production hosting platforms.

## Contents

- \`frontend/\` - React frontend application for Vercel deployment
- \`backend/\` - Node.js/Express API for Heroku deployment
- \`DEPLOYMENT.md\` - Comprehensive deployment guide

## Quick Start

1. Follow the instructions in DEPLOYMENT.md to set up accounts on Vercel, Heroku, and MongoDB Atlas
2. Deploy the backend to Heroku
3. Deploy the frontend to Vercel
4. Connect them together as described in the guide

For detailed instructions, please refer to the DEPLOYMENT.md file.
EOL

# Create a zip file of the deployment package
echo "Creating deployment package..."
cd deployment
zip -r ../stock-simulator-deployment.zip .
cd ..

echo "Deployment package created: stock-simulator-deployment.zip"
echo "Follow the instructions in DEPLOYMENT.md to deploy your application permanently."
