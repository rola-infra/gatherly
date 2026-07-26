import express from "express";
import {
  createEvent,
  getAllEvents,
  getEvent,
  toggleRsvp,
  getMyEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../validators/eventValidator.js";

const router = express.Router();

router
  .route("/")
  .get(getAllEvents)
  .post(protect, validate(createEventSchema), createEvent);
router.route("/my/dashboard").get(protect, getMyEvents);

router
  .route("/:id")
  .get(getEvent)
  .patch(protect, validate(updateEventSchema), updateEvent)
  .delete(protect, deleteEvent);

router.route("/:id/rsvp").post(protect, toggleRsvp);

export default router;
