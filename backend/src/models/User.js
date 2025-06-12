const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  },
  appleId: {
    type: String
  },
  twitterId: {
    type: String
  },
  profilePicture: {
    type: String
  },
  initialBalance: {
    type: Number,
    default: 100000
  },
  currentBalance: {
    type: Number,
    default: 100000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
