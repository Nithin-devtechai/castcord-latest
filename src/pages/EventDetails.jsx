import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsError, setApplicationsError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      const { data: eventData, error: eventError } = await supabase
        .from("casting_events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (eventError) {
        setError(eventError.message);
        setLoading(false);
        return;
      }
      setEvent(eventData);
    }

    async function fetchApplications() {
      setApplicationsError(null);
      const { data, error: appError } = await supabase
        .from("casting_applications")
        .select("*")
        .eq("event_id", eventId);

      if (appError) {
        setApplicationsError(appError.message);
        console.error("Applications fetch error:", appError);
        return;
      }
      setApplications(data ?? []);
    }

    fetchEvent().then(() => setLoading(false));
    fetchApplications();
  }, [eventId]);

  useEffect(() => {
    if (!event) return;
    const channel = supabase
      .channel(`applications-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "casting_applications",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => setApplications((prev) => [payload.new, ...prev])
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [event, eventId]);

  if (loading) {
    return (
      <div className="page">
        <p className="page-header" style={{ color: "var(--color-text-muted)" }}>
          Loading event…
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Event not found</h1>
          <p>{error || "This event may have been removed."}</p>
        </header>
        <Link to="/" className="btn btn-secondary" style={{ display: "inline-flex", width: "auto", padding: "0.75rem 1.5rem" }}>
          Create a cast call
        </Link>
      </div>
    );
  }

  const applicantLink = `${window.location.origin}/casting-call/${eventId}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—");

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/events" className="back-link" style={{ marginBottom: "1rem", display: "inline-block" }}>
          ← Back to events
        </Link>
        <h1>{event.title || "Untitled event"}</h1>
        <p>Event details and applicant link</p>
      </header>

      <div className="card">
        <h2 className="card-title">Details</h2>
        {event.description && (
          <p style={{ marginBottom: "1rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
            {event.description}
          </p>
        )}
        <div className="event-meta">
          <span><strong>Start:</strong> {formatDate(event.start_date)}</span>
          <span><strong>End:</strong> {formatDate(event.end_date)}</span>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Share with applicants</h2>
        <div className="link-box">
          <p>Applicants use this link to submit their application:</p>
          <a href={applicantLink} target="_blank" rel="noopener noreferrer">
            {applicantLink}
          </a>
        </div>
        <Link
          to={`/casting-call/${eventId}`}
          className="btn btn-primary"
          style={{ marginTop: "1rem", display: "inline-flex", width: "auto" }}
        >
          Open application form
        </Link>
      </div>

      <div className="card">
        <h2 className="card-title">Applications ({applications.length})</h2>
        {applicationsError ? (
          <div className="applications-error">
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
              Could not load applications. If you use Supabase Row Level Security (RLS), enable read access for{" "}
              <code>casting_applications</code> (e.g. allow <code>SELECT</code> for <code>anon</code>).
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Error: {applicationsError}
            </p>
          </div>
        ) : applications.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", margin: 0 }}>No applications yet.</p>
        ) : (
          <ul className="applications-list">
            {applications.map((app) => (
              <li key={app.id} className="application-item">
                <div className="application-header">
                  {app.candidate_photo_url && (
                    <img
                      src={app.candidate_photo_url}
                      alt={`${app.name || "Applicant"}`}
                      className="application-photo"
                    />
                  )}
                  <div className="application-header-text">
                    <strong>{app.name || "Unnamed"}</strong>
                    {app.email && <span className="application-email">{app.email}</span>}
                  </div>
                </div>
                <div className="application-details">
                  {app.age && <span>Age: {app.age}</span>}
                  {app.phone && <span>Phone: {app.phone}</span>}
                  {app.location && <span>Location: {app.location}</span>}
                  {app.gender && <span>Gender: {app.gender}</span>}
                  {app.languages && <span>Languages: {app.languages}</span>}
                  {app.youtube_link && (
                    <span>
                      <a href={app.youtube_link} target="_blank" rel="noopener noreferrer">YouTube</a>
                    </span>
                  )}
                  {app.portfolio_link && (
                    <span>
                      <a href={app.portfolio_link} target="_blank" rel="noopener noreferrer">Portfolio</a>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="/events" className="btn btn-secondary" style={{ display: "inline-flex", width: "auto", padding: "0.75rem 1.5rem", textDecoration: "none" }}>
          ← Back to events
        </Link>
        <Link to="/" className="btn btn-secondary" style={{ display: "inline-flex", width: "auto", padding: "0.75rem 1.5rem", textDecoration: "none" }}>
          Home
        </Link>
      </div>
    </div>
  );
}
