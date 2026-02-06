import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>CastCord</h1>
        <p>Create cast calls or view your events.</p>
      </header>

      <div className="options-grid">
        <Link to="/create" className="option-card">
          <h2 className="option-card-title">Create cast call</h2>
          <p className="option-card-desc">Set up a new event and get a shareable link for applicants.</p>
        </Link>

        <Link to="/events" className="option-card">
          <h2 className="option-card-title">View events</h2>
          <p className="option-card-desc">See your events and application details.</p>
        </Link>
      </div>
    </div>
  );
}
