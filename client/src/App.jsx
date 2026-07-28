import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute, {
  PublicOnlyRoute,
} from "./components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEventsPage from "./pages/MyEventsPage";

function Placeholder({ title }) {
  return (
    <div className="container-page py-12">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-ink-500">Coming next.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage mode="login" />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <AuthPage mode="signup" />
              </PublicOnlyRoute>
            }
          />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
