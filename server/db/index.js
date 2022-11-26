const express = require("express");
const mongoose = require("mongoose");
const Message = require("./model/message.js");
const User = require("./model/user.js");
require("dotenv").config();

module.exports = {
  User: User,
  Message: Message,

  connectToDb: async function () {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      console.log("Error connecting to mongo Db:", error);
    } finally {
      console.log("Connected to mongo Db host:", mongoose.connection.host);
    }
  },
};
