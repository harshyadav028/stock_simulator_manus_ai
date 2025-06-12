const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const AppleStrategy = require('passport-apple');
const User = require('../models/User');
require('dotenv').config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Update existing user with Google ID
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilePicture: profile.photos[0].value
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true
  },
  async (token, tokenSecret, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ twitterId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email (if email is provided by Twitter)
      if (profile.emails && profile.emails[0]) {
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Update existing user with Twitter ID
          user.twitterId = profile.id;
          await user.save();
          return done(null, user);
        }
      }
      
      // Create new user
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : `${profile.username}@twitter.com`,
        twitterId: profile.id,
        profilePicture: profile.photos ? profile.photos[0].value : null
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Apple Strategy
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: process.env.APPLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple profile might not have all info on first login
      // Email is available in idToken.email
      const email = idToken.email;
      const name = idToken.name ? `${idToken.name.firstName} ${idToken.name.lastName}` : 'Apple User';
      
      // Check if user already exists
      let user = await User.findOne({ appleId: idToken.sub });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      if (email) {
        user = await User.findOne({ email });
        
        if (user) {
          // Update existing user with Apple ID
          user.appleId = idToken.sub;
          await user.save();
          return done(null, user);
        }
      }
      
      // Create new user
      const newUser = new User({
        name: name,
        email: email || `${idToken.sub}@apple.com`,
        appleId: idToken.sub
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
