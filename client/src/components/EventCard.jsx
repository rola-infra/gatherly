import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { formatEventDate } from "../lib/format";

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id}`}
      className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="badge self-start" data-cat={event.category}>
        {event.category}
      </span>

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
