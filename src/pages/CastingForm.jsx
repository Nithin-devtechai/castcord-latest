import { useParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import Modal from "../components/Modal";

const BUCKET_NAME = "candidate-photos";

export default function CastingForm() {
  const { eventId } = useParams();
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const submitForm = async () => {
    let candidatePhotoUrl = form.candidate_photo_url ?? null;

    if (photoFile) {
      setUploadingPhoto(true);
      const rawExt = (photoFile.name.split(".").pop() || "jpg").toLowerCase();
      const safeExt = ["jpg", "jpeg", "png", "gif", "webp"].includes(rawExt) ? rawExt : "jpg";
      const safeEventId = String(eventId).replace(/[^a-zA-Z0-9_-]/g, "");
      const uniqueId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const filePath = `${safeEventId}/${uniqueId}.${safeExt}`;
      const contentType = photoFile.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, photoFile, {
          upsert: false,
          contentType,
        });

      if (uploadError) {
        const msg = uploadError.message || "Unknown error";
        const code = uploadError.error || uploadError.name || "";
        if (msg.includes("Bucket") || code === "NoSuchBucket" || String(uploadError.statusCode) === "400") {
          alert(
            "Photo upload failed. Make sure the storage bucket \"candidate-photos\" exists in Supabase (Dashboard → Storage → New bucket) and you've run the storage policies SQL.\n\n" + msg
          );
        } else {
          alert("Photo upload failed: " + msg);
        }
        setUploadingPhoto(false);
        return;
      }
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      candidatePhotoUrl = urlData.publicUrl;
      setUploadingPhoto(false);
    }

    const payload = {
      event_id: eventId,
      ...form,
      candidate_photo_url: candidatePhotoUrl,
    };

    const { error } = await supabase.from("casting_applications").insert([payload]);

    if (error) {
      alert("Submission failed: " + error.message);
      return;
    }

    setSubmittedData({ ...form, candidate_photo_url: candidatePhotoUrl });
    setForm({});
    setPhotoFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmittedData(null);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Apply to this casting call</h1>
        <p>Fill in your details below. All fields are optional but recommended.</p>
        <p className="spotlight-text">
          Access your Spotlight account to find your next role. Sign in to the leading casting platform for actors, performers, and casting directors.
        </p>
      </header>

      <div className="card">
        <h2 className="card-title">Personal information</h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              placeholder="Your full name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              spellCheck={false}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              placeholder="Age"
              value={form.age ?? ""}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              spellCheck={false}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            placeholder="City, Country"
            value={form.location ?? ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            spellCheck={false}
          />
        </div>

        <h2 className="card-title" style={{ marginTop: "1.5rem" }}>
          Candidate Photo
        </h2>
        <div className="form-group">
          <label htmlFor="candidate-photo">Upload your photo</label>
          <input
            id="candidate-photo"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          />
          {photoFile && (
            <span className="form-hint" style={{ display: "block", marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Selected: {photoFile.name}
            </span>
          )}
        </div>

        <h2 className="card-title" style={{ marginTop: "1.5rem" }}>
          Profile
        </h2>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <input
              id="gender"
              placeholder="e.g. Male, Female, Non-binary"
              value={form.gender ?? ""}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              spellCheck={false}
            />
          </div>
          <div className="form-group">
            <label htmlFor="native_state">Native state</label>
            <input
              id="native_state"
              placeholder="State / Region"
              value={form.native_state ?? ""}
              onChange={(e) => setForm({ ...form, native_state: e.target.value })}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="languages">Languages spoken</label>
          <input
            id="languages"
            placeholder="e.g. English, Hindi, Tamil"
            value={form.languages ?? ""}
            onChange={(e) => setForm({ ...form, languages: e.target.value })}
            spellCheck={false}
          />
        </div>

        <h2 className="card-title" style={{ marginTop: "1.5rem" }}>
          Links
        </h2>
        <div className="form-group">
          <label htmlFor="youtube_link">Requirement YouTube link</label>
          <input
            id="youtube_link"
            type="url"
            placeholder="https://www.youtube.com/..."
            value={form.youtube_link ?? ""}
            onChange={(e) => setForm({ ...form, youtube_link: e.target.value })}
            spellCheck={false}
          />
        </div>
        <div className="form-group">
          <label htmlFor="portfolio_link">Portfolio link</label>
          <input
            id="portfolio_link"
            type="url"
            placeholder="https://..."
            value={form.portfolio_link ?? ""}
            onChange={(e) => setForm({ ...form, portfolio_link: e.target.value })}
            spellCheck={false}
          />
        </div>

        <button className="btn btn-primary" onClick={submitForm} disabled={uploadingPhoto}>
          {uploadingPhoto ? "Uploading photo…" : "Submit application"}
        </button>
      </div>

      {showModal && <Modal data={submittedData} onClose={closeModal} />}
    </div>
  );
}
