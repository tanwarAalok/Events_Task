const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const Events = require("../models/eventModel");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  sendToken(user, 201, res, "User successfully registered");
});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res, "User Login successful");
});

// LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});



//* GET USER (admin)

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//* UPDATE USER Role -- Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



exports.registerEvent = catchAsyncErrors(async (req, res, next) => {
  const { eventId, userId } = req.body;

  const event = await Events.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found", 400));
  }

  if (event.event_capacity <= 0) {
    return next(new ErrorHandler("Slots full", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const alreadyRegistered = user.eventsRegistered.find(
    (event_id) => event_id.toString() === eventId.toString()
  );

  if (alreadyRegistered) {
    return next(new ErrorHandler("Already registered for this event", 400));
  }

  user.eventsRegistered.push(eventId);
  event.usersRegistered.push(userId);

  event.event_capacity -= 1;

  await user.save({ validateBeforeSave: false });
  await event.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Successfully registered for the event"
  })

});

exports.deRegister = catchAsyncErrors(async (req, res, next) => {
  const { eventId, userId } = req.body;

  const event = await Events.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const ifRegistered = user.eventsRegistered.find(
    (event_id) => event_id.toString() === eventId.toString()
  );

  if (!ifRegistered) {
    return next(new ErrorHandler("You are already not registered for this event", 400));
  }

  const usersRegistered = event.usersRegistered.filter(
    (id) => id.toString() !== userId.toString()
  );
  const eventsRegistered = user.eventsRegistered.filter(
    (id) => id.toString() !== eventId.toString()
  );

  const event_capacity = event_capacity + 1;

  await User.findByIdAndUpdate(userId, {
    eventsRegistered
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  await Events.findByIdAndUpdate(
    eventId,
    {
      usersRegistered,
      event_capacity
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Successfully un-registered from the event",
  });

})
