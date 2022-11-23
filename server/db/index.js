const express = require("express");
const mongoose = require("mongoose");
const Message = require("./model/message.js");
const User = require("./model/user.js");

//mongo setup
//connect to db server
const dbURI = "mongodb://localhost:27017/messagingAppDb";

module.exports = {
  User: User,
  Message: Message,

  connectToDb: async function () {
    try {
      await mongoose.connect(dbURI);
    } catch (error) {
      console.log("Error connecting to mongo Db:", error);
    } finally {
      console.log("Connected to mongo Db.");
    }
  },
};
