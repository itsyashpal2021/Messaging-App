const express = require("express");
const { User, connectToDb } = require("./db/index.js");
const session = require("express-session");
const passport = require("passport");
const {
  onRegister,
  onLogin,
  loadUser,
  onLogout,
  onUserSearch,
  onSendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  sendMessage,
  checkSession,
  getFriendData,
  getMessages,
} = require("./posts/posts.js");

const app = express();
const port = process.env.PORT || 8080;
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

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongo db connection
connectToDb();

//handle all post requests from client.
app.post("/register", onRegister);
app.post("/checkSession", checkSession);
app.post("/login", onLogin);
app.post("/user", loadUser);
app.post("/friendData", getFriendData);
app.post("/logout", onLogout);
app.post("/searchUser", onUserSearch);
app.post("/friendRequest", onSendFriendRequest);
app.post("/acceptFriendRequest", acceptFriendRequest);
app.post("/rejectFriendRequest", rejectFriendRequest);
app.post("/getMessages", getMessages);
app.post("/sendMessage", sendMessage);

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
    socket.emit("connected");
  });

  socket.on("send message", (message) => {
    socket.in(message.to).emit("new message", message);
  });
});
