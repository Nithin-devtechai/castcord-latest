import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [eventId, setEventId] = useState(null);

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("casting_events")
      .insert([
        {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
        },
      ])
      .select();

    if (!error) {
      setLink(`${window.location.origin}/casting-call/${data[0].id}`);
      setEventId(data[0].id);
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="back-link" style={{ marginBottom: "1rem", display: "inline-block" }}>
          ← Back to home
        </Link>
        <h1>Create Casting Call</h1>
        <p>Set up a new event and get a shareable link for applicants.</p>
      </header>

      <div className="card">
        <h2 className="card-title">Event details</h2>

        <div className="form-group">
          <label htmlFor="title">Casting call title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Feature Film – Lead Role"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe the project, role requirements, and what you're looking for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleCreate}>
          Generate & share link
        </button>

        {link && (
          <>
            <div className="link-box">
              <p>Share this link with applicants:</p>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </div>
            {eventId && (
        <Link
          to={`/event/${eventId}`}
          className="btn btn-secondary"
          style={{ marginTop: "1rem", display: "inline-flex", width: "auto", padding: "0.75rem 1.5rem", textDecoration: "none" }}
        >
          View event details
        </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
