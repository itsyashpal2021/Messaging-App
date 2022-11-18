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
      username: String,
      firstName: String,
      lastName: String,
    },
  ],
  friendRequestsSent: [
    {
      type: String,
    },
  ],
  friendRequestsRecieved: [
    {
      type: String,
    },
  ],
});

module.exports = userSchema;
