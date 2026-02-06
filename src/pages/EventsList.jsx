import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("casting_events")
        .select("id, title, start_date, end_date, created_at")
        .order("created_at", { ascending: false });

      if (!error) setEvents(data ?? []);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

  return (
    <div className="page">
      <header className="page-header">
        <h1>Your events</h1>
        <p>Click an event to view details and applications.</p>
      </header>

      <div className="card">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        {loading ? (
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem" }}>Loading events…</p>
        ) : events.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", marginTop: "1rem" }}>
            No events yet. <Link to="/create">Create your first cast call</Link>.
          </p>
        ) : (
          <ul className="events-list">
            {events.map((event) => (
              <li key={event.id}>
                <Link to={`/event/${event.id}`} className="event-list-item">
                  <span className="event-list-title">{event.title || "Untitled event"}</span>
                  <span className="event-list-dates">
                    {formatDate(event.start_date)} – {formatDate(event.end_date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
