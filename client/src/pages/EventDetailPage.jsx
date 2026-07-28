import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import api from "../lib/api";
import { formatEventDate } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import BackLink from "../components/ui/BackLink";

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("Event not found.");
        } else {
          setError("Could not load this event. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleRsvp = async () => {
    if (!user) {
      // We use window here only to keep the guest flow simple; the button
      // below already routes guests, so this is a safety net.
      return;
    }

    setRsvpLoading(true);
    setRsvpError("");

    try {
      const res = await api.post(`/events/${event._id}/rsvp`);
      const { attending, attendeeCount, isFull, slotsLeft } = res.data;

      setEvent((prev) => {
        const nextAttendees = attending
          ? [...prev.attendees, { _id: user.id, name: user.name }]
          : prev.attendees.filter((p) => p._id !== user.id);

        return {
          ...prev,
          attendees: nextAttendees,
          attendeeCount,
          isFull,
          slotsLeft,
        };
      });
    } catch (err) {
      setRsvpError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-12 text-ink-500">Loading event…</div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-12">
        <p className="text-danger">{error}</p>
        <div className="mt-4">
          <BackLink />
        </div>
      </div>
    );
  }

  const full = event.isFull;
  const fewLeft = !full && event.slotsLeft <= 3;
  const isAttending = !!user && event.attendees.some((p) => p._id === user.id);

  return (
    <div className="container-page py-8">
      <BackLink />

      <header className="mt-4">
        <span className="badge" data-cat={event.category}>
          {event.category}
        </span>
        <h1 className="mt-3 text-3xl">{event.title}</h1>
        <p className="mt-2 text-sm text-ink-500">
          Hosted by{" "}
          <span className="font-semibold text-ink-700">
            {event.creator.name}
          </span>
        </p>
      </header>

      <div className="card mt-6 p-5">
        <div className="space-y-3 text-sm text-ink-600">
          <p className="flex items-center gap-2.5">
            <Calendar size={16} className="shrink-0 text-ink-400" />
            {formatEventDate(event.dateTime)}
          </p>
          <p className="flex items-center gap-2.5">
            <MapPin size={16} className="shrink-0 text-ink-400" />
            {event.location}
          </p>
          <p className="flex items-center gap-2.5">
            <Users size={16} className="shrink-0 text-ink-400" />
            <span className="stat text-ink-800">
              {event.attendeeCount} / {event.maxAttendees}
            </span>
            going
            {full ? (
              <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-danger">
                Full
              </span>
            ) : (
              <span
                className={`rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold ${
                  fewLeft ? "text-warning" : "text-ink-500"
                }`}
              >
                {event.slotsLeft} spots left
              </span>
            )}
          </p>
        </div>

        <div className="mt-5">
          {!user ? (
            <Link to="/login" className="btn btn-primary w-full sm:w-auto">
              Log in to RSVP
            </Link>
          ) : (
            <button
              onClick={handleRsvp}
              disabled={rsvpLoading || (!isAttending && full)}
              className={`btn w-full sm:w-auto ${
                isAttending ? "btn-outline" : "btn-primary"
              }`}
            >
              {rsvpLoading
                ? "Saving…"
                : isAttending
                  ? "Cancel RSVP"
                  : full
                    ? "Event is full"
                    : "RSVP to this event"}
            </button>
          )}

          {rsvpError && <p className="field-error">{rsvpError}</p>}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg">About</h2>
        <p className="mt-2 whitespace-pre-line text-ink-600">
          {event.description || "No description provided."}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg">Who's going ({event.attendeeCount})</h2>
        {event.attendees.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {event.attendees.map((person) => (
              <li
                key={person._id}
                className="flex items-center gap-2 rounded-full border border-ink-100 bg-white py-1 pl-1 pr-3"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                  {person.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-ink-700">{person.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-500">Be the first to RSVP.</p>
        )}
      </section>
    </div>
  );
}
