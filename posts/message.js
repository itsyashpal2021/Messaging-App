const { Message } = require("../db/index.js");

const getMessages = async (req, res) => {
  try {
    const friendList = req.user.friendList;
    const username = req.user.username;

    const messages = {};
    for (let friendUserName of friendList) {
      const friendMessages = await Message.find(
        {
          $or: [
            {
              $and: [{ from: username }, { to: friendUserName }],
            },
            {
              $and: [{ from: friendUserName }, { to: username }],
            },
          ],
        },
        { _id: 0, __v: 0 }
      ).sort({
        time: "asc",
      });

      messages[friendUserName] = friendMessages;
    }

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
