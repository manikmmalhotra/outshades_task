//import modules
const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();

const auth = async function (req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const t_verify = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: t_verify._id,
      "tokens.token": token,
    });

    if (user) {
      req.token = token;
      req.user = user;
      next();
    } else {
      throw new Error("User not found in the Database");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
};

module.exports = auth;
