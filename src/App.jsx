import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import CreateEvent from "./pages/CreateEvent";
import CastingForm from "./pages/CastingForm";
import EventDetails from "./pages/EventDetails";
import EventsList from "./pages/EventsList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/casting-call/:eventId" element={<CastingForm />} />
      </Routes>
    </BrowserRouter>
  );
}
