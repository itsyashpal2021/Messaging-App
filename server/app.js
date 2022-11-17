const path = require("path");
const express = require("express");
const db = require("./db/index.js");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { default: mongoose } = require("mongoose");

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
const userSchema = db.userSchema;
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongo db connection
db.connectToDb();

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
app.post("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
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
app.post("/search-user", (req, res) => {
  const searchedUser = req.body.searchedUser;
  const currentUser = req.body.currentUser;

  //find the usernames starting with searched username other than the current user
  User.find(
    {
      $and: [
        { username: { $regex: `^${searchedUser}` } },
        { username: { $not: { $regex: `^${currentUser}$` } } },
      ],
    },
    function (err, arr) {
      if (err) {
        res.status(500).json({ error: err });
      }
      const searchResults = arr.map((user) => {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      });

      res.status(200).json({ users: searchResults });
    }
  );
});

//sending friendRequests
app.post("/friendRequest", (req, res) => {
  User.findOne(
    { username: req.body.friendRequestUsername },
    async function (err, user) {
      if (err) {
        console.log(err);
        res.sendStatus(500).send(err);
      }
      user.friendRequests.push(req.body.username);
      console.log(user);
      await user.save();
      res.sendStatus(200);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
