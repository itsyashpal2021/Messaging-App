const path = require("path");
const express = require("express");
const { userSchema, Message, connectToDb } = require("./db/index.js");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { default: mongoose } = require("mongoose");
const { response } = require("express");

const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initialize session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// initialize passport and set up session using it
app.use(passport.initialize());
app.use(passport.session());

//passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongo db connection
connectToDb();

// handle new user registeration
app.post("/register", (req, res) => {
  const password = req.body.password;
  User.register(new User(req.body), password, function (err, user) {
    if (err) {
      //if email id is duplicate
      if (err.code === 11000) {
        res.json({ message: "A user with this email id already exists." });
      }
      res.json(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.json({ message: "SUCCESS" });
      });
    }
  });
});

// handle login
app.post("/login", (req, res) => {
  const user = new User(req.body);
  req.logIn(user, function (err) {
    if (err) {
      res.json(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.json({ name: "SUCCESS" });
      });
    }
  });
});

//handle user page
app.post("/user", async (req, res) => {
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
});

//log out
app.post("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      res.status(400).send(err);
    }
    res.sendStatus(200);
  });
});

//searching a user
app.post("/searchUser", async (req, res) => {
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
});

//send friendRequests
app.post("/friendRequest", async (req, res) => {
  const username = req.body.username;
  const friendRequestUsername = req.body.friendRequestUsername;

  const user = await User.findOne({ username: username });
  const friendUser = await User.findOne({ username: friendRequestUsername });

  //update user
  user.friendRequestsSent.push(friendRequestUsername);
  await user.save();

  //update friendUser
  friendUser.friendRequestsRecieved.push(username);
  await friendUser.save();

  res.sendStatus(200);
});

// accept friend request
//add in friend list of both and remove from friendRequestUser's request list
app.post("/acceptFriendRequest", async (req, res) => {
  const username = req.body.username;
  const friendRequestUsername = req.body.friendRequestUsername;

  const user = await User.findOne({ username: username });
  const friendUser = await User.findOne({ username: friendRequestUsername });

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
  friendUser.friendRequestsRecieved = friendUser.friendRequestsRecieved.filter(
    (item) => item !== username
  );
  await friendUser.save();

  res.sendStatus(200);
});

//reject friend request
app.post("/rejectFriendRequest", async (req, res) => {
  const username = req.body.username;
  const friendRequestUsername = req.body.friendRequestUsername;

  const user = await User.findOne({ username: username });
  const friendUser = await User.findOne({ username: friendRequestUsername });

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

  res.sendStatus(200);
});

// send message
app.post("/sendMessage", async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
