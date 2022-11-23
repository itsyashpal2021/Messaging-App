const { User, Message } = require("../db/index.js");
const passport = require("passport");

const onRegister = async (req, res) => {
  try {
    const password = req.body.password;
    const user = await User.register(new User(req.body), password);
    await passport.authenticate("local")(req, res, function () {
      res.status(200).json({ message: "SUCCESS" });
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      res
        .status(400)
        .json({ message: "A User with this Email is already registered." });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

const onLogin = async (req, res) => {
  try {
    const user = new User(req.body);
    req.logIn(user, function (err) {
      if (err) {
        throw err;
      } else {
        passport.authenticate("local")(req, res, function () {
          res.status(200).json({ message: "SUCCESS" });
        });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loadUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const messages = await Message.find({
        $or: [{ to: req.user.username }, { from: req.user.username }],
      }).sort({
        time: "asc",
      });

      const userData = { ...req.user._doc, messages: messages };

      res.status(200).json(userData);
    } else {
      res.status(401).send();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const onLogout = async (req, res) => {
  try {
    req.logOut(function (err) {
      if (err) {
        throw err;
      }
      res.status(200).json({ message: "SUCCESS" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const onUserSearch = async (req, res) => {
  try {
    const searchedUser = req.body.searchedUser;
    const currentUser = req.body.currentUser;

    //find the usernames starting with searched username other than the current user
    let users = await User.find({
      $and: [
        { username: { $regex: `^${searchedUser}` } },
        { username: { $not: { $regex: `^${currentUser}$` } } },
      ],
    }).limit(5);

    const searchResults = users.map((user) => {
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });

    res.status(200).json({ users: searchResults });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const onSendFriendRequest = async (req, res) => {
  try {
    const username = req.body.username;
    const friendRequestUsername = req.body.friendRequestUsername;

    const user = await User.findOne({ username: username });
    const friendUser = await User.findOne({
      username: friendRequestUsername,
    });

    //update user
    user.friendRequestsSent.push(friendRequestUsername);
    await user.save();

    //update friendUser
    friendUser.friendRequestsRecieved.push(username);
    await friendUser.save();

    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const username = req.body.username;
    const friendRequestUsername = req.body.friendRequestUsername;

    const user = await User.findOne({ username: username });
    const friendUser = await User.findOne({
      username: friendRequestUsername,
    });

    //user changes
    user.friendList.push({
      username: friendUser.username,
      firstName: friendUser.firstName,
      lastName: friendUser.lastName,
    });
    user.friendRequestsRecieved = user.friendRequestsRecieved.filter(
      (item) => item !== friendRequestUsername
    );
    // in case this user has also sent an request
    user.friendRequestsSent = user.friendRequestsSent.filter(
      (item) => item !== friendRequestUsername
    );
    await user.save();

    // friendUser change
    friendUser.friendList.push({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    friendUser.friendRequestsSent = friendUser.friendRequestsSent.filter(
      (item) => item !== username
    );
    // in case other user has also recieved an request
    friendUser.friendRequestsRecieved =
      friendUser.friendRequestsRecieved.filter((item) => item !== username);
    await friendUser.save();

    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const username = req.body.username;
    const friendRequestUsername = req.body.friendRequestUsername;

    const user = await User.findOne({ username: username });
    const friendUser = await User.findOne({
      username: friendRequestUsername,
    });

    //update user
    user.friendRequestsRecieved = user.friendRequestsRecieved.filter(
      (item) => item !== friendRequestUsername
    );
    await user.save();

    //update friend user
    friendUser.friendRequestsSent = user.friendRequestsSent.filter(
      (item) => item !== username
    );
    await friendUser.save();

    res.status(200).json({ message: "SUCCESS" });
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
  onRegister,
  onLogin,
  loadUser,
  onLogout,
  onUserSearch,
  onSendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  sendMessage,
};
