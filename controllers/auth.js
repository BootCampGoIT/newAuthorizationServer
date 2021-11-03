const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.signup = async (req, res) => {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array()[0].msg });
  }
  // end validation

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: "emailExist",
    });
  }
  const user = await new User(req.body);
  await user.save();
  //   res.status(200).json({user})
  res.status(200).json({ message: "complete" });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "noExist",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "noCorrectPassword",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, email } = user;
    return res.json({ token, user: { _id, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "exited",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
