import Event from "../models/Event.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import APIFeatures from "../utils/apiFeatures.js";

export const createEvent = async (req, res, next) => {
  const { title, description, location, dateTime, category, maxAttendees } =
    req.body;

  const event = await Event.create({
    title,
    description,
    location,
    dateTime,
    category,
    maxAttendees,
    creator: req.user._id,
  });

  sendResponse(res, 201, { event });
};

export const getAllEvents = async (req, res, next) => {
  const features = new APIFeatures(Event.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const events = await features.query.populate("creator", "name");

  sendResponse(res, 200, {
    results: events.length,
    events,
  });
};

export const getEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("creator", "name")
    .populate("attendees", "name");

  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  sendResponse(res, 200, { event });
};

export const toggleRsvp = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  const userId = req.user._id;

  const alreadyIn = event.attendees.some((id) => id.equals(userId));

  if (alreadyIn) {
    event.attendees = event.attendees.filter((id) => !id.equals(userId));
  } else {
    if (event.attendees.length >= event.maxAttendees) {
      return next(new AppError("This event is full", 400));
    }
    event.attendees.push(userId);
  }

  await event.save();

  sendResponse(res, 200, {
    attending: !alreadyIn,
    attendeeCount: event.attendees.length,
    isFull: event.attendees.length >= event.maxAttendees,
    slotsLeft: Math.max(event.maxAttendees - event.attendees.length, 0),
  });
};

export const getMyEvents = async (req, res, next) => {
  const userId = req.user._id;

  const created = await Event.find({ creator: userId }).sort("dateTime");

  const attending = await Event.find({ attendees: userId }).sort("dateTime");

  sendResponse(res, 200, {
    createdCount: created.length,
    attendingCount: attending.length,
    created,
    attending,
  });
};

export const updateEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  if (!event.creator.equals(req.user._id)) {
    return next(new AppError("You can only edit your own events", 403));
  }

  const allowed = [
    "title",
    "description",
    "location",
    "dateTime",
    "category",
    "maxAttendees",
  ];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  });

  await event.save();

  sendResponse(res, 200, { event });
};

export const deleteEvent = async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that ID", 404));
  }

  if (!event.creator.equals(req.user._id)) {
    return next(new AppError("You can only delete your own events", 403));
  }

  await event.deleteOne();

  sendResponse(res, 204, {});
};
