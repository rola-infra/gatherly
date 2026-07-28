import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import EventCard from "../components/EventCard";

function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="card mt-4 p-8 text-center">
      <p className="text-ink-500">{message}</p>
      <Link to={actionTo} className="btn btn-primary mt-4 inline-flex">
        {actionLabel}
      </Link>
    </div>
  );
}

export default function MyEventsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/events/my/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load your events. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container-page py-12 text-ink-500">
        Loading your events…
      </div>
    );
  }

  if (error) {
    return <div className="container-page py-12 text-danger">{error}</div>;
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl">My events</h1>
      <p className="mt-2 text-ink-500">
        Events you're hosting and the ones you've RSVP'd to.
      </p>

      <section className="mt-8">
        <h2 className="text-xl">Hosting ({data.createdCount})</h2>
        {data.created.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.created.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="You haven't created any events yet."
            actionLabel="Create an event"
            actionTo="/events/new"
          />
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl">Attending ({data.attendingCount})</h2>
        {data.attending.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.attending.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            message="You're not attending any events yet."
            actionLabel="Browse events"
            actionTo="/events"
          />
        )}
      </section>
    </div>
  );
}
