const express = require('express');
const { getAllEvents, createNewEvent, getEventDetail, updateEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/events").get(getAllEvents);

router.route("/newEvent").post(isAuthenticatedUser, authorizeRoles("admin"), createNewEvent);

router
  .route("/event/:id")
  .get(isAuthenticatedUser, getEventDetail)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateEvent)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteEvent);


module.exports = router;