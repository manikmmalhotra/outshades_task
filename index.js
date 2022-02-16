//importing modules
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Users = require("./routes/user");
const Events = require("./routes/event");
require("dotenv").config();

//mongodb connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use(Users);
app.use(Events);

app.listen(port, function () {
  console.log("hello my name is suzieeee");
});
