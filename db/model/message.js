const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  time: Number, // number of ms since 1970/01/01: Date.now()
});

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;
