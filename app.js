const express = require("express");
const path = require("path");
const { User, connectToDb } = require("./db/index.js");
const session = require("express-session");
const passport = require("passport");

const {
  onRegister,
  checkSession,
  onLogin,
  loadUser,
  uploadProfilePic,
  removeProfilePic,
  onLogout,
} = require("./posts/user.js");

const {
  getFriendData,
  onUserSearch,
  onSendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
} = require("./posts/friend.js");

const { sendMessage, getMessages } = require("./posts/message.js");

const multer = require("multer")();
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//serving
if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

//initialize session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// initialize passport and set up session using it
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongo db connection

//handle all post requests from client.
app.post("/register", onRegister);
app.post("/login", onLogin);
app.post("/checkSession", checkSession);
app.post("/uploadProfilePic", multer.single("profilePic"), uploadProfilePic);
app.post("/removeProfilePic", removeProfilePic);
app.post("/user", loadUser);
app.post("/logout", onLogout);

app.post("/friendData", getFriendData);
app.post("/searchUser", onUserSearch);
app.post("/friendRequest", onSendFriendRequest);
app.post("/acceptFriendRequest", acceptFriendRequest);
app.post("/rejectFriendRequest", rejectFriendRequest);
app.post("/unfriend", unfriend);

app.post("/getMessages", getMessages);
app.post("/sendMessage", sendMessage);

connectToDb().then(() => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });

  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (username) => {
      socket.join(username);
      console.log("joined room", username);
      socket.emit("connected");
    });

    socket.on("send message", (message) => {
      socket.in(message.to).emit("new message", message);
    });

    socket.on("add friend", (request) => {
      socket.in(request.friendRequestUsername).emit("new friend request", {
        username: request.username,
        profilePic: request.profilePic,
      });
    });

    socket.on("friend request rejected", (request) => {
      socket
        .in(request.friendRequestUsername)
        .emit("friend request rejected", request.username);
    });

    socket.on("friend request accepted", (request) => {
      socket.in(request.friendRequestUsername).emit("friend request accepted", {
        username: request.username,
        firstName: request.firstName,
        lastName: request.lastName,
        profilePic: request.profilePic,
      });
    });

    socket.on("unfriend", (request) => {
      socket.in(request.friendUsername).emit("unfriended", request.username);
    });

    socket.on("logout", (username) => {
      socket.leave(username);
    });
  });
});
