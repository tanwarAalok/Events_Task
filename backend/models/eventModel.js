const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: [true, "Event name is required !"],
  },

  event_start_timestamp: {
    type: Date,
    required: [true, "Event start date is required"],
  },

  event_end_timestamp: {
    type: Date,
    required: [true, "Event end date is required"],
  },

  event_location: {
    Lat: {
      type: Number,
      default: 0,
    },
    Lon: {
      type: Number,
      default: 0,
    },
  },

  event_capacity: {
    type: Number,
    default: 50,
  },

  usersRegistered: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
  ],
});

module.exports = mongoose.model("Events", eventSchema);