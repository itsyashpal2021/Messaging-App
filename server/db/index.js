const express = require("express");
const mongoose = require("mongoose");

const userSchema = require("./model/userSchema.js");

//mongo setup
//connect to db server
const dbURI = "mongodb://localhost:27017/messagingAppDb";

module.exports = {
  userSchema: userSchema,

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
