const { User, Message } = require("../db/index.js");
const passport = require("passport");
const {
  getDriveService,
  uploadToDrive,
  getImageFromDrive,
} = require("../driveService/service.js");

const driveService = getDriveService();

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

const checkSession = async (req, res) => {
  try {
    const sessionActive = req.isAuthenticated();
    res.status(200).json({ sessionActive: sessionActive });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      const userData = req.user.toObject();

      res.status(200).json({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilePic: userData.profilePicId
          ? await getImageFromDrive(userData.profilePicId, driveService)
          : undefined,
      });
    } else {
      res.status(401).send();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFriendData = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).send();
      return;
    }

    const userData = await req.user.toObject();

    //populate friend list with friend details and last messages
    userData.friendList = await Promise.all(
      userData.friendList.map(async (friendUserName) => {
        const friendUser = await User.findOne({ username: friendUserName });
        let messages = await Message.find({
          $or: [
            {
              $and: [{ from: userData.username }, { to: friendUser.username }],
            },
            {
              $and: [{ to: userData.username }, { from: friendUser.username }],
            },
          ],
        }).sort({
          time: "desc",
        });

        if (messages.length === 0) {
          messages = [
            {
              message: "",
              time: 0,
            },
          ];
        }

        return {
          username: friendUser.username,
          firstName: friendUser.firstName,
          lastName: friendUser.lastName,
          lastMessage: messages[0].message,
          lastMessageTime: messages[0].time,
          profilePic: friendUser.profilePicId
            ? await getImageFromDrive(friendUser.profilePicId, driveService)
            : undefined,
        };
      })
    );

    //sort friend list according to lastMessage time
    userData.friendList.sort((a, b) =>
      a.lastMessageTime < b.lastMessageTime
        ? 1
        : a.lastMessageTime > b.lastMessageTime
        ? -1
        : 0
    );

    res.status(200).json({
      friendList: userData.friendList,
      friendRequestsRecieved: userData.friendRequestsRecieved,
      friendRequestsSent: userData.friendRequestsSent,
    });
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
        { username: { $regex: `^${searchedUser}`, $options: "i" } },
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
    user.friendList.push(friendUser.username);
    user.friendRequestsRecieved = user.friendRequestsRecieved.filter(
      (item) => item !== friendRequestUsername
    );
    await user.save();

    // friendUser change
    friendUser.friendList.push(user.username);
    friendUser.friendRequestsSent = friendUser.friendRequestsSent.filter(
      (item) => item !== username
    );
    await friendUser.save();

    res.status(200).json({
      firstName: friendUser.firstName,
      lastName: friendUser.lastName,
    });
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

const uploadProfilePic = async (req, res) => {
  try {
    const img = req.file;

    const id = await uploadToDrive(img, driveService);

    const user = await User.findOne({ username: req.user.username });
    user.profilePicId = id;
    await user.save();

    const base64Img = await getImageFromDrive(id, driveService);
    res.status(200).json({ src: base64Img });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  onRegister,
  checkSession,
  onLogin,
  loadUser,
  getFriendData,
  onLogout,
  onUserSearch,
  onSendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getMessages,
  sendMessage,
  uploadProfilePic,
};
