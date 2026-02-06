export default function Modal({ data, onClose }) {
  const name = data?.name?.trim() || "";
  const thankYouHeading = name ? `Thank you, ${name}!` : "Thank you!";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-thank-you" onClick={(e) => e.stopPropagation()}>
        <h3>{thankYouHeading}</h3>
        <p className="modal-message">Your application has been submitted successfully.</p>

        {data?.candidate_photo_url && (
          <div className="modal-photo">
            <img src={data.candidate_photo_url} alt="Your photo" />
          </div>
        )}
        {(data?.youtube_link || data?.portfolio_link) && (
          <div className="modal-links">
            {data.youtube_link && (
              <a href={data.youtube_link} target="_blank" rel="noopener noreferrer">YouTube link</a>
            )}
            {data.portfolio_link && (
              <a href={data.portfolio_link} target="_blank" rel="noopener noreferrer">Portfolio link</a>
            )}
          </div>
        )}

        <pre>{JSON.stringify(data, null, 2)}</pre>

        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
