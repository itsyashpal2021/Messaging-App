const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  gender: String,
  friendList: [
    {
      type: String,
    },
  ],
  friendRequests: [
    {
      type: String,
    },
  ],
});

module.exports = userSchema;
