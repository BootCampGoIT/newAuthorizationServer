const _ = require("lodash");
const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.hasAuthorization = (req, res) => {
  const authorized = req.profile && req.auth && req.profile._id === req.auth.id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
};

exports.getAllUsers = (req, res) => {
  console.log(`req`, req.auth._id);
  if (req.auth._id !== process.env.ADMIN_ID) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ users });
  });
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.profile.created = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: "User is not authorized to perform this action",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    res.json({ message: "User removed!" });
  });
};
