const express = require("express");
const mongoose = require("mongoose");
const Message = require("./model/messageSchema.js");

const userSchema = require("./model/userSchema.js");

//mongo setup
//connect to db server
const dbURI = "mongodb://localhost:27017/messagingAppDb";

module.exports = {
  userSchema: userSchema,
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
