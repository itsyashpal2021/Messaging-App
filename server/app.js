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
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

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
      res.json(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.json({ name: "SUCCESS" });
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

app.post("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send();
  } else {
    res.status(401).send();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
