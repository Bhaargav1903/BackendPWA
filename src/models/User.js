const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Ensure emails are unique
    },
    password: {
      type: String,
      required: true
    },
    admin: {
      type: Boolean,
      default: false // Default to false, can be set true when first user signs up
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
