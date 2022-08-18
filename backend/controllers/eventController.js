const Events = require("../models/eventModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllEvents = catchAsyncErrors(async (req, res, next) => {

    const apiFeature = new ApiFeatures(Events.find(), req.query).filter();
    const events = await apiFeature.query;

    if (!events) {
        return next(new ErrorHandler("Events not found", 404));
    }

    res.status(200).json({
        success: true,
        events
    })
})

exports.getEventDetail = catchAsyncErrors(async (req, res, next) => {
    const event = await Events.findById(req.params.id);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      event,
    });
})

exports.createNewEvent = catchAsyncErrors(async (req, res) => {
    const event = await Events.create(req.body);
    res.status(201).json({
        success: true,
        event
    });
});


exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
    let event = await Events.findById(req.params.id);
    if (!event) {
        return next(new ErrorHandler("Event not found", 404));
    }

    event = await Events.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        event,
    });
});


exports.deleteEvent = catchAsyncErrors(async (req, res, next) => {
    const event = await Events.findById(req.params.id);

    if (!event) {
        return next(new ErrorHandler("Event not found", 404));
    }

    await event.remove();

    res.status(200).json({
        success: true,
        message: "Event Deleted Successfully",
    });
});



