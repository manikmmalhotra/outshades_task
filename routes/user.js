const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const auth = require("../middleware/auth");
require("dotenv").config();

router.post("/user/signup", async (req, res) => {
  //to create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generatetoken();
    res.send({ user, token });
    console.log("successfully created");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findbycredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generatetoken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send("no user found");
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("logged out succesfully");
  } catch (e) {
    res.status(500).send("logout error");
  }
});

router.patch("/update_password", auth, async (req, res) => {
  const updates = Object.keys(req.body); //array of strings
  const allowedupdates = ["password"];
  const isvalid = updates.every((update) => {
    return allowedupdates.includes(update);
  });
  if (!isvalid) {
    res.send("not allowed property");
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.send(e);
  }
});

router.post("/forgot_password", async (req, res) => {
  try {
    const user = await User.findbyemail(req.body.email);
    res.send("Changing the password");
    user.canChangePassword = true;
    await user.save();
    console.log(user.canChangePassword);
  } catch (e) {
    res.send(e.message);
  }
});

router.post("/new_password", async (req, res) => {
  try {
    const user = await User.findbyemail(req.body.email);
    const newPassword = req.body.password;
    if (user.canChangePassword == false) {
      res.send("ask for request");
    }
    user.password = newPassword;
    user.canChangePassword = false;
    await user.save();
    res.send("new password has been Saved ");
  } catch (e) {
    res.send(e.message);
  }
});
module.exports = router;
