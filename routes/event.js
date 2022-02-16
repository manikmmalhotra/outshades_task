const express = require("express");
const router = new express.Router();
const events = require("../model/event");
const auth = require("../middleware/auth");

router.post("/create_events", auth, async (req, res) => {
  //to create a new events
  const event = new events({
    ...req.body,
    creatorId: req.user.id,
    creatorname: req.user.username,
  });

  try {
    await event.save();
    console.log("successfully created");
    res.send(event);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/check_created_event", auth, async (req, res) => {
  //get all events created by a user
  try {
    let { page, size, sort } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }
    const limit = parseInt(size);
    const event = await events
      .find({ creatorname: req.user.username })
      .sort({ _id: -1 }) //descending order
      .limit(limit);
    res.send({
      page,
      size,
      Info: event,
    });
  } catch (e) {
    res.send(e);
  }
});

router.get("/check_invited_events", auth, async (req, res) => {
  //get list of event he is invited
  try {
    let { page, size, sort } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    const allEvent = await events.find({}).sort({ _id: 1 }).limit(limit); //ascending order
    const username = req.user.username;

    const allmeeting = [];
    // const allInvitedMeetings = allMeeting.filter((element) =>
    //   element.inviting.forEach((element1) => {
    //     if (element1 === username) {
    //       allmeeting.push(element);
    //     }
    //   })
    // );
    if (allEvent.length == 0) {
      res.send("you are not invited to any event");
    }
    res.send({
      page,
      size,
      Info: allEvent,
    });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/event_details/:id", async (req, res) => {
  //get paticular event details
  try {
    const _id = req.params.id;
    const event = await events.findById(_id);
    if (!event) {
      res.send("no such event exsist");
    }
    res.send(event);
  } catch (e) {
    res.send(e.message);
  }
});

router.patch("/update_event/:id", auth, async (req, res) => {
  //update a event
  const _id = req.params.id;
  const event = await event.findById(_id);
  const updates = Object.keys(req.body); //array of strings
  const allowedupdates = ["inviting", "eventname"];
  const isvalid = updates.every((update) => {
    return allowedupdates.includes(update);
  });
  if (!isvalid) {
    res.send("not allowed property");
  }
  try {
    updates.forEach((update) => {
      event[update] = req.body[update];
    });
    await event.save();
    res.send(event);
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;
