//user related posts for logIn,logOut,register and profile picture
const { User } = require("../db/index.js");
const passport = require("passport");
const {
  getDriveService,
  uploadToDrive,
  getImageFromDrive,
  removeFromDrive,
} = require("../services/driveService.js");

const {
  createTransporter,
  sendOtpToMail,
} = require("../services/nodeMailerService.js");

const driveService = getDriveService();
const nodeMailerTransporter = createTransporter();

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

const removeProfilePic = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const id = user.profilePicId;
    await removeFromDrive(id, driveService);
    user.profilePicId = undefined;
    await user.save();
    res.status(200).json({ message: "SUCCESS" });
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

const sendOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    //if no user with this email.
    if (!user)
      res
        .status(400)
        .json({ message: "User with given Email Id does not Exist." });
    else {
      const otp = await sendOtpToMail(email, nodeMailerTransporter);
      res.status(200).json({ otp: otp });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    await user.setPassword(req.body.password);
    await user.save();

    res.status(200).json({ message: "SUCCESS" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  onRegister,
  checkSession,
  onLogin,
  loadUser,
  uploadProfilePic,
  removeProfilePic,
  onLogout,
  sendOtp,
  changePassword,
};
