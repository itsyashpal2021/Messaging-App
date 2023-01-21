//friends related posts --- friend requests and searching

const { User, Message } = require("../db/index.js");

const {
  getDriveService,
  getImageFromDrive,
} = require("../driveService/service.js");

const driveService = getDriveService();

const getFriendData = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).send();
      return;
    }

    const userData = await req.user.toObject();

    //populate friend list with friend details
    userData.friendList = await Promise.all(
      userData.friendList.map(async (friendUserName) => {
        const friendUser = await User.findOne({ username: friendUserName });

        return {
          username: friendUser.username,
          firstName: friendUser.firstName,
          lastName: friendUser.lastName,
          email: friendUser.email,
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

    //add profile pic to friend requests
    userData.friendRequestsRecieved = await Promise.all(
      userData.friendRequestsRecieved.map(async (friendRequestUsername) => {
        const friendUser = await User.findOne({
          username: friendRequestUsername,
        });

        return {
          username: friendRequestUsername,
          profilePic: friendUser.profilePicId
            ? await getImageFromDrive(friendUser.profilePicId, driveService)
            : undefined,
        };
      })
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

    const searchResults = await Promise.all(
      users.map(async (user) => {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePic: user.profilePicId
            ? await getImageFromDrive(user.profilePicId, driveService)
            : undefined,
        };
      })
    );

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

const unfriend = async (req, res) => {
  try {
    const username = req.user.username;
    const friendUsername = req.body.friendUsername;

    const user = await User.findOne({ username: username });
    const friendUser = await User.findOne({
      username: friendUsername,
    });

    user.friendList = user.friendList.filter((item) => item !== friendUsername);
    await user.save();

    friendUser.friendList = friendUser.friendList.filter(
      (item) => item !== username
    );
    await friendUser.save();

    await Message.deleteMany({
      $or: [
        {
          $and: [{ from: username }, { to: friendUsername }],
        },
        {
          $and: [{ to: username }, { from: friendUsername }],
        },
      ],
    });

    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFriendData,
  onUserSearch,
  onSendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
};
