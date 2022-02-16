const mongoose = require("mongoose");

const events = new mongoose.Schema({
  eventname: {
    type: String,
    required: true,
  },
  inviting: [
    {
      type: String,
      required: true,
    },
  ],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  creatorname: {
    type: String,
    ref: "User",
  },
});
const Event = mongoose.model("Events", events);
module.exports = Event;
