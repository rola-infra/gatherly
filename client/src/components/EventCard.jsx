import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatEventDate } from "../lib/format";

export default function EventCard({ event }) {
  const full = event.isFull;
  const fewLeft = !full && event.slotsLeft <= 3;

  return (
    <Link
      to={`/events/${event._id}`}
      className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="badge" data-cat={event.category}>
          {event.category}
        </span>

        {full ? (
          <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-danger">
            Full
          </span>
        ) : fewLeft ? (
          <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-warning">
            {event.slotsLeft} left
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-950">
        {event.title}
      </h3>

      <div className="mt-4 space-y-2 text-sm text-ink-500">
        <p className="flex items-center gap-2">
          <Calendar size={15} className="shrink-0" />
          {formatEventDate(event.dateTime)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0" />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users size={15} className="shrink-0" />
          <span className="stat">
            {event.attendeeCount} / {event.maxAttendees}
          </span>
          going
        </p>
      </div>
    </Link>
  );
}
