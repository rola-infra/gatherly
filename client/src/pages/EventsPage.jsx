import { useState, useEffect } from "react";
import api from "../lib/api";
import EventCard from "../components/EventCard";
import Dropdown from "../components/ui/Dropdown";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");

  const CATEGORIES = ["music", "sports", "tech", "food", "community", "other"];

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (category) params.category = category;

    const now = new Date();
    if (dateFilter === "upcoming") {
      params["dateTime[gte]"] = now.toISOString();
    } else if (dateFilter === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      params["dateTime[gte]"] = start.toISOString();
      params["dateTime[lte]"] = end.toISOString();
    } else if (dateFilter === "week") {
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      params["dateTime[gte]"] = now.toISOString();
      params["dateTime[lte]"] = end.toISOString();
    }

    api
      .get("/events", { params })
      .then((res) => setEvents(res.data.events))
      .catch(() => setError("Could not load events. Please try again."))
      .finally(() => setLoading(false));
  }, [category, dateFilter]);

  if (loading) {
    return (
      <div className="container-page py-12 text-ink-500">Loading events…</div>
    );
  }

  if (error) {
    return <div className="container-page py-12 text-danger">{error}</div>;
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl">Browse events</h1>
      <p className="mt-2 text-ink-500">{events.length} events found</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={category === "" ? "btn btn-primary" : "btn btn-outline"}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`capitalize ${category === cat ? "btn btn-primary" : "btn btn-outline"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sm:ml-auto">
          <Dropdown
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "today", label: "Today" },
              { value: "week", label: "This week" },
              { value: "all", label: "All dates" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}
