const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    avatar: {
      type: Object,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    birthday: {
      type: String,
    },
    phone: {
      type: String,
    },
    telegram: {
      type: String,
    },
    git: {
      type: String,
    },
    more: {
      type: String,
    },
    stack: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      require: true,
    },
    hashed_password: {
      type: String,
      require: true,
    },
    salt: String,
    created: {
      type: Date,
      default: Date.now(),
    },
    updated: Date,
  },
  { versionKey: false }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = model("User", userSchema);
