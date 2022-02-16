const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const users = new mongoose.Schema(
  {
    username: {
      unique: true,
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 4,
    },

    canChangePassword: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

users.methods.generatetoken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

users.statics.findbycredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new Error("Check Your Password");
  }
  return user;
};

users.statics.findbyemail = async function (email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  return user;
};

users.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", users);
module.exports = User;
