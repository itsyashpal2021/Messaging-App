const { Message } = require("../db/index.js");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          $and: [{ from: req.body.username }, { to: req.body.friendUserName }],
        },
        {
          $and: [{ from: req.body.friendUserName }, { to: req.body.username }],
        },
      ],
    }).sort({
      time: "asc",
    });

    res.status(200).json({ messages: messages });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
