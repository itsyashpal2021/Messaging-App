const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

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
  profilePicId: String,
});

//passportLocalMongoose
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

module.exports = User;
