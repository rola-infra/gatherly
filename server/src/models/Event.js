import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 300,
    },

    dateTime: {
      type: Date,
      required: [true, "Event date and time is required"],
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["music", "sports", "tech", "food", "community", "other"],
      index: true,
    },

    maxAttendees: {
      type: Number,
      required: [true, "Max attendees is required"],
      min: [1, "There must be at least 1 slot"],
    },

    attendees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
  },
  { timestamps: true },
);

eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.length;
});

eventSchema.virtual("isFull").get(function () {
  return this.attendees.length >= this.maxAttendees;
});

eventSchema.virtual("slotsLeft").get(function () {
  return Math.max(this.maxAttendees - this.attendees.length, 0);
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
