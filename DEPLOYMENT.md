# Deployment Guide for Stock Market Simulator

This guide will walk you through deploying the Stock Market Simulator permanently to production hosting platforms.

## Overview

We'll be using:
- **Vercel** for the frontend (React application)
- **Heroku** for the backend (Node.js/Express API)
- **MongoDB Atlas** for the database (cloud MongoDB)

## Prerequisites

1. Create accounts on:
   - [Vercel](https://vercel.com/signup)
   - [Heroku](https://signup.heroku.com/)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. Install the necessary CLI tools:
   - [Vercel CLI](https://vercel.com/download)
   - [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

## Step 1: Set up MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Set up a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for simplicity
4. Get your MongoDB connection string

## Step 2: Deploy the Backend to Heroku

1. Navigate to the backend directory:
   ```
   cd /home/ubuntu/stock-simulator/backend
   ```

2. Initialize a Git repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit for Heroku deployment"
   ```

3. Create a new Heroku app:
   ```
   heroku create stock-simulator-api
   ```

4. Set up environment variables on Heroku:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_mongodb_atlas_connection_string
   heroku config:set SESSION_SECRET=your_session_secret
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=https://stock-simulator.vercel.app
   ```

5. Add OAuth credentials (if you have them):
   ```
   heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
   heroku config:set GOOGLE_CALLBACK_URL=https://stock-simulator-api.herokuapp.com/api/auth/google/callback
   
   heroku config:set APPLE_CLIENT_ID=your_apple_client_id
   heroku config:set APPLE_TEAM_ID=your_apple_team_id
   heroku config:set APPLE_KEY_ID=your_apple_key_id
   heroku config:set APPLE_PRIVATE_KEY_PATH=path_to_your_private_key
   heroku config:set APPLE_CALLBACK_URL=https://stock-simulator-api.herokuapp.com/api/auth/apple/callback
   
   heroku config:set TWITTER_CONSUMER_KEY=your_twitter_consumer_key
   heroku config:set TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
   heroku config:set TWITTER_CALLBACK_URL=https://stock-simulator-api.herokuapp.com/api/auth/twitter/callback
   ```

6. Deploy to Heroku:
   ```
   git push heroku master
   ```

7. Ensure at least one instance is running:
   ```
   heroku ps:scale web=1
   ```

## Step 3: Deploy the Frontend to Vercel

1. Navigate to the frontend directory:
   ```
   cd /home/ubuntu/stock-simulator/frontend
   ```

2. Initialize a Git repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Follow the prompts in the Vercel CLI:
   - Set up and deploy project? Yes
   - Link to existing project? No
   - What's your project name? stock-simulator
   - In which directory is your code located? ./
   - Want to override the settings? No

5. Set environment variables in the Vercel dashboard:
   - REACT_APP_API_URL=https://stock-simulator-api.herokuapp.com/api

6. Deploy to production:
   ```
   vercel --prod
   ```

## Step 4: Connect Frontend and Backend

1. Verify the backend API is accessible:
   ```
   curl https://stock-simulator-api.herokuapp.com/api
   ```

2. Update CORS settings in the backend if necessary to allow requests from your Vercel domain.

3. Test the complete application by visiting your Vercel URL.

## Troubleshooting

- **Backend issues**: Check Heroku logs with `heroku logs --tail`
- **Frontend issues**: Check Vercel deployment logs in the Vercel dashboard
- **CORS errors**: Ensure the CLIENT_URL on Heroku matches your Vercel domain
- **Database connection issues**: Verify your MongoDB Atlas connection string and network access settings

## Maintenance

- **Scaling**: Upgrade your Heroku dyno if you need more performance
- **Database backups**: Set up automated backups in MongoDB Atlas
- **Monitoring**: Use Heroku metrics and MongoDB Atlas monitoring

## Next Steps

- Set up a custom domain for your application
- Implement HTTPS with SSL certificates
- Set up CI/CD pipelines for automated deployments
