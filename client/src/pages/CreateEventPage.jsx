import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import TextField from "../components/ui/TextField";
import Dropdown from "../components/ui/Dropdown";
import BackLink from "../components/ui/BackLink";
import { createEventSchema } from "../schemas/eventSchema";

const CATEGORY_OPTIONS = [
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "tech", label: "Tech" },
  { value: "food", label: "Food" },
  { value: "community", label: "Community" },
  { value: "other", label: "Other" },
];

export default function CreateEventPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    dateTime: "",
    maxAttendees: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = createEventSchema.safeParse(values);
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await api.post("/events", result.data);
      navigate(`/events/${res.data.event._id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8">
      <div className="max-w-2xl">
        <BackLink />

        <h1 className="mt-4 text-3xl">Create an event</h1>
        <p className="mt-2 text-ink-500">
          Fill in the details and share it with your community.
        </p>

        {serverError && (
          <div
            className="mb-4 mt-6 rounded-md px-3 py-2 text-sm"
            style={{
              background: "color-mix(in srgb, var(--color-danger) 12%, white)",
              color: "var(--color-danger)",
            }}
          >
            {serverError}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <TextField
            id="title"
            name="title"
            label="Title"
            placeholder="Community Tree Plantation Drive"
            value={values.title}
            onChange={handleChange}
            error={errors.title?.[0]}
          />

          <div>
            <label className="label">Category</label>
            <Dropdown
              value={values.category}
              onChange={(val) => {
                setValues((prev) => ({ ...prev, category: val }));
                setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              options={CATEGORY_OPTIONS}
            />
            {errors.category && (
              <p className="field-error">{errors.category[0]}</p>
            )}
          </div>

          <TextField
            id="location"
            name="location"
            label="Location"
            placeholder="Lalbagh Botanical Garden, Bangalore"
            value={values.location}
            onChange={handleChange}
            error={errors.location?.[0]}
          />

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className={`input ${errors.description ? "border-danger" : ""}`}
              placeholder="What's happening, who's it for, what to bring…"
              value={values.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="field-error">{errors.description[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="dateTime"
              name="dateTime"
              type="datetime-local"
              label="Date & time"
              value={values.dateTime}
              onChange={handleChange}
              error={errors.dateTime?.[0]}
            />
            <TextField
              id="maxAttendees"
              name="maxAttendees"
              type="number"
              min="1"
              label="Capacity"
              placeholder="150"
              value={values.maxAttendees}
              onChange={handleChange}
              error={errors.maxAttendees?.[0]}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? "Please wait…" : "Create event"}
          </button>
        </form>
      </div>
    </div>
  );
}
